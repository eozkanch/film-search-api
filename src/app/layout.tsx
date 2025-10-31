import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsent from "./components/CookieConsent";
import { generateSEOMetadata, seoConfig } from "./config/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

// Ana sayfa için SEO optimize metadata - Default Turkish
export const metadata: Metadata = generateSEOMetadata({
  title: seoConfig.defaultTitle.tr,
  description: seoConfig.defaultDescription.tr,
  keywords: [
    ...seoConfig.primaryKeywords.tr,
    ...seoConfig.longTailKeywords.tr.slice(0, 5), // İlk 5 uzun kuyruklu kelime
    ...seoConfig.pageKeywords.home.tr
  ],
  path: "/",
  image: seoConfig.ogImages.default,
  lang: "tr",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager - Will be loaded only after user consent via CookieConsent component */}
        {/* Security: Additional meta tags for CSP and XSS protection */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      {/* Google Tag Manager (noscript) - Will be shown only if JavaScript is disabled */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-W4R3QZZ6"
          height="0" 
          width="0" 
          style={{display:'none',visibility:'hidden'}}
        />
      </noscript>
      {/* End Google Tag Manager (noscript) */}
      <ErrorBoundary fallbackMessage="We're sorry, but something went wrong with the Film Search App.">
        <CookieConsent />
        <div className="max-w-7xl mx-auto">
              <Navbar />
              <main role="main" id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
        </div>
      </ErrorBoundary>
      </body>
      
    </html>
  );
}
