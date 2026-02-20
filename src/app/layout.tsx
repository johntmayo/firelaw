import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Altadena Fire Law Tracker",
  description:
    "Track legislation related to the Eaton Fire, Altadena recovery, California wildfire law, and federal disaster relief — including FEMA, insurance reform, and rebuilding policy.",
  keywords: [
    "Altadena",
    "Eaton Fire",
    "wildfire legislation",
    "California wildfire",
    "FEMA",
    "disaster recovery",
    "fire insurance",
    "rebuilding",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
