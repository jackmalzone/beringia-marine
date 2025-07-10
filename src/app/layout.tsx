import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beringia Marine Technologies",
  description: "Sales Engineering & Consulting for Marine Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            /* Color Palette */
            --color-dark-blue-dark: #052533;
            --color-dark-blue-teal: #003b4a;
            --color-light-blue: #00a8b0;
            --color-medium-cyan: #00d8e3;
            --color-bright-cyan: #00f0ff;
            
            /* Typography */
            --font-domitian: "Domitian", serif;
            --font-inter: "Inter", sans-serif;
            
            /* Spacing */
            --spacing-xs: 0.25rem;
            --spacing-sm: 0.5rem;
            --spacing-md: 1rem;
            --spacing-lg: 1.5rem;
            --spacing-xl: 2rem;
            --spacing-2xl: 3rem;
            --spacing-3xl: 4rem;
            
            /* Border Radius */
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
            
            /* Shadows */
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
            --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
            
            /* Transitions */
            --transition-fast: 0.15s ease;
            --transition-normal: 0.3s ease;
            --transition-slow: 0.5s ease;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <Header />
        <main style={{ paddingTop: '100px' }}>
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
