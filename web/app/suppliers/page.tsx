import type { Metadata } from "next";
import PartnerPage from "@/components/PartnerPage";
import SupplierApplicationForm from "@/components/SupplierApplicationForm";

const APP = process.env.NEXT_PUBLIC_APP_NAME ?? "ShipKit";

export const metadata: Metadata = {
  title:       `Become a supplier · ${APP}`,
  description: "Supply robotic mowers, smart irrigation, outdoor lighting and parts to homeowners through our store and installer network.",
};

export default function SuppliersPage() {
  return (
    <PartnerPage
      program="suppliers"
      app={APP}
      eyebrow="Supplier program"
      title="Get your products into more yards."
      intro={`${APP} is a store built only for yard and outdoor automation. We're looking for manufacturers and distributors whose products we can stand behind, and our installer network makes sure they get set up right.`}
      benefits={[
        {
          title: "A focused audience",
          body:  "Our customers come to us specifically for yard automation, so your products sit in front of buyers who already know what they want.",
        },
        {
          title: "Installed properly, reviewed fairly",
          body:  "Our partner installers set products up in the field. Correct installs mean fewer returns, fewer support tickets and better reviews.",
        },
        {
          title: "Feedback from the field",
          body:  "Installers see how your products hold up in real yards. We pass that back to you so you can improve products and documentation.",
        },
        {
          title: "Flexible fulfilment",
          body:  "Wholesale, dropship or a mix. Tell us how you prefer to work and we'll find a setup that suits both sides.",
        },
        {
          title: "We do the merchandising",
          body:  "We write the product pages, comparison guides and how-to content that help customers pick the right product for their yard.",
        },
        {
          title: "A long-term partner",
          body:  "We'd rather carry fewer brands and grow with them than list everything. Approved suppliers get a direct contact on our team.",
        },
      ]}
      requirements={[
        "You make or distribute products in our categories: robotic mowers, smart irrigation, sprinklers, outdoor lighting, sensors, gate and garage automation, outdoor cameras, power and solar, or parts.",
        "US compliance where it applies: FCC for wireless devices, UL or ETL listing for mains-powered products, and published IP ratings for outdoor gear.",
        "Reliable stock and honest lead times, shipping to the US or from a US warehouse.",
        "A real warranty process and replacement parts available for the life of the product.",
        "English manuals and install guides our installers can work from.",
        "Wholesale or dropship pricing, and a clear MAP policy if you have one.",
      ]}
      steps={[
        { title: "Apply",         body: "Tell us about your company, product range, minimums and lead times." },
        { title: "Review",        body: "We look at your catalog, certifications, pricing and how you fit our range." },
        { title: "Samples & terms", body: "We test samples, often with an installer, and agree pricing and fulfilment." },
        { title: "Go live",       body: "We list your products and brief our installer network on them." },
      ]}
      crossLink={{
        title: "Install yard automation instead?",
        body:  "Join our installer network and set up the products our customers buy.",
        cta:   "Become an installer",
      }}
      formTitle="Apply as a supplier"
      formIntro="It takes about five minutes. We review every application and reply by email."
    >
      <SupplierApplicationForm />
    </PartnerPage>
  );
}
