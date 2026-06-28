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
    default: "Jose Paulo Timbang — Full-Stack Developer",
    template: "%s | Jose Paulo Timbang",
  },
  description:
    "Full-Stack Developer with 8 years of experience building responsive web apps and AI-powered platforms using React, Python, PHP, Flask, FastAPI, Gemini API, and Groq. Based in Stittsville, ON, Canada.",
  keywords: [
    "Jose Paulo Timbang",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Python Developer",
    "PHP Developer",
    "Flask",
    "FastAPI",
    "AI Integration",
    "Gemini API",
    "Groq",
    "Canada",
    "WordPress",
  ],
  authors: [{ name: "Jose Paulo Timbang", url: "https://josepaulotimbang.com" }],
  creator: "Jose Paulo Timbang",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://josepaulotimbang.com",
    siteName: "Jose Paulo Timbang",
    title: "Jose Paulo Timbang — Full-Stack Developer",
    description:
      "Full-Stack Developer with 8 years of experience building responsive web apps and AI-powered platforms.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "JPT Logo" }],
  },
  twitter: {
    card: "summary",
    title: "Jose Paulo Timbang — Full-Stack Developer",
    description:
      "Full-Stack Developer with 8 years of experience building responsive web apps and AI-powered platforms.",
    creator: "@josepaulotimbang",
    images: ["/logo.png"],
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
