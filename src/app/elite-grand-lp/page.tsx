import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from elite-grand-lp.html — see
// src/data/projects/elite-grand.json. Its own copy explicitly says
// "Strategically Located Near Guduvanchery" — ProjectsContent.tsx
// previously said "Thirumullaivoyal, Chennai", fixed in the same pass
// this page was built.
export const metadata: Metadata = {
  alternates: { canonical: '/elite-grand-lp' },
  title: 'Elite Grand — Residential Plots Near Guduvanchery | OmShakthy Homes',
  description:
    'Elite Grand offers 177 residential plots near Guduvanchery, Chennai — DTCP approved, close to SRM University and major educational institutions.',
  openGraph: {
    title: 'Elite Grand — Residential Plots Near Guduvanchery',
    description: 'DTCP approved residential plots near Guduvanchery, Chennai.',
  },
}

export default function EliteGrandPage() {
  const data = getProjectData('elite-grand-lp')!
  // Breadcrumb on every project page; FAQ schema only for the ones with
  // real FAQ content in their data file (getFAQSchema was written
  // earlier but never actually wired into any page until now).
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/elite-grand-lp' },
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
