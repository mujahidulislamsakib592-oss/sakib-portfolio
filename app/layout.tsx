import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sakib Portfolio",
  description: "Premium editable portfolio website for Sakib."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
