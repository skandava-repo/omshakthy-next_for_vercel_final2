import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import AboutContent from '@/components/ui/AboutContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About Us',
  description:
    'OmShakthy Homes — 35 years of trust in Tamil Nadu real estate. Founded in 1991, over 7,500 happy customers, ₹2,000+ Cr in transactions, and a 100% litigation-free track record.',
}

export default function AboutPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <AboutContent />
      {/* Same footer illustration override as the Projects page — the
          colorful 3D building render at the smaller size, instead of
          the site-wide monochrome skyline. */}
      <SiteLinksSection />
      <Footer decoSrc="/footer-building.webp" decoClassName="ft__deco--sm" />
    </>
  )
}
