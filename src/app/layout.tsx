import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.omshakthy.com'),
  title: {
    default: 'OmShakthy Homes | Best Plot Developers in Chennai',
    template: '%s | OmShakthy Homes',
  },
  description:
    'OmShakthy Homes — generating real assets since 1991. CMDA & DTCP approved residential plots, industrial land, and land aggregation across Chennai. 20,000+ families trust us.',
  keywords: [
    'plot developers Chennai',
    'CMDA approved plots',
    'DTCP approved plots',
    'residential plots Chennai',
    'OmShakthy Homes',
    'land aggregation Chennai',
    'best real estate developers Chennai',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'OmShakthy Homes',
    title: 'OmShakthy Homes | Best Plot Developers in Chennai',
    description:
      'Generating real assets since 1991. CMDA & DTCP approved plots in Chennai.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmShakthy Homes',
    description: 'Best plot developers in Chennai since 1991.',
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="icon" href="/omshakthy-logo.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,200..700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@200;300;400;500;600;700&family=Alex+Brush&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
