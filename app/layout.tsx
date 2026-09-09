import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rohit-singh-iota.vercel.app"),
  title: "Rohit Singh — Software Engineering Portfolio",
  description:
    "Backend systems, AI engineering, distributed systems, cloud infrastructure and detailed technical case studies.",

  openGraph: {
    title: "Rohit Singh — Software Engineering Portfolio",
    description:
      "Backend systems, AI engineering, distributed systems, cloud infrastructure and detailed technical case studies.",
    url: "https://rohit-singh-iota.vercel.app/",
    siteName: "Rohit Singh",
    images: [
      {
        url: "https://rohit-singh-iota.vercel.app/portfolio-preview.png",
        width: 1200,
        height: 630,
        alt: "Rohit Singh Software Engineering Portfolio",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rohit Singh — Software Engineering Portfolio",
    description:
      "Backend systems, AI engineering, distributed systems and technical case studies.",
    images: [
      "https://rohit-singh-iota.vercel.app/portfolio-preview.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-black font-sans text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
