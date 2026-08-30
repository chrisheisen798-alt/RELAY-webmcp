import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Relay — Collaborative workspace", description: "A collaborative workspace for people and future agent-enabled workflows." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
