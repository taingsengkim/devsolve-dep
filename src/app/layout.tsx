import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import StoreProvider from "@/lib/redux/StoreProvider";
import Navbar from "@/app/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DevSolve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="">
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
