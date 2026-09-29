"use client";
import { useState } from "react";
import { SUPPLIER_CATEGORIES, SupplierCategory } from "@/lib/suppliers";
import {
  ChipGroup, FormStatus, INPUT, SubmitRow, SuccessBanner, formReader, submitApplication, toggle,
} from "@/components/ApplicationForm";

export default function SupplierApplicationForm() {
  const [status,  setStatus]  = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<SupplierCategory[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (categories.length === 0) {
      setStatus("error");
      setMessage("Pick at least one product category.");
      return;
    }
    const { text, int, checked } = formReader(e.currentTarget);

    setStatus("loading");
    const error = await submitApplication("/api/v1/suppliers/apply", {
      companyName:    text("companyName"),
      contactName:    text("contactName"),
      email:          text("email"),
      phone:          text("phone"),
      website:        text("website"),
      country:        text("country"),
      categories,
      offersDropship: checked("offersDropship"),
      shipsToUS:      checked("shipsToUS"),
      moq:            int("moq"),
      leadTimeDays:   int("leadTimeDays"),
      message:        text("message"),
    });
    setStatus(error ? "error" : "success");
    setMessage(error ?? "Application received. Our sourcing team will review it and get back to you.");
  }

  if (status === "success") return <SuccessBanner message={message} />;

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

      <ChipGroup
        legend="What do you supply? *"
        options={SUPPLIER_CATEGORIES}
        selected={categories}
        onToggle={(id) => setCategories((prev) => toggle(prev, id))}
      />

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

      <SubmitRow status={status} message={message} idle="Apply as a supplier" busy="Submitting..." />
    </form>
  );
}
