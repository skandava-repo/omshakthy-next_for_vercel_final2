import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from canopus-magha-lp.html on the old mirror
// site — see src/data/projects/kanopus-magha.json. The page's own copy
// says "Enveloped in the epicenter of Avadi" — the ProjectsContent.tsx
// listing this links from previously said "Guduvanchery, Chennai" for
// this project; Avadi is what this page's own real content actually
// backs up, so that's what's used here (and fixed at the source in
// ProjectsContent.tsx/PropertyGrid.tsx in the same pass).
export const metadata: Metadata = {
  alternates: { canonical: '/canopus-magha-lp' },
  title: 'Kanopus Magha — Residential Plots in Avadi | OmShakthy Homes',
  description:
    'Kanopus Magha is a 172-acre mega plotted township in Avadi, Chennai — 440 residential plots, litigation-free clear titles, close to Avadi Railway Station and Metro.',
  openGraph: {
    title: 'Kanopus Magha — Residential Plots in Avadi',
    description: 'A 172-acre mega plotted township in Avadi, Chennai.',
  },
}

export default function KanopusMaghaPage() {
  const data = getProjectData('canopus-magha-lp')!
  // Breadcrumb on every project page; FAQ schema only for the ones with
  // real FAQ content in their data file (getFAQSchema was written
  // earlier but never actually wired into any page until now).
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/canopus-magha-lp' },
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
