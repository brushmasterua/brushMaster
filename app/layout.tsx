import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Onest } from "next/font/google";
import { LayoutWrapper } from "@/components/layout-wrapper";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrushMaster - Магазин професійних пензлів та інструментів для фарбування",
    template: "%s | BrushMaster",
  },
  description: "Купити професійні пензлі для фарбування стін, стель, радіаторів. Широкий вибір флейцевих, кутових, круглих пензлів, валиків та наборів. Доставка по Україні.",
  keywords: [
    "пензлі для фарбування",
    "малярні пензлі",
    "флейцеві пензлі",
    "кутові пензлі",
    "валики для фарбування",
    "інструменти для ремонту",
    "BrushMaster",
    "пензлі купити",
    "набори пензлів",
  ],
  authors: [{ name: "BrushMaster", url: "https://brushmaster.ua" }],
  creator: "BrushMaster",
  publisher: "BrushMaster",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "BrushMaster - Магазин професійних пензлів та інструментів для фарбування",
    description: "Якісні пензлі для ідеального фарбування. Великий вибір інструментів для професіоналів та домашніх майстрів.",
    url: "https://brushmaster.ua",
    siteName: "BrushMaster",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BrushMaster - професійні пензлі та інструменти",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrushMaster - Магазин професійних пензлів",
    description: "Якісні пензлі для ідеального фарбування. Великий вибір інструментів.",
    images: ["/og-image.jpg"],
    creator: "@brushmaster",
    site: "@brushmaster",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    shortcut: { url: "/favicon.ico" },
  },
  // manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://brushmaster.ua",
    languages: {
      "uk-UA": "https://brushmaster.ua/uk",
      "ru-RU": "https://brushmaster.ua/ru",
      "en-US": "https://brushmaster.ua/en",
    },
  },
  category: "ecommerce",
  classification: "Магазин інструментів для фарбування",
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  applicationName: "BrushMaster",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://brushmaster.ua"),
};

// ВИНЕСЕНО В ОКРЕМИЙ ОБ'ЄКТ viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${onest.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link rel="canonical" href="https://brushmaster.ua" />
        
        <link rel="alternate" href="https://brushmaster.ua/uk" hrefLang="uk" />
        <link rel="alternate" href="https://brushmaster.ua/ru" hrefLang="ru" />
        <link rel="alternate" href="https://brushmaster.ua/en" hrefLang="en" />
        
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://brushmaster.ua",
              "name": "BrushMaster",
              "description": "Магазин професійних пензлів та інструментів для фарбування",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://brushmaster.ua/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}