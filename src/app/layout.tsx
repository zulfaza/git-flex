import type { Metadata } from 'next'
import { Archivo_Black, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'

import Providers from '@/components/Providers'

import './globals.css'

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GitFlex',
  description: 'Flexible GitHub contribution calendar for portfolio and README screenshots.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'GitFlex',
    description: 'Flexible GitHub contribution calendar for portfolio and README screenshots.',
    images: [
      {
        url: '/og.png',
        width: 2400,
        height: 1260,
        alt: 'GitFlex open graph image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitFlex',
    description: 'Flexible GitHub contribution calendar for portfolio and README screenshots.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-XJX0BJSEMP'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XJX0BJSEMP');
          `}
        </Script>
      </head>
      <body
        className={`${archivoBlack.variable} ${space.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
