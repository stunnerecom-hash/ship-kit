import { Router, Request, Response } from "express";
import { z } from "zod";
import { SupplierStatus } from "@prisma/client";
import { db } from "../lib/prisma";
import { requireAdmin } from "../middleware/admin";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// Product categories Yard Automation Pros sources. Keep in sync with web/lib/suppliers.ts.
export const SUPPLIER_CATEGORIES = [
  "robotic-mowers",
  "smart-irrigation",
  "sprinkler-hardware",
  "outdoor-lighting",
  "sensors-weather",
  "gate-garage-automation",
  "outdoor-cameras-security",
  "power-batteries-solar",
  "accessories-parts",
] as const;

// Allowed review transitions. REJECTED can be reopened for a second look.
const TRANSITIONS: Record<SupplierStatus, SupplierStatus[]> = {
  APPLIED:   ["REVIEWING", "REJECTED"],
  REVIEWING: ["APPROVED", "REJECTED"],
  APPROVED:  ["REJECTED"],
  REJECTED:  ["REVIEWING"],
};

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => v || undefined);

const ApplySchema = z.object({
  companyName:    z.string().trim().min(1, "Company name is required").max(200),
  contactName:    z.string().trim().min(1, "Contact name is required").max(200),
  email:          z.string().trim().toLowerCase().email("Valid email required"),
  phone:          optionalText(50),
  website:        z.union([z.string().trim().url("Website must be a valid URL"), z.literal("")]).optional()
                    .transform((v) => v || undefined),
  country:        z.string().trim().min(2, "Country is required").max(100),
  categories:     z.array(z.enum(SUPPLIER_CATEGORIES)).min(1, "Pick at least one category"),
  offersDropship: z.boolean().default(false),
  shipsToUS:      z.boolean().default(false),
  moq:            z.number().int().min(1).max(1_000_000).optional(),
  leadTimeDays:   z.number().int().min(0).max(365).optional(),
  message:        optionalText(2000),
});

const StatusSchema = z.object({
  status:      z.nativeEnum(SupplierStatus),
  reviewNotes: optionalText(2000),
});

const ListSchema = z.object({
  status:   z.nativeEnum(SupplierStatus).optional(),
  category: z.enum(SUPPLIER_CATEGORIES).optional(),
});

// ── Public ──────────────────────────────────────────────────────────────

router.get("/categories", (_req: Request, res: Response) => {
  res.json({ success: true, data: SUPPLIER_CATEGORIES });
});

router.post("/apply", async (req: Request, res: Response) => {
  const parsed = ApplySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }
  try {
    // Only rejected suppliers may re-apply.
    const existing = await db.supplierApplication.findFirst({
      where: { email: parsed.data.email, status: { not: "REJECTED" } },
    });
    if (existing) {
      const error = existing.status === "APPROVED"
        ? "This email already belongs to an approved supplier"
        : "An application from this email is already under review";
      res.status(409).json({ success: false, error });
      return;
    }
    const app = await db.supplierApplication.create({ data: parsed.data });
    res.status(201).json({ success: true, data: { id: app.id, status: app.status } });
  } catch {
    res.status(500).json({ success: false, error: "Could not submit application" });
  }
});

// ── Admin ───────────────────────────────────────────────────────────────

router.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  const parsed = ListSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }
  const { status, category } = parsed.data;
  try {
    const applications = await db.supplierApplication.findMany({
      where:   { status, ...(category && { categories: { has: category } }) },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: applications });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

router.get("/stats", requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db.supplierApplication.groupBy({ by: ["status"], _count: { _all: true } });
    const counts = Object.fromEntries(Object.values(SupplierStatus).map((s) => [s, 0])) as Record<SupplierStatus, number>;
    for (const r of rows) counts[r.status] = r._count._all;
    res.json({ success: true, data: counts });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

router.get("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const app = await db.supplierApplication.findUnique({ where: { id: req.params.id } });
    if (!app) { res.status(404).json({ success: false, error: "Application not found" }); return; }
    res.json({ success: true, data: app });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch application" });
  }
});

router.patch("/:id/status", requireAdmin, async (req: AuthRequest, res: Response) => {
  const parsed = StatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }
  const { status, reviewNotes } = parsed.data;
  try {
    const app = await db.supplierApplication.findUnique({ where: { id: req.params.id } });
    if (!app) { res.status(404).json({ success: false, error: "Application not found" }); return; }
    if (!TRANSITIONS[app.status].includes(status)) {
      res.status(409).json({ success: false, error: `Cannot move from ${app.status} to ${status}` });
      return;
    }
    // Conditional on the status we read, so two concurrent reviews can't both win.
    const { count } = await db.supplierApplication.updateMany({
      where: { id: app.id, status: app.status },
      data:  { status, reviewNotes, reviewedBy: req.user!.email, reviewedAt: new Date() },
    });
    if (count === 0) {
      res.status(409).json({ success: false, error: "Application was updated by someone else, reload and retry" });
      return;
    }
    const updated = await db.supplierApplication.findUnique({ where: { id: app.id } });
    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update application" });
  }
});

export default router;
