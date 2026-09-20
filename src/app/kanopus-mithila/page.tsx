import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from canopus-mithila-lp.html — see
// src/data/projects/kanopus-mithila.json. Its own real "Locations
// Nearby" list (Avadi Railway Station, Ayyapakkam, Mogappair, Heavy
// Vehicles Factory) places this project in the Avadi corridor —
// ProjectsContent.tsx previously said "Vandalur, Chennai", fixed in
// the same pass this page was built.
export const metadata: Metadata = {
  alternates: { canonical: '/kanopus-mithila' },
  title: 'Kanopus Mithila — Residential Plots in Avadi | OmShakthy Homes',
  description:
    'Kanopus Mithila offers 68 residential plots in the Avadi corridor of Chennai — DTCP approved, close to Avadi Railway Station and Ayyapakkam.',
  openGraph: {
    title: 'Kanopus Mithila — Residential Plots in Avadi',
    description: 'DTCP approved residential plots in the Avadi corridor, Chennai.',
  },
}

export default function KanopusMithilaPage() {
  const data = getProjectData('kanopus-mithila')!
  // Breadcrumb on every project page; FAQ schema only for the ones with
  // real FAQ content in their data file (getFAQSchema was written
  // earlier but never actually wired into any page until now).
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/kanopus-mithila' },
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
