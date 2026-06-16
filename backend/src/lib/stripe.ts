import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export interface CheckoutParams {
  priceId:    string;
  mode:       "payment" | "subscription";
  customerId?: string;
  successUrl: string;
  cancelUrl:  string;
  metadata?:  Record<string, string>;
}

export async function createCheckout(params: CheckoutParams): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode:       params.mode,
    customer:   params.customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url:  params.cancelUrl,
    metadata:    params.metadata,
    allow_promotion_codes: true,
  });
  if (!session.url) throw new Error("No Stripe checkout URL returned");
  return session.url;
}
