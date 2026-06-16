import { Router, Request, Response } from "express";
import { z } from "zod";
import { stripe, createCheckout } from "../lib/stripe";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { db } from "../lib/prisma";

const router = Router();

const CheckoutSchema = z.object({
  priceId:    z.string().min(1),
  mode:       z.enum(["payment", "subscription"]),
  successUrl: z.string().url().optional(),
  cancelUrl:  z.string().url().optional(),
});

// POST /api/v1/payments/checkout
// Creates a Stripe Checkout session. Auth optional — pass JWT to attach to customer.
router.post("/checkout", async (req: AuthRequest, res: Response) => {
  const parsed = CheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }
  const { priceId, mode, successUrl, cancelUrl } = parsed.data;
  const origin = req.headers.origin ?? process.env.FRONTEND_URL ?? "http://localhost:3000";

  let customerId: string | undefined;

  // If authenticated, ensure this user has a Stripe customer
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { verifyToken } = await import("../lib/jwt");
      const payload = verifyToken(authHeader.slice(7));
      const user    = await db.user.findUnique({ where: { id: payload.userId } });
      if (user) {
        if (user.stripeCustomerId) {
          customerId = user.stripeCustomerId;
        } else {
          const customer = await stripe.customers.create({ email: user.email, name: user.name ?? undefined });
          await db.user.update({ where: { id: user.id }, data: { stripeCustomerId: customer.id } });
          customerId = customer.id;
        }
      }
    } catch { /* unauthenticated — proceed without customer */ }
  }

  try {
    const url = await createCheckout({
      priceId,
      mode,
      customerId,
      successUrl:  successUrl ?? `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:   cancelUrl  ?? `${origin}/#pricing`,
    });
    res.json({ success: true, data: { url } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout";
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/v1/payments/webhook
// Receives Stripe webhook events and updates user plan on subscription changes.
router.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(400).json({ error: "Missing signature or webhook secret" });
    return;
  }
  let event: ReturnType<typeof stripe.webhooks.constructEvent> | undefined;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = typeof session.customer === "string" ? session.customer : null;
        if (customerId && session.mode === "subscription") {
          await db.user.updateMany({ where: { stripeCustomerId: customerId }, data: { plan: "pro" } });
        }
        if (customerId && session.mode === "payment") {
          await db.user.updateMany({ where: { stripeCustomerId: customerId }, data: { plan: "lifetime" } });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (customerId) {
          await db.user.updateMany({ where: { stripeCustomerId: customerId }, data: { plan: "free" } });
        }
        break;
      }
    }
    res.json({ received: true });
  } catch {
    res.status(500).json({ error: "Webhook handler failed" });
  }
});

// GET /api/v1/payments/portal  (auth required)
// Opens Stripe billing portal so the user can manage their subscription.
router.get("/portal", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await db.user.findUnique({ where: { id: req.user!.userId } });
  if (!user?.stripeCustomerId) {
    res.status(400).json({ success: false, error: "No billing account found" });
    return;
  }
  const origin = req.headers.origin ?? process.env.FRONTEND_URL ?? "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer:    user.stripeCustomerId,
    return_url:  `${origin}/dashboard`,
  });
  res.json({ success: true, data: { url: session.url } });
});

export default router;
