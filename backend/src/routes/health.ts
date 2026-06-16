import { Router } from "express";
import { db } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ success: true, status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ success: false, status: "degraded", db: "disconnected" });
  }
});

export default router;
