import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crystal Scan - Fast QR & Barcode Utility",
  description: "Reliable QR and Barcode scanner with custom design tools for daily use. Experience precision with Crystal Scan.",
  keywords: ["QR scanner", "Barcode scanner", "QR generator", "Crystal Scan", "Material You", "Android app"],
  authors: [{ name: "Crystal Scan Team" }],
  openGraph: {
    title: "Crystal Scan - Fast QR & Barcode Utility",
    description: "Reliable QR and Barcode scanner with custom design tools for daily use.",
    url: "https://crystalscan.app",
    siteName: "Crystal Scan",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Crystal Scan App Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crystal Scan - Fast QR & Barcode Utility",
    description: "Reliable QR and Barcode scanner with custom design tools for daily use.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
