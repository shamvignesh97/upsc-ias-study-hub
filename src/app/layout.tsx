import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";
import AppChrome from "@/components/AppChrome";

const APP_NAME = "UPSC IAS Study Hub";
const APP_DESCRIPTION =
  "Complete IAS/UPSC study companion — syllabus, PYQ-trend likelihood estimates, quizzes, prelims mocks, planner, and interview tips.";

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
          <AppChrome>{children}</AppChrome>
        </SerwistProvider>
      </body>
    </html>
  );
}
