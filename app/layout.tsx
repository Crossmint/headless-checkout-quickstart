import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { DatadogAnalytics } from "@/components/datadog-analytics";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Headless Checkout Quickstart",
  description:
    "Allow your customers to buy NFTs with credit card and crypto payments, using Crossmint's embedded checkout. This quickstart provides a seamless integration for accepting payments in your dApp.",
  creator: "Crossmint",
  publisher: "Crossmint",
  metadataBase: new URL("https://headless-checkout.demos-crossmint.com"),
  openGraph: {
    title: "Headless Checkout Quickstart",
    description:
      "Allow your customers to buy NFTs with credit card and crypto payments, using Crossmint's embedded checkout. This quickstart provides a seamless integration for accepting payments in your dApp.",
    images: [
      {
        url: "https://cdn.prod.website-files.com/653a93effa45d5e5a3b8e1e8/66da361c471683f0df2891cd_preview.png",
        alt: "Crossmint Embedded Checkout Quickstart",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Headless Checkout Quickstart",
    description:
      "Allow your customers to buy NFTs with credit card and crypto payments, using Crossmint's embedded checkout. This quickstart provides a seamless integration for accepting payments in your dApp.",
    images: [
      {
        url: "https://cdn.prod.website-files.com/653a93effa45d5e5a3b8e1e8/66da361c471683f0df2891cd_preview.png",
      },
    ],
    creator: "@crossmint",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <DatadogAnalytics />
      </body>
    </html>
  );
}
