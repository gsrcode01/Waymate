import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waymate",
  description: "Find someone going your way."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
