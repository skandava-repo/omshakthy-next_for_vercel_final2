import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TestimonialsPageContent from '@/components/ui/TestimonialsPageContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: /testimonials is a real, indexed URL per Balaji's Aug 2026
// SEO report, but the rebuild only ever had a "Customer testimonials"
// section on the homepage (/#testimonials, an anchor — not its own
// crawlable page). Built genuinely for real here, from the old site's
// own testimonials.html (see TestimonialsPageContent.tsx's own note on
// why it doesn't reuse the homepage section's placeholder-padded copy).
export const metadata: Metadata = {
  alternates: { canonical: '/testimonials' },
  title: 'What Our Clients Say | OmShakthy Customer Testimonials',
  description: 'Real words from OmShakthy homeowners across Chennai — on the community they moved into, and the team that got them there.',
}

export default function TestimonialsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Testimonials', path: '/testimonials' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <TestimonialsPageContent />
      <Footer />
    </>
  )
}
