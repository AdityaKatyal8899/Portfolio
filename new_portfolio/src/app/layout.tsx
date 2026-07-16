import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import KeyboardNav from "./components/KeyboardNav";
import Navbar from "./components/Navbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Aditya | Backend Engineer and Developer",
  description: "Building intelligent and aesthetic experiences with code.",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Navbar />
        
        <main className="main-content">
          {children}
        </main>
        
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-copy">
              Aditya@2026 <a href="mailto:adityakatyal45678@gmail.com">adityakatyal45678@gmail.com</a>. All rights reserved.
            </p>
          </div>
        </footer>

        <KeyboardNav />
      </body>
    </html>
  );
}
