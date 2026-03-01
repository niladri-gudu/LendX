import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "./providers";
import Navbar from "../components/navbar/Navbar";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LendX",
  description: "Defi Lending Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>
          <Toaster position="top-right" richColors />
          <Navbar />

          {/* Page container */}
          <main className="px-6 py-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
