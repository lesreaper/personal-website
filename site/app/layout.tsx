import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { person, site } from "../lib/profile";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://richeverts.com"),
  title: {
    default: "Richard Everts — Intelligence & Human Agency",
    template: "%s | Richard Everts",
  },
  description:
    "The connected work of Richard Everts: AI research, production systems, filmmaking, books, and public speaking. Founder of Deep SIML Labs. Publishing as The Operator.",
  openGraph: {
    type: "website",
    siteName: "Richard Everts",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "Richard Everts — Intelligence and Human Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rich_everts",
    images: ["/social.png"],
  },
  icons: { icon: "/favicon.svg" },
  other: { "theme-color": "#171916" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/playfair.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/source-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="describedby" href="/llms.txt" type="text/plain" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                person,
                {
                  "@type": "WebSite",
                  "@id": `${site.url}/#website`,
                  url: site.url,
                  name: "Richard Everts",
                  publisher: { "@id": `${site.url}/#person` },
                },
              ],
            }).replace(/</g, "\u003c"),
          }}
        />
      </body>
    </html>
  );
}
