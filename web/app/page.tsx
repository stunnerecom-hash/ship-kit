import WaitlistForm from "@/components/WaitlistForm";
import PricingSection from "@/components/PricingSection";

const APP = process.env.NEXT_PUBLIC_APP_NAME ?? "ShipKit";

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Open beta — join the waitlist
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Ship your product<br />
          <span className="text-blue-500">faster than ever.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          {APP} is a production-ready full-stack starter. Auth, payments, and
          one-command deploy — so you can focus on what makes your product unique.
        </p>

        <WaitlistForm />

        <p className="mt-4 text-sm text-gray-600">
          No spam. Unsubscribe anytime.
        </p>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need on day one
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-800 bg-gray-900">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-center text-gray-400 mb-16">
            Start free. Upgrade when you ship.
          </p>
          <PricingSection />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-gray-800 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} {APP}. Built with ShipKit.
        {" · "}
        <a href="/suppliers" className="hover:text-gray-400 underline underline-offset-2">Become a supplier</a>
        {" · "}
        <a href="/installers" className="hover:text-gray-400 underline underline-offset-2">Become an installer</a>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon:  "🔐",
    title: "Auth out of the box",
    body:  "Email + password login with JWT. Register, login, and /me endpoints ready to use.",
  },
  {
    icon:  "💳",
    title: "Stripe payments",
    body:  "One-time payments and subscriptions via Stripe Checkout. Webhooks update user plan automatically.",
  },
  {
    icon:  "🚀",
    title: "One-command deploy",
    body:  "Backend to Railway, web to Vercel. Full deploy in under 5 minutes from a fresh clone.",
  },
];
