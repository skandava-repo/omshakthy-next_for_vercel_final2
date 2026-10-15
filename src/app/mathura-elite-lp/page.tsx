import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from "Mathura broucher PDF FILE 5mm Bleed.pdf"
// (OCR'd — the print-ready PDF has its text outlined to curves, no
// text layer) — see src/data/projects/mathura-elite-lp.json. Distinct
// from the existing "OmShakthy Mathura" (Chromepet, /mathura-lp) —
// this is a separate, newly-launching project in Thirumazhisai.
export const metadata: Metadata = {
  alternates: { canonical: '/mathura-elite-lp' },
  title: 'OmShakthy Mathura Elite — Residential Plots in Thirumazhisai | OmShakthy Homes',
  description:
    'OmShakthy Mathura Elite offers 70 CMDA & RERA approved residential plots in Thirumazhisai, Chennai — a 2-acre gated community on the Chennai-Bengaluru Highway corridor.',
  openGraph: {
    title: 'OmShakthy Mathura Elite — Residential Plots in Thirumazhisai',
    description: 'CMDA & RERA approved residential plots in Thirumazhisai, Chennai.',
  },
}

export default function MathuraElitePage() {
  const data = getProjectData('mathura-elite-lp')!
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/mathura-elite-lp' },
  ])
  const faqSchema =
    data.faq.length > 0
      ? getFAQSchema(data.faq.map((f) => ({ question: f.q, answer: f.a })))
      : null
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
