"use client";
// Building blocks shared by the supplier and installer application forms.

export type FormStatus = "idle" | "loading" | "success" | "error";

export const INPUT =
  "w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";

export function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

// Reads trimmed text and optional integers out of a submitted form.
export function formReader(form: HTMLFormElement) {
  const data = new FormData(form);
  const text = (k: string) => String(data.get(k) ?? "").trim();
  return {
    text,
    int:     (k: string) => (text(k) ? Number(text(k)) : undefined),
    checked: (k: string) => data.get(k) === "on",
  };
}

// POSTs an application; resolves to null on success or an error message.
export async function submitApplication(path: string, body: unknown): Promise<string | null> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
    const res = await fetch(`${backendUrl}${path}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    if (res.ok) return null;
    const json = (await res.json()) as { error?: string };
    return json.error ?? "Something went wrong. Try again.";
  } catch {
    return "Could not connect. Check your internet and try again.";
  }
}

export function ChipGroup<T extends string>({
  legend, options, selected, onToggle,
}: {
  legend:   string;
  options:  readonly { id: T; label: string }[];
  selected: T[];
  onToggle: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm text-gray-400 mb-3">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.id)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                on
                  ? "border-blue-500 bg-blue-500/15 text-blue-300"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}

export function SubmitRow({ status, message, idle, busy }: { status: FormStatus; message: string; idle: string; busy: string }) {
  return (
    <>
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold transition-colors"
      >
        {status === "loading" ? busy : idle}
      </button>
      {status === "error" && <p className="text-red-400 text-sm">{message}</p>}
    </>
  );
}
