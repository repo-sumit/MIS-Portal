import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ApplicationsProvider } from "@/providers/applications-provider";
import { LifecycleProvider } from "@/providers/lifecycle-provider";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "HP Higher Education MIS — Admin Portal",
  description:
    "Official Admin Portal for the Department of Higher Education, Government of Himachal Pradesh.",
  applicationName: "HP HE MIS",
  authors: [{ name: "Directorate of Higher Education, Himachal Pradesh" }],
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/HPU_Logo.png", type: "image/png" }
    ],
    apple: [{ url: "/assets/HPU_Logo.png" }],
    shortcut: ["/favicon.ico"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#613AF5"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body className="min-h-screen bg-surface-subtle font-sans text-ink antialiased">
        <SessionProvider>
          <ToastProvider>
            <ApplicationsProvider>
              <LifecycleProvider>{children}</LifecycleProvider>
            </ApplicationsProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
