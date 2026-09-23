import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// This is a genuinely different real page from /industrial-park-lp —
// not a rename. The old mirror site has two distinct, separately
// indexed industrial-park pages: industrial-park-lp.html (the general
// "OmShakthy Industrial Park" overview, now living at
// /industrial-park-lp) and industrial-park.html (this one — a specific
// Thirumudivakkam industrial-land page, its own real hero banner,
// specs, FAQ). The rebuild previously only had the -lp content living
// at this exact URL, silently missing this page's real content
// entirely — see src/data/projects/industrial-park.json for the real
// content extracted from the local site mirror.
export const metadata: Metadata = {
  alternates: { canonical: '/industrial-park' },
  title: 'Industrial Land for Sale in Thirumudivakkam, Chennai | OmShakthy Homes',
  description:
    "Searching for industrial land in Thirumudivakkam? Find fully approved plots for sale in Chennai's established industrial belt.",
  openGraph: {
    title: 'Industrial Land for Sale in Thirumudivakkam, Chennai',
    description: "Chennai's first and only private industry park in Chromepet — DTCP & RERA approved.",
  },
}

export default function IndustrialParkThirumudivakkamPage() {
  const data = getProjectData('industrial-park')!
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/industrial-park' },
  ])
  const faqSchema = getFAQSchema(data.faq.map((f) => ({ question: f.q, answer: f.a })))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
