import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://josepaulotimbang.com"),
  title: {
    default: "Jose Paulo Timbang — Full Stack Developer & AI Engineer",
    template: "%s | Jose Paulo Timbang",
  },
  description:
    "Full Stack Web Developer and aspiring AI Engineer based in the Philippines. Building modern web applications with React, Next.js, PHP, and Python.",
  keywords: [
    "Jose Paulo Timbang",
    "Full Stack Developer",
    "Web Developer",
    "AI Engineer",
    "React",
    "Next.js",
    "PHP",
    "Python",
    "Philippines",
  ],
  authors: [{ name: "Jose Paulo Timbang", url: "https://josepaulotimbang.com" }],
  creator: "Jose Paulo Timbang",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://josepaulotimbang.com",
    siteName: "Jose Paulo Timbang",
    title: "Jose Paulo Timbang — Full Stack Developer & AI Engineer",
    description:
      "Full Stack Web Developer and aspiring AI Engineer based in the Philippines.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jose Paulo Timbang — Full Stack Developer & AI Engineer",
    description:
      "Full Stack Web Developer and aspiring AI Engineer based in the Philippines.",
    creator: "@josepaulotimbang",
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
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
