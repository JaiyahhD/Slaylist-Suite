import type { Metadata } from "next";

import Header from "@/components/layout/Header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Slaylist Suite",
    template: "%s | The Slaylist Suite",
  },

  description:
    "Books. Brains. Bad Decisions. On Repeat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        {children}
      </body>
    </html>
  );
}
