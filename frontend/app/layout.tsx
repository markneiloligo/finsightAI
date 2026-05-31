import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSight AI",
  description: "Personal finance intelligence for expense tracking and budgeting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
