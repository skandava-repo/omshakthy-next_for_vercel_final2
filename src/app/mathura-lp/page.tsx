import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from mathura-lp.html — see
// src/data/projects/mathura.json. Its own real FAQ states plainly
// "OmShakthy Mathura is a residential plot development project located
// in Chromepet" and its connectivity intro repeats "in chromepet" —
// ProjectsContent.tsx previously said "Tambaram, Chennai", fixed in
// the same pass this page was built. Status is 'Ongoing', not 'Sold'
// — this page's own live spec table shows a real price (22.5 Lakhs),
// not "Sold Out"; a prior pass here had mismarked it.
export const metadata: Metadata = {
  alternates: { canonical: '/mathura-lp' },
  title: 'OmShakthy Mathura — Residential Plots in Chromepet | OmShakthy Homes',
  description:
    'OmShakthy Mathura is a residential plot development in Chromepet, Chennai — 110 CMDA & RERA approved plots across 3.55 acres, starting from ₹22.5 Lakhs.',
  openGraph: {
    title: 'OmShakthy Mathura — Residential Plots in Chromepet',
    description: 'CMDA & RERA approved residential plots in Chromepet, Chennai.',
  },
}

export default function MathuraPage() {
  const data = getProjectData('mathura-lp')!
  // Breadcrumb on every project page; FAQ schema only for the ones with
  // real FAQ content in their data file (getFAQSchema was written
  // earlier but never actually wired into any page until now).
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/mathura-lp' },
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
