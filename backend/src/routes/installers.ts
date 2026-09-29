import { Router, Request, Response } from "express";
import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";
import { db } from "../lib/prisma";
import { TRANSITIONS, StatusSchema, optionalText, optionalUrl, duplicateError, statusCounts } from "../lib/applications";
import { requireAdmin } from "../middleware/admin";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// Services Yard Automation Pros books installers for. Keep in sync with web/lib/installers.ts.
export const INSTALLER_SERVICES = [
  "robotic-mower-setup",
  "irrigation-controller-install",
  "sprinkler-install-repair",
  "outdoor-lighting-install",
  "gate-garage-automation",
  "security-camera-install",
  "solar-battery-install",
  "smart-home-integration",
  "seasonal-maintenance",
] as const;

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
  "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

const State = z.string().trim().toUpperCase().pipe(z.enum(US_STATES, { message: "Invalid US state" }));

const ApplySchema = z.object({
  businessName:       z.string().trim().min(1, "Business name is required").max(200),
  contactName:        z.string().trim().min(1, "Contact name is required").max(200),
  email:              z.string().trim().toLowerCase().email("Valid email required"),
  phone:              z.string().trim().min(7, "Phone is required").max(50),
  website:            optionalUrl("Website must be a valid URL"),
  baseZip:            z.string().trim().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  serviceStates:      z.array(State).min(1, "Pick at least one state you serve").max(US_STATES.length)
                        .transform((s) => [...new Set(s)]),
  serviceRadiusMiles: z.number().int().min(1).max(500).optional(),
  services:           z.array(z.enum(INSTALLER_SERVICES)).min(1, "Pick at least one service"),
  licensed:           z.boolean().default(false),
  licenseNumber:      optionalText(100),
  insured:            z.boolean().default(false),
  yearsInBusiness:    z.number().int().min(0).max(100).optional(),
  crewSize:           z.number().int().min(1).max(1000).optional(),
  message:            optionalText(2000),
});

const ListSchema = z.object({
  status:  z.nativeEnum(ApplicationStatus).optional(),
  service: z.enum(INSTALLER_SERVICES).optional(),
  state:   State.optional(),
});

// ── Public ──────────────────────────────────────────────────────────────

router.get("/services", (_req: Request, res: Response) => {
  res.json({ success: true, data: INSTALLER_SERVICES });
});

router.post("/apply", async (req: Request, res: Response) => {
  const parsed = ApplySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }
  try {
    const existing = await db.installerApplication.findFirst({
      where: { email: parsed.data.email, status: { not: "REJECTED" } },
    });
    const error = duplicateError(existing, "installer");
    if (error) {
      res.status(409).json({ success: false, error });
      return;
    }
    const app = await db.installerApplication.create({ data: parsed.data });
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
  const { status, service, state } = parsed.data;
  try {
    const applications = await db.installerApplication.findMany({
      where:   {
        status,
        ...(service && { services: { has: service } }),
        ...(state && { serviceStates: { has: state } }),
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: applications });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

router.get("/stats", requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db.installerApplication.groupBy({ by: ["status"], _count: { _all: true } });
    res.json({ success: true, data: statusCounts(rows) });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

router.get("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const app = await db.installerApplication.findUnique({ where: { id: req.params.id } });
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
    const app = await db.installerApplication.findUnique({ where: { id: req.params.id } });
    if (!app) { res.status(404).json({ success: false, error: "Application not found" }); return; }
    if (!TRANSITIONS[app.status].includes(status)) {
      res.status(409).json({ success: false, error: `Cannot move from ${app.status} to ${status}` });
      return;
    }
    // Conditional on the status we read, so two concurrent reviews can't both win.
    const { count } = await db.installerApplication.updateMany({
      where: { id: app.id, status: app.status },
      data:  { status, reviewNotes, reviewedBy: req.user!.email, reviewedAt: new Date() },
    });
    if (count === 0) {
      res.status(409).json({ success: false, error: "Application was updated by someone else, reload and retry" });
      return;
    }
    const updated = await db.installerApplication.findUnique({ where: { id: app.id } });
    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update application" });
  }
});

export default router;
