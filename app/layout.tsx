import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heart Disease Predictor",
  description: "Created By Divya",
  generator: "Self",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/placeholder-logo.png" />
      <body>{children}</body>
    </html>
  );
}
