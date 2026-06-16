"use client";
import { useState } from "react";

interface Plan {
  name:      string;
  price:     string;
  period:    string;
  priceId:   string;
  mode:      "payment" | "subscription";
  features:  string[];
  featured?: boolean;
  cta:       string;
}

const PLANS: Plan[] = [
  {
    name:    "Starter",
    price:   "$9",
    period:  "/mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
    mode:    "subscription",
    cta:     "Get started",
    features: [
      "Up to 1,000 users",
      "Core features",
      "Email support",
      "Basic analytics",
    ],
  },
  {
    name:    "Pro",
    price:   "$29",
    period:  "/mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "",
    mode:    "subscription",
    cta:     "Go Pro",
    featured: true,
    features: [
      "Unlimited users",
      "All features",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
  },
  {
    name:    "Lifetime",
    price:   "$149",
    period:  " once",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME ?? "",
    mode:    "payment",
    cta:     "Buy lifetime",
    features: [
      "Everything in Pro",
      "Lifetime updates",
      "Future features included",
      "Commercial licence",
    ],
  },
];

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: Plan) {
    if (!plan.priceId) {
      alert("Price not configured — set NEXT_PUBLIC_STRIPE_PRICE_* env vars.");
      return;
    }
    setLoading(plan.name);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
      const res = await fetch(`${backendUrl}/api/v1/payments/checkout`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ priceId: plan.priceId, mode: plan.mode }),
      });
      const body = (await res.json()) as { success: boolean; data?: { url: string }; error?: string };
      if (body.success && body.data?.url) {
        window.location.href = body.data.url;
      } else {
        alert(body.error ?? "Checkout failed");
        setLoading(null);
      }
    } catch {
      alert("Could not connect to server");
      setLoading(null);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className={[
            "relative flex flex-col rounded-2xl border p-8 transition-shadow",
            plan.featured
              ? "border-blue-500 bg-blue-600/5 shadow-lg shadow-blue-500/10"
              : "border-gray-800 bg-gray-900",
          ].join(" ")}
        >
          {plan.featured && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-xs font-semibold">
              Most popular
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">{plan.name}</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-gray-400 mb-1">{plan.period}</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleCheckout(plan)}
            disabled={loading === plan.name}
            className={[
              "w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-50",
              plan.featured
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-white",
            ].join(" ")}
          >
            {loading === plan.name ? "Redirecting..." : plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
