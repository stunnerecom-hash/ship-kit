import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true }));

// Stripe webhook needs the raw body — wire it BEFORE express.json()
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

import healthRouter   from "./routes/health";
import authRouter     from "./routes/auth";
import paymentsRouter from "./routes/payments";
import waitlistRouter from "./routes/waitlist";

app.use("/api/v1/health",   healthRouter);
app.use("/api/v1/auth",     authRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/waitlist", waitlistRouter);

app.listen(PORT, () => console.log(`ship-kit backend running on :${PORT}`));

export default app;
