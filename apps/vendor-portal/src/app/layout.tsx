import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planviry — vendor-portal",
  description: "Planviry vendor-portal (Part II scaffold).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
