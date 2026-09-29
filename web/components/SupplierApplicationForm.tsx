"use client";
import { useState } from "react";
import { SUPPLIER_CATEGORIES, SupplierCategory } from "@/lib/suppliers";

type Status = "idle" | "loading" | "success" | "error";

const INPUT =
  "w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";

export default function SupplierApplicationForm() {
  const [status,  setStatus]  = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<SupplierCategory[]>([]);

  function toggleCategory(id: SupplierCategory) {
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (categories.length === 0) {
      setStatus("error");
      setMessage("Pick at least one product category.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const text = (k: string) => String(form.get(k) ?? "").trim();
    const int  = (k: string) => (text(k) ? Number(text(k)) : undefined);

    setStatus("loading");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
      const res = await fetch(`${backendUrl}/api/v1/suppliers/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          companyName:    text("companyName"),
          contactName:    text("contactName"),
          email:          text("email"),
          phone:          text("phone"),
          website:        text("website"),
          country:        text("country"),
          categories,
          offersDropship: form.get("offersDropship") === "on",
          shipsToUS:      form.get("shipsToUS") === "on",
          moq:            int("moq"),
          leadTimeDays:   int("leadTimeDays"),
          message:        text("message"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Application received. Our sourcing team will review it and get back to you.");
      } else {
        const body = (await res.json()) as { error?: string };
        setStatus("error");
        setMessage(body.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not connect. Check your internet and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
        <span>✓</span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="companyName" required maxLength={200} placeholder="Company name *" className={INPUT} />
        <input name="contactName" required maxLength={200} placeholder="Contact name *" className={INPUT} />
        <input name="email" type="email" required placeholder="Work email *" className={INPUT} />
        <input name="phone" type="tel" maxLength={50} placeholder="Phone" className={INPUT} />
        <input name="website" type="url" placeholder="https://yourcompany.com" className={INPUT} />
        <input name="country" required minLength={2} maxLength={100} placeholder="Country *" className={INPUT} />
      </div>

      <fieldset>
        <legend className="text-sm text-gray-400 mb-3">What do you supply? *</legend>
        <div className="flex flex-wrap gap-2">
          {SUPPLIER_CATEGORIES.map((c) => {
            const on = categories.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleCategory(c.id)}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  on
                    ? "border-blue-500 bg-blue-500/15 text-blue-300"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="moq" type="number" min={1} step={1} placeholder="Minimum order quantity (units)" className={INPUT} />
        <input name="leadTimeDays" type="number" min={0} max={365} step={1} placeholder="Lead time (days)" className={INPUT} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input name="shipsToUS" type="checkbox" className="accent-blue-500" /> Ships to the US
        </label>
        <label className="flex items-center gap-2">
          <input name="offersDropship" type="checkbox" className="accent-blue-500" /> Offers dropshipping
        </label>
      </div>

      <textarea
        name="message"
        rows={4}
        maxLength={2000}
        placeholder="Tell us about your products, certifications (FCC, UL, CE) and pricing."
        className={INPUT}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold transition-colors"
      >
        {status === "loading" ? "Submitting..." : "Apply as a supplier"}
      </button>
      {status === "error" && <p className="text-red-400 text-sm">{message}</p>}
    </form>
  );
}
