import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ゆるVibe Pages",
  description: "あなたの気持ちを美しい詩と画像に変える AI アプリ",
  keywords: "詩, AI, 画像生成, DALL-E, GPT, 感情, アート",
  authors: [{ name: "ゆるVibe Pages" }],
  openGraph: {
    title: "ゆるVibe Pages",
    description: "あなたの気持ちを美しい詩と画像に変える AI アプリ",
    url: "https://kotonone.vercel.app",
    siteName: "ゆるVibe Pages",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ゆるVibe Pages - AI詩生成アプリ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ゆるVibe Pages",
    description: "あなたの気持ちを美しい詩と画像に変える AI アプリ",
    images: ["/og-image.png"],
    creator: "@yuruVibe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
