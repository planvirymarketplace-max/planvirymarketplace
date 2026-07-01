import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";
import { AppProvider } from "@/context/AppContext";
import { LocationProvider } from "@/components/providers/LocationProvider";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planviry — Orchestrate Your Perfect Occasion",
  description:
    "The first platform with a cart and itinerary aware of every vertical at once. Lodging, dining, tickets, venues, vendors, and experiences — in one timeline, one cart, one platform.",
  authors: [{ name: "Planviry" }],
  openGraph: {
    title: "Planviry — Orchestrate Your Perfect Occasion",
    description:
      "The first platform with a cart and itinerary aware of every vertical at once. Lodging, dining, tickets, venues, vendors, and experiences — in one timeline, one cart, one platform.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryProvider>
            <LocationProvider>
              <CartProvider>
                <AppProvider>
                  <div className="min-h-screen flex flex-col">
                    <main className="flex-1">{children}</main>
                  </div>
                  <Toaster />
                </AppProvider>
              </CartProvider>
            </LocationProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
