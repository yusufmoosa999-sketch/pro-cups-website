import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://procupsinternational.com"),

  title: {
    default: "Pro Cups International | Premium Paper Cup Manufacturer",
    template: "%s | Pro Cups International",
  },

  description:
    "Premium paper cup manufacturer in South Africa. We manufacture custom printed paper cups, ripple cups, double wall cups and single wall cups for cafés, restaurants, wholesalers and corporate brands.",

  keywords: [
    "paper cups",
    "custom printed paper cups",
    "ripple cups",
    "double wall cups",
    "single wall cups",
    "coffee cups",
    "paper cup manufacturer",
    "South Africa",
    "Durban",
    "Pro Cups International",
  ],

  authors: [{ name: "Pro Cups International" }],

  creator: "Pro Cups International",

  publisher: "Pro Cups International",

  openGraph: {
    title: "Pro Cups International",
    description: "Premium paper cup manufacturer in South Africa.",
    url: "https://procupsinternational.com",
    siteName: "Pro Cups International",
    locale: "en_ZA",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T5C6PGER6L"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T5C6PGER6L');
          `}
        </Script>

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Pro Cups International",
              url: "https://procupsinternational.com",
              logo: "https://procupsinternational.com/logo.png",
              description:
                "Premium paper cup manufacturer in South Africa specialising in custom printed paper cups.",
            }),
          }}
        />

        {children}

      </body>
    </html>
  );
}