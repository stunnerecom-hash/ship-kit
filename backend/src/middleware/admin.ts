import { Response, NextFunction } from "express";
import { requireAuth, AuthRequest } from "./auth";

// Comma-separated list of emails allowed to use admin endpoints.
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (!ADMIN_EMAILS.has(req.user!.email.toLowerCase())) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }
    next();
  });
}
