import type { Metadata } from "next";

import { Poppins } from "next/font/google";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TreeBio ",
  description: "TreeBio - Your lintree alternative for managing your links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
