import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import Analytics from "@/components/ui/Analytics";
import { HOME_DESCRIPTION, OG_IMAGE, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Jose Paulo Timbang",
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "Jose Paulo Timbang",
    "Full Stack Developer",
    "AI Developer",
    "Web Developer",
    "React Developer",
    "Python Developer",
    "PHP Developer",
    "Next.js",
    "Flask",
    "FastAPI",
    "AI Integration",
    "Gemini API",
    "Groq",
    "Ottawa",
    "Canada",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  // Pages override these with their own URL and title via pageMetadata()
  // (lib/seo.ts); the preview image comes from app/og.png/route.tsx.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
