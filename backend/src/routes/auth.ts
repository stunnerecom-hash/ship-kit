import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const RegisterSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name:     z.string().min(1).optional(),
});

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req: Request, res: Response) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }
  const { email, password, name } = parsed.data;
  try {
    const exists = await db.user.findUnique({ where: { email } });
    if (exists) {
      res.status(409).json({ success: false, error: "Email already in use" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({ data: { email, passwordHash, name } });
    const token = signToken({ userId: user.id, email: user.email });
    res.status(201).json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } } });
  } catch {
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Invalid email or password" });
    return;
  }
  const { email, password } = parsed.data;
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }
    const token = signToken({ userId: user.id, email: user.email });
    res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } } });
  } catch {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where:  { id: req.user!.userId },
      select: { id: true, email: true, name: true, plan: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ success: false, error: "User not found" }); return; }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
});

export default router;
