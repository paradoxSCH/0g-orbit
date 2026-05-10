import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "0G Orbit",
  description: "A bounded operational wallet for autonomous AI agents on 0G."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
