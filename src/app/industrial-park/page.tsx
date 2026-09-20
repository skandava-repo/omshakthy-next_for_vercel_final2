import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content extracted from industrial-park-lp.html — see
// src/data/projects/industrial-park.json. Its own page names no
// specific locality (title tag/meta description both just say
// "Chennai"), and its own real drive times (Airport 10 min, Tambaram
// Railway Station 15 min) don't match ProjectsContent.tsx's existing
// "Sriperumbudur, Chennai" (a ~40+ min drive from the airport) — left
// that field alone rather than guess a replacement locality with no
// real source to back it up; flagging the mismatch here instead.
// The source page's own Price spec was literally "XXXX" (an unfinished
// placeholder, still there on the live site today) — shown here as
// "Price on Request" instead. This project is status: 'Ongoing' in
// ProjectsContent.tsx, not 'Sold': its own live page still runs an
// active "Book a Free Site Visit" form with no "Sold Out" banner
// anywhere (unlike Elite Orchard's page, which explicitly says
// "Price: Sold Out") — an earlier pass had mismarked it as sold.
export const metadata: Metadata = {
  alternates: { canonical: '/industrial-park' },
  title: 'OmShakthy Industrial Park — Industrial Plots in Chennai | OmShakthy Homes',
  description:
    'OmShakthy Industrial Park is Chennai’s private industrial plot development — 53 plots across 8.10 acres, close to the Outer Ring Road and Chennai Airport.',
  openGraph: {
    title: 'OmShakthy Industrial Park — Industrial Plots in Chennai',
    description: "Chennai's private industrial plot development, close to the Outer Ring Road.",
  },
}

export default function IndustrialParkPage() {
  const data = getProjectData('industrial-park')!
  // Breadcrumb on every project page; FAQ schema only for the ones with
  // real FAQ content in their data file (getFAQSchema was written
  // earlier but never actually wired into any page until now).
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/industrial-park' },
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
