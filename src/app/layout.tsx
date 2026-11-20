import type { Metadata } from 'next'
import StickyEnquiryBox from '@/components/layout/StickyEnquiryBox'
import ChatbotLoader from '@/components/layout/ChatbotLoader'
import './globals.css'

// Indexing is OFF by default everywhere (noindex, nofollow) until this
// is deliberately flipped on for the real production launch — per
// Adglobe's Nov 2026 audit: the .in dev domain was found indexable,
// flagged as a priority SEO/migration risk ("implement <meta
// name="robots" content="noindex"> across all pages"). Set the env var
// NEXT_PUBLIC_ALLOW_INDEXING=true (only on the final www.omshakthy.com
// production deploy, never on the .in dev domain or any preview/
// staging deploy) to allow indexing again once this site is the real
// live site and the migration checklist below is actually done.
const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

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
  robots: ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* src/app/favicon.ico (Next's own file-convention icon, auto-
            linked below) used to be a leftover placeholder — a plain
            black circle/white triangle, no OmShakthy branding at all.
            Replaced it with the real logo. This manual webp link was
            a second, competing <link rel="icon">, which is why removed
            rather than kept alongside the now-correct one. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,200..700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@200;300;400;500;600;700&family=Alex+Brush&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        {/* Real element prod has (footer-new.php: .enquire-vertical-btn
            + .floating-visit-form) — see StickyEnquiryBox.tsx's own
            comment. Rendered once here rather than wired into every
            page.tsx, same as the chatbot script below it. */}
        <StickyEnquiryBox />
        {/* Real chatbot prod already runs (footer-new.php) — a hosted
            Kenyt.ai widget, same bot ID, loaded via their own script.
            No UI of ours to design: Kenyt renders its own floating
            widget entirely from this one tag, same as it does on
            the live site. Adglobe's Nov 2026 audit flagged this as
            one of the rebuild's "missing essentials". Loading itself
            is gated (see ChatbotLoader.tsx) — was auto-opening with a
            greeting right on top of the homepage's own intro video
            (user report); now waits for the intro to actually finish
            there, same as it always did on every other page. */}
        <ChatbotLoader />
      </body>
    </html>
  )
}
