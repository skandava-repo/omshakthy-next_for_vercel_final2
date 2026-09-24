import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProjectStatusPageContent from '@/components/ui/ProjectStatusPageContent'
import { projects } from '@/lib/projectsData'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report. The
// old site's own /ongoing-projects.html features exactly these 3
// projects as cards — reused from ProjectsContent.tsx's real dataset
// (filtered here) rather than re-typed. Narrative + FAQ are the old
// page's own real copy, via the local mirror.
const ONGOING_NAMES = ['Elite Grand', 'Kanopus Magha', 'OmShakthy Regalia']
const ongoingProjects = projects.filter((p) => ONGOING_NAMES.includes(p.name))

const NARRATIVE = [
  {
    heading: 'Explore Ongoing Projects by OmShakthy Homes in Chennai',
    text: "Looking to buy plots in Chennai with complete peace of mind? Omshakthy Homes presents a range of thoughtfully planned plotted developments in some of Chennai's fastest-growing locations. Backed by decades of experience and the trust of thousands of happy customers, we create communities that combine excellent connectivity, legal clarity, and long-term investment potential.",
  },
  {
    heading: 'Discover Residential Projects Built Around Growth and Convenience',
    text: 'Located close to development infrastructure, schools, hospitals, IT corridors, and daily necessities. Our ongoing residential projects in Chennai offer designed layout for peaceful living and sound future appreciation.',
  },
  {
    heading: "Invest in Chennai's Fastest Growing Locations",
    text: 'Buying early in new ongoing projects in Chennai allows you to benefit from future infrastructure development and increasing property demand. At Omshakthy Homes, every project is selected after careful evaluation of location potential, accessibility, and investment value, helping you make a smart real estate decision.',
  },
  {
    heading: 'Find the Right Housing Project for Your Future',
    text: 'We have thoughtfully conceived and meticulously designed plotted communities for a wide spectrum of budgetary constraints and lifestyle aspirations. Whether a first-time home buyer or a seasoned investor, our projects are developed to satisfy on affordability, strategic location, and the potential for a good ROI.',
  },
]

const FAQ = [
  { q: 'Which OmShakthy ongoing project is closest to schools and hospitals?', a: 'We have ongoing projects in Chennai at strategically connected areas close to schools, colleges, hospitals, supermarkets, and essential routes. Contact our sales team, who can guide you through our options depending on your commute and lifestyle.' },
  { q: 'How do I book a plot in an OmShakthy ongoing project?', a: 'Visit your desired ongoing project, select your plot, pay the booking amount, and complete the booking procedures. Your documents can be submitted as well and our team will help with registration.' },
  { q: 'What is the booking amount required to reserve a plot?', a: 'The booking amount depends on the project and area of the plot. Reach out to our sales team for up-to-date information on booking offers, costs, and payment options.' },
  { q: 'What payment plans or EMI options are available for ongoing projects?', a: 'We offer flexible payment options and provide loans with leading financial partners to make payments smoother. Schemes can differ by project — we help you select the best one.' },
  { q: 'Which is better — Elite Grand, Kanopus Magha, or Regalia — for building a home?', a: 'Each project addresses a unique life and investment perspective, based on location, plot size, proximity, and individual financial capacity. Our team can help with comparisons and recommendations.' },
  { q: "What plot sizes are available across OmShakthy's ongoing projects?", a: 'We provide plots of varying sizes for first-time homebuyers and investors. Dimensions vary from project to project.' },
  { q: 'Are all OmShakthy ongoing projects RERA approved?', a: 'Approvals and registrations may vary by project. Omshakthy Homes does offer CMDA and DTCP approved plots with legally clear documents — verify approvals for your chosen project with our sales team.' },
  { q: 'Is it safe to buy an under-construction or ongoing plotted project?', a: 'Yes — buying at ongoing projects by a trustworthy developer like Omshakthy Homes lets you lock in a price early with room for appreciation as infrastructure develops.' },
  { q: 'Does Omshakthy Homes provide registration and legal documentation support?', a: 'Yes. We provide a comprehensive range of registration services, legal support, and purchasing assistance throughout the transaction.' },
  { q: 'Can I schedule a free site visit for an ongoing project?', a: 'Absolutely. Book a free site visit by contacting our sales team or submitting an enquiry through our website.' },
  { q: 'What is the best time to visit an ongoing project site?', a: 'Come by anytime during working hours — weekend mornings and early visits work well so you can take a walk around and get a feel for connectivity and the general landscape.' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/ongoing-projects' },
  title: 'Ongoing Projects Chennai, Buy Integrated Township Plot Chennai',
  description: "Explore OmShakthy Homes' ongoing residential plot projects in Chennai — Elite Grand, Kanopus Magha, and OmShakthy Regalia.",
}

export default function OngoingProjectsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Ongoing Projects', path: '/ongoing-projects' },
  ])
  const faqSchema = getFAQSchema(FAQ.map((f) => ({ question: f.q, answer: f.a })))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <ProjectStatusPageContent
        kicker="Live Now"
        title="Ongoing Projects"
        intro="Thoughtfully planned plotted developments in some of Chennai's fastest-growing locations — backed by decades of experience and the trust of thousands of happy customers."
        projects={ongoingProjects}
        narrativeSections={NARRATIVE}
        faq={FAQ}
        ctaText="Ready to Book Your Plot?"
      />
      <Footer />
    </>
  )
}
