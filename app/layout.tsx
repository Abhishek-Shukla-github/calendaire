import type { Metadata } from "next";
import {Inter} from "next/font/google" 
import "./globals.css";
import Header from "@/components/header";
import {ClerkProvider} from "@clerk/nextjs"
import CreateEventDrawer from "@/components/create-event";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Calendaire",
  description: "Calendaire is the complete meet scheduler platform",
};

const inter = Inter({subsets:['latin']})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased`}
        >
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">{children}</main>
          <Toaster />
          <footer className="bg-blue-100 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Created with 💙 by 
              <a href="https://www.abshukla.com/" target="_blank" className="text-blue-600"> abshukla</a>
              </p>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ ClerkProvider>
  );
}
