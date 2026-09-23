import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from elite-orchard-lp.html — see
// src/data/projects/elite-orchard.json. Its own real "Locations
// Nearby" list (Guduvanchery Railway Station, Kilambakkam Bus
// Terminal, Mahindra World City, Potheri Railway Station, ORR) places
// this project in Guduvanchery — ProjectsContent.tsx previously said
// "Paruthipattu, Avadi", fixed in the same pass this page was built.
export const metadata: Metadata = {
  alternates: { canonical: '/elite-orchard-lp' },
  title: 'Elite Orchard — Residential Plots in Guduvanchery | OmShakthy Homes',
  description:
    'Elite Orchard is a sold-out 25-acre gated community of 510 residential plots in Guduvanchery, Chennai — close to Guduvanchery Railway Station and Mahindra World City.',
  openGraph: {
    title: 'Elite Orchard — Residential Plots in Guduvanchery',
    description: 'A 25-acre gated community of residential plots in Guduvanchery, Chennai.',
  },
}

export default function EliteOrchardPage() {
  const data = getProjectData('elite-orchard-lp')!
  // Breadcrumb on every project page; FAQ schema only for the ones with
  // real FAQ content in their data file (getFAQSchema was written
  // earlier but never actually wired into any page until now).
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/elite-orchard-lp' },
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
