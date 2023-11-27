import { ReactNode } from "react";

import { NextIntlClientProvider } from "next-intl";
import { getTranslator } from "next-intl/server";
import { Inter, Julius_Sans_One } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";

import "@/css/globals.css";
import Providers from "@/providers";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const title = Julius_Sans_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale?: string };
}) {
  // While the `locale` is required, the namespace is optional and
  // identical to the parameter that `useTranslations` accepts.
  const t = await getTranslator(locale ?? "fr", "Metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale?: string };
}) {
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} ${title.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <meta name="application-name" content="Echecs France" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Echecs France" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#00A1F0" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="bg-white font-sans leading-normal tracking-normal dark:bg-gray-800">
              <Navbar />
              <div className="relative min-h-content">{children}</div>
              <Footer />
            </div>
          </NextIntlClientProvider>
          <Script
            defer
            src="https://app.tinyanalytics.io/pixel/HyoumUokLr9exPgX"
          ></Script>
        </Providers>
      </body>
    </html>
  );
}