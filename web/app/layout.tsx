import type { Metadata } from "next";
import "./globals.css";

const APP = process.env.NEXT_PUBLIC_APP_NAME ?? "ShipKit";

export const metadata: Metadata = {
  title:       APP,
  description: "Ship your product in days, not months.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
