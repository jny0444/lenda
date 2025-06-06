import type { Metadata } from "next";
import "./globals.css";
import Provider from "./provider";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Lenda",
  description: "Simple DEX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <Provider>
          <Navbar />
          {children}</Provider>
      </body>
    </html>
  );
}
