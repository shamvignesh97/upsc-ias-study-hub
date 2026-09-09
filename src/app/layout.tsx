import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";
import Nav from "@/components/Nav";
import InstallPrompt from "@/components/InstallPrompt";

const APP_NAME = "UPSC IAS Study Hub";
const APP_DESCRIPTION =
  "Complete IAS/UPSC study companion — syllabus, PYQ-trend likelihood estimates, quizzes, planner, and interview tips.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s · UPSC Hub",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "UPSC Hub",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2744",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SerwistProvider swUrl="/serwist/sw.js">
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                UPSC IAS Study Hub — educational MVP. Probabilities are estimates, not
                official predictions.
              </p>
              <p>Client-side progress · Installable PWA · No account required</p>
            </div>
          </footer>
          <InstallPrompt />
        </SerwistProvider>
      </body>
    </html>
  );
}
