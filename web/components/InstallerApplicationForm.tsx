"use client";
import { useState } from "react";
import { INSTALLER_SERVICES, InstallerService, US_STATES, UsState } from "@/lib/installers";
import {
  ChipGroup, FormStatus, INPUT, SubmitRow, SuccessBanner, formReader, submitApplication, toggle,
} from "@/components/ApplicationForm";

const STATE_OPTIONS = US_STATES.map((s) => ({ id: s, label: s }));

export default function InstallerApplicationForm() {
  const [status,  setStatus]  = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [services, setServices] = useState<InstallerService[]>([]);
  const [states,   setStates]   = useState<UsState[]>([]);
  const [licensed, setLicensed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const missing = services.length === 0 ? "Pick at least one service." : states.length === 0 ? "Pick at least one state you serve." : "";
    if (missing) {
      setStatus("error");
      setMessage(missing);
      return;
    }
    const { text, int, checked } = formReader(e.currentTarget);

    setStatus("loading");
    const error = await submitApplication("/api/v1/installers/apply", {
      businessName:       text("businessName"),
      contactName:        text("contactName"),
      email:              text("email"),
      phone:              text("phone"),
      website:            text("website"),
      baseZip:            text("baseZip"),
      serviceStates:      states,
      serviceRadiusMiles: int("serviceRadiusMiles"),
      services,
      licensed,
      licenseNumber:      licensed ? text("licenseNumber") : undefined,
      insured:            checked("insured"),
      yearsInBusiness:    int("yearsInBusiness"),
      crewSize:           int("crewSize"),
      message:            text("message"),
    });
    setStatus(error ? "error" : "success");
    setMessage(error ?? "Application received. Our installer network team will review it and get back to you.");
  }

  if (status === "success") return <SuccessBanner message={message} />;

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="businessName" required maxLength={200} placeholder="Business name *" className={INPUT} />
        <input name="contactName" required maxLength={200} placeholder="Contact name *" className={INPUT} />
        <input name="email" type="email" required placeholder="Email *" className={INPUT} />
        <input name="phone" type="tel" required minLength={7} maxLength={50} placeholder="Phone *" className={INPUT} />
        <input name="website" type="url" placeholder="https://yourbusiness.com" className={INPUT} />
        <input name="baseZip" required inputMode="numeric" pattern="\d{5}" maxLength={5} placeholder="Base ZIP code *" className={INPUT} />
      </div>

      <ChipGroup
        legend="What do you install or service? *"
        options={INSTALLER_SERVICES}
        selected={services}
        onToggle={(id) => setServices((prev) => toggle(prev, id))}
      />

      <ChipGroup
        legend="States you serve *"
        options={STATE_OPTIONS}
        selected={states}
        onToggle={(id) => setStates((prev) => toggle(prev, id))}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <input name="serviceRadiusMiles" type="number" min={1} max={500} step={1} placeholder="Service radius (miles)" className={INPUT} />
        <input name="yearsInBusiness" type="number" min={0} max={100} step={1} placeholder="Years in business" className={INPUT} />
        <input name="crewSize" type="number" min={1} max={1000} step={1} placeholder="Crew size" className={INPUT} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={licensed} onChange={(e) => setLicensed(e.target.checked)} className="accent-blue-500" />
          Licensed contractor
        </label>
        <label className="flex items-center gap-2">
          <input name="insured" type="checkbox" className="accent-blue-500" /> Carries liability insurance
        </label>
      </div>
      {licensed && (
        <input name="licenseNumber" maxLength={100} placeholder="License number" className={INPUT} />
      )}

      <textarea
        name="message"
        rows={4}
        maxLength={2000}
        placeholder="Tell us about your experience, brands you've installed and typical job size."
        className={INPUT}
      />

      <SubmitRow status={status} message={message} idle="Apply as an installer" busy="Submitting..." />
    </form>
  );
}
