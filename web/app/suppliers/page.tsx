import type { Metadata } from "next";
import SupplierApplicationForm from "@/components/SupplierApplicationForm";

const APP = process.env.NEXT_PUBLIC_APP_NAME ?? "ShipKit";

export const metadata: Metadata = {
  title:       `Become a supplier · ${APP}`,
  description: "Supply smart yard and outdoor automation products to our customers.",
};

export default function SuppliersPage() {
  return (
    <main className="px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Become a supplier</h1>
        <p className="text-lg text-gray-400 mb-12 leading-relaxed">
          We stock robotic mowers, smart irrigation, outdoor lighting and the parts that keep them
          running. If you make or distribute yard automation products, apply below. We review every
          application and reply by email.
        </p>
        <SupplierApplicationForm />
      </div>
    </main>
  );
}
