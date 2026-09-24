import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProjectStatusPageContent from '@/components/ui/ProjectStatusPageContent'
import { projects } from '@/lib/projectsData'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report. Reuses
// the real 'Sold' set already in ProjectsContent.tsx — that data was
// itself audited directly against the live site's own
// /completed-projects carousel in an earlier session (see that file's
// own comments), so this is the same real portfolio, not new data.
// The 6 real project videos are the same ones both video-gallery.html
// and completed-projects.html embed on the old site. Narrative + FAQ
// are the old page's own real copy, via the local mirror.
const completedProjects = projects.filter((p) => p.status === 'Sold')

const PROJECT_VIDEO_IDS = ['qqQ5WKXB2PE', 'FKmFjEt1eO4', 'RtRb_UKNJgo', 'S1L7Gix0l_M', 'Uoe77mhNe30', 'gduULdE1jFI']

const NARRATIVE = [
  {
    heading: 'A Legacy of Trusted Plotted Developments',
    text: "Our completed real estate projects in Chennai portfolio include quality developments addressing homeowner and investor requirements. Situated strategically within Chennai's growth corridors, these projects continue to provide superior connectivity and infrastructure along with potential for appreciation.",
  },
  {
    heading: 'Communities Designed for Better Living',
    text: 'Omshakthy Homes has developed several completed gated community projects in Chennai that offer a secure and well-organized lifestyle — designed to afford residents a quiet atmosphere while facilitating access to schools, hospitals, places of work, and every convenience needed for everyday living.',
  },
  {
    heading: 'Choose Omshakthy Homes for Your Next Property Investment',
    text: 'If you are in search of land for sale in Chennai, then opt for a reliable and reputed developer. The successful delivery of multiple completed projects in Chennai reflects the trust thousands of customers have placed in Omshakthy Homes over the years.',
  },
]

const FAQ = [
  { q: 'How many projects has OmShakthy completed in Chennai?', a: "Over the years, Omshakthy Homes has delivered a multitude of completed projects in Chennai, carefully laid-out plotted developments in prime locations. Each project is executed with the brand's focus on quality, transparency, and timely completion." },
  { q: 'How many square feet has OmShakthy delivered so far?', a: 'As a real estate brand, Omshakthy Homes has delivered more than 45 lakh sq. ft. of residential properties to date — clear proof of trust, transparency, and quality.' },
  { q: 'Can I visit an OmShakthy completed project before buying elsewhere?', a: "Yes. You can visit our completed projects to experience the quality of development, infrastructure, and community planning firsthand — a site visit can help you make an informed decision." },
  { q: 'Does OmShakthy Homes provide completion certificates for delivered projects?', a: 'Yes. We provide all the necessary documentation for delivered projects, and assist with approvals, legal documents, and other property-related paperwork.' },
  { q: 'What is the price range of completed plots by OmShakthy?', a: 'Price varies depending on project location, plot size, and availability. Contact us or schedule a site visit with the sales team for the latest pricing.' },
  { q: 'Does OmShakthy offer home loan assistance for completed projects?', a: 'Yes. We assist eligible buyers with home loan support through leading financial institutions.' },
  { q: 'What documents are needed to buy a completed plot from OmShakthy?', a: 'Identity proof, address proof, PAN card, passport-size photographs, and other documents required for registration or loan processing.' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/completed-projects' },
  title: 'Delivered Projects Chennai, Complete Real Estate Projects Chennai',
  description: 'Completed projects by OmShakthy Homes — trusted plotted developments across Chennai, delivered with quality, transparency, and timely completion.',
}

export default function CompletedProjectsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Completed Projects', path: '/completed-projects' },
  ])
  const faqSchema = getFAQSchema(FAQ.map((f) => ({ question: f.q, answer: f.a })))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <ProjectStatusPageContent
        kicker="Delivered"
        title="Completed Projects"
        intro="Omshakthy Homes has successfully delivered thoughtfully planned residential developments across Chennai, helping families and investors own legally approved plots in some of the city's most promising locations."
        projects={completedProjects}
        videoIds={PROJECT_VIDEO_IDS}
        narrativeSections={NARRATIVE}
        faq={FAQ}
        ctaText="Have Questions About a Delivered Project?"
      />
      <Footer />
    </>
  )
}
