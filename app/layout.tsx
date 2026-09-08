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
  title: "Rohit Singh — Software Engineer | Distributed Systems · Backend · AI Agents",
  description:
    "Portfolio of Rohit Singh. Software Engineering Contractor at Handshake AI, Distributed Systems Engineer, LeetCode Knight (2008), and Backend Developer specializing in Java, Spring Boot, Kafka, and AI Agent evaluation.",
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
