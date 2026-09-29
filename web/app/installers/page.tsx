import type { Metadata } from "next";
import InstallerApplicationForm from "@/components/InstallerApplicationForm";

const APP = process.env.NEXT_PUBLIC_APP_NAME ?? "ShipKit";

export const metadata: Metadata = {
  title:       `Become an installer · ${APP}`,
  description: "Join our network of certified installers for smart yard and outdoor automation.",
};

export default function InstallersPage() {
  return (
    <main className="px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Become an installer</h1>
        <p className="text-lg text-gray-400 mb-12 leading-relaxed">
          Our customers buy robotic mowers, smart irrigation and outdoor lighting, and many of them
          want a pro to set it up. If you install or service yard automation, apply below to join our
          installer network. We review every application and reply by email.
        </p>
        <InstallerApplicationForm />
      </div>
    </main>
  );
}
