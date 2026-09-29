import Link from "next/link";

// Layout for the partner program pages (/suppliers, /installers). Each page supplies its own copy and form.

export type Program = "suppliers" | "installers";

const PROGRAMS: { id: Program; href: string; label: string }[] = [
  { id: "suppliers",  href: "/suppliers",  label: "Suppliers" },
  { id: "installers", href: "/installers", label: "Installers" },
];

// How the two programs fit together; shown on both pages with the current one highlighted.
const NETWORK: { id: Program | "customer"; title: string; body: string }[] = [
  { id: "suppliers",  title: "Suppliers make it",    body: "Vetted brands and distributors supply the mowers, controllers, lighting and parts we sell." },
  { id: "customer",   title: "Homeowners buy it",    body: "Customers choose the right gear for their yard from one store that only does yard automation." },
  { id: "installers", title: "Installers set it up", body: "Local pros install, configure and maintain it, so the product works on day one and keeps working." },
];

export interface PartnerPageProps {
  program:      Program;
  app:          string;
  eyebrow:      string;
  title:        string;
  intro:        string;
  benefits:     { title: string; body: string }[];
  requirements: string[];
  steps:        { title: string; body: string }[];
  crossLink:    { title: string; body: string; cta: string };
  formTitle:    string;
  formIntro:    string;
  children:     React.ReactNode;
}

export default function PartnerPage(p: PartnerPageProps) {
  const other = PROGRAMS.find((x) => x.id !== p.program)!;
  return (
    <main>
      <nav aria-label="Partner programs" className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6 h-14 text-sm">
          <Link href="/" className="font-semibold text-white mr-auto">{p.app}</Link>
          <span className="hidden sm:inline text-gray-500">Partner with us:</span>
          {PROGRAMS.map((x) => (
            <Link
              key={x.id}
              href={x.href}
              aria-current={x.id === p.program ? "page" : undefined}
              className={x.id === p.program
                ? "text-white border-b-2 border-blue-500 py-4"
                : "text-gray-400 hover:text-white py-4"}
            >
              {x.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-400 text-sm font-medium mb-4">{p.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">{p.title}</h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8">{p.intro}</p>
          <a href="#apply" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-colors">
            Apply now
          </a>
        </div>
      </section>

      {/* ── Why partner ── */}
      <section className="px-6 py-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why partner with {p.app}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.benefits.map((b) => (
              <div key={b.title} className="p-6 rounded-2xl border border-gray-800 bg-gray-900">
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we look for ── */}
      <section className="px-6 py-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">What we&apos;re looking for</h2>
            <p className="text-gray-400 leading-relaxed">
              You don&apos;t need to tick every box to apply. Tell us where you stand and we&apos;ll talk it through.
            </p>
          </div>
          <ul className="grid gap-3">
            {p.requirements.map((r) => (
              <li key={r} className="flex gap-3 text-gray-300 leading-relaxed">
                <span aria-hidden className="text-blue-400 mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.steps.map((s, i) => (
              <li key={s.title} className="relative pl-12">
                <span className="absolute left-0 top-0 w-8 h-8 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Network ── */}
      <section className="px-6 py-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">One network, end to end</h2>
          <p className="text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Our supplier and installer programs work hand in hand. Suppliers get products that are
            installed properly; installers get equipment they know and customers who are ready to go.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {NETWORK.map((n) => (
              <div
                key={n.id}
                className={`p-6 rounded-2xl border ${n.id === p.program ? "border-blue-500/60 bg-blue-500/5" : "border-gray-800 bg-gray-900"}`}
              >
                <h3 className="font-semibold mb-2">
                  {n.title}
                  {n.id === p.program && <span className="ml-2 text-xs text-blue-300 font-normal">You</span>}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
          <Link
            href={other.href}
            className="mt-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors"
          >
            <div className="flex-1">
              <p className="font-semibold">{p.crossLink.title}</p>
              <p className="text-gray-400 text-sm">{p.crossLink.body}</p>
            </div>
            <span className="text-blue-400 font-medium whitespace-nowrap">{p.crossLink.cta} →</span>
          </Link>
        </div>
      </section>

      {/* ── Apply ── */}
      <section id="apply" className="px-6 py-20 border-t border-gray-800 scroll-mt-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{p.formTitle}</h2>
          <p className="text-gray-400 mb-10 leading-relaxed">{p.formIntro}</p>
          {p.children}
        </div>
      </section>

      <footer className="py-10 border-t border-gray-800 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} {p.app}.
      </footer>
    </main>
  );
}
