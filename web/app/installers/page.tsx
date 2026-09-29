import type { Metadata } from "next";
import PartnerPage from "@/components/PartnerPage";
import InstallerApplicationForm from "@/components/InstallerApplicationForm";

const APP = process.env.NEXT_PUBLIC_APP_NAME ?? "ShipKit";

export const metadata: Metadata = {
  title:       `Become an installer · ${APP}`,
  description: "Join our installer network and set up robotic mowers, smart irrigation and outdoor lighting for homeowners in your area.",
};

export default function InstallersPage() {
  return (
    <PartnerPage
      program="installers"
      app={APP}
      eyebrow="Installer network"
      title="Install the future of the backyard."
      intro={`Our customers buy robotic mowers, smart irrigation and outdoor lighting from ${APP}, and many of them want a pro to set it up. We're building a network of trusted local installers to do that work.`}
      benefits={[
        {
          title: "Customers who are ready to go",
          body:  "The homeowner has already chosen and bought the equipment. You show up to install it, not to sell it.",
        },
        {
          title: "Work in your area",
          body:  "You tell us which states and how far you travel, and we match you with jobs inside that area.",
        },
        {
          title: "Gear you know",
          body:  "We sell a focused range from vetted suppliers, so you install the same products again and again instead of a new brand every job.",
        },
        {
          title: "Backup when you need it",
          body:  "Product documentation, a direct line to our team, and a route to the supplier for warranty issues so you're not stuck on site.",
        },
        {
          title: "Repeat work",
          body:  "Robotic mowers, irrigation and lighting need seasonal service. A good install often turns into a long-term customer.",
        },
        {
          title: "Grow with a new category",
          body:  "Yard automation is still new to most homeowners. Get in early and become the go-to pro for it in your area.",
        },
      ]}
      requirements={[
        "Hands-on experience with irrigation, low-voltage electrical, landscaping or outdoor tech.",
        "Licensed where your state or city requires it for the work you do.",
        "General liability insurance.",
        "A defined service area and the ability to schedule jobs within a reasonable time.",
        "Comfortable with apps and Wi-Fi: pairing devices and showing the homeowner how to use them.",
        "A professional, tidy standard of work and good reviews or references.",
      ]}
      steps={[
        { title: "Apply",              body: "Tell us about your business, services, service area, licence and insurance." },
        { title: "Review",             body: "We check your licence, insurance and references." },
        { title: "Intro & onboarding", body: "A short call to agree how jobs, scheduling and pricing work, plus product briefings." },
        { title: "Start taking jobs",  body: "We send you installs from customers in your service area." },
      ]}
      crossLink={{
        title: "Make or distribute yard automation products?",
        body:  "Apply to our supplier program and get your products installed by our network.",
        cta:   "Become a supplier",
      }}
      formTitle="Apply as an installer"
      formIntro="It takes about five minutes. We review every application and reply by email."
    >
      <InstallerApplicationForm />
    </PartnerPage>
  );
}
