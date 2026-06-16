import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../lib/prisma";

const router = Router();

const Schema = z.object({ email: z.string().email() });

router.post("/", async (req: Request, res: Response) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Valid email required" });
    return;
  }
  try {
    await db.waitlistEntry.upsert({
      where:  { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Could not save email" });
  }
});

router.get("/count", async (_req: Request, res: Response) => {
  const count = await db.waitlistEntry.count();
  res.json({ success: true, data: { count } });
});

export default router;
