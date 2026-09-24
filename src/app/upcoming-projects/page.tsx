import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProjectStatusPageContent from '@/components/ui/ProjectStatusPageContent'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report. The
// old site's own /upcoming-projects.html has no project cards at all
// right now — genuinely nothing upcoming listed there at capture time
// — just narrative + FAQ, both real copy via the local mirror. Kept
// faithful rather than inventing project cards the real site doesn't
// have either.
const NARRATIVE = [
  {
    heading: 'Explore Upcoming Projects by OmShakthy Homes in Chennai',
    text: 'Invest in plots for sale in Chennai with high growth potential and complete peace of mind. Presenting some carefully curated upcoming projects in Chennai by Omshakthy Homes, crafted to appeal to both home buyers and investors. The brand leverages its experience in premium plotted communities over several decades to provide well-connected and legally clear developments.',
  },
  {
    heading: 'Thoughtfully Planned Communities for Every Lifestyle',
    text: "Omshakthy Homes' upcoming residential projects in Chennai are positioned at developing areas that are connected well with roads and other facilities. We develop planned residential plots where your dream home will be constructed, or you will make the finest real estate investment. Our plots cater to every need and budget.",
  },
  {
    heading: 'Live in a Well-Planned Gated Community',
    text: 'The upcoming gated community projects in Chennai have been designed thoughtfully with a view of providing the required infrastructure and comfortable layout for your daily living. With wide internal roads, green surroundings, drainage systems, and good-quality infrastructure, the communities will enable families to build their homes with peace of mind.',
  },
  {
    heading: 'Invest in New Residential Projects in Chennai with Confidence',
    text: 'As Chennai remains a growing metropolitan city, the demand for new residential projects continues to grow. Omshakthy Homes identifies these high-potential destinations to develop new upcoming projects that deliver both lifestyle benefits and investment value.',
  },
]

const FAQ = [
  { q: "How do I book a plot in OmShakthy's upcoming projects in Chennai?", a: 'Book your favorite plot by contacting our sales team, complete the formalities and make the initial booking payment — our sales team will guide you step-by-step.' },
  { q: 'What is the booking amount required for upcoming plots in Chennai?', a: 'The booking amount for upcoming projects varies based on the project and plot size. Contact us to know the latest pricing, booking amount, payment plans, and launch offers.' },
  { q: 'What documents are required to buy a plot in an upcoming project?', a: 'Identity proof, address proof, PAN card, passport-size photographs, and other registration-related documents. We will guide you through the documentation process.' },
  { q: "Can NRIs invest in OmShakthy's upcoming projects in Chennai?", a: 'Yes. NRIs can invest, subject to RBI and Government of India regulations. Our team provides complete support with documentation and the purchase process.' },
  { q: 'Is home loan or plot loan available for upcoming projects in Chennai?', a: 'Yes. Buyers can avail plot loans from leading banks and financial institutions, subject to eligibility and the selected project.' },
  { q: 'What is the possession timeline for upcoming plots in Chennai?', a: "The possession timeline depends on the project's development schedule — we share clear timelines during booking and are committed to timely delivery." },
  { q: 'What is the expected appreciation for plots in upcoming Chennai projects?', a: 'Appreciation depends on location, infrastructure growth, and future developments. We develop projects in promising locations with excellent long-term investment potential.' },
  { q: 'What is the minimum investment required to buy a plot in Chennai?', a: 'This may vary due to the location of the project, plot size, and project type. Reach out for updated pricing information and investment options.' },
  { q: 'Can I resell my plot before possession in an upcoming project?', a: "Yes. In many cases, plots purchased in upcoming projects can be resold before possession, subject to the project's terms and applicable legal guidelines." },
  { q: "What plot sizes are available in OmShakthy's upcoming projects?", a: 'A variety of plot sizes across upcoming projects to suit different budgets and lifestyle requirements. Availability may vary from one project to another.' },
  { q: 'Are corner plots or East-facing plots available in upcoming projects?', a: 'Yes. Depending on availability, buyers can choose corner plots, East-facing plots, and other preferred plot orientations.' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/upcoming-projects' },
  title: 'Upcoming Projects Assured in Chennai, Best Quality Homes Chennai',
  description: 'Carefully curated upcoming residential plot projects in Chennai by OmShakthy Homes — crafted to appeal to both home buyers and investors.',
}

export default function UpcomingProjectsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Upcoming Projects', path: '/upcoming-projects' },
  ])
  const faqSchema = getFAQSchema(FAQ.map((f) => ({ question: f.q, answer: f.a })))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <ProjectStatusPageContent
        kicker="Coming Soon"
        title="Upcoming Projects"
        intro="Invest in plots for sale in Chennai with high growth potential and complete peace of mind — carefully curated upcoming projects crafted for both home buyers and investors."
        narrativeSections={NARRATIVE}
        faq={FAQ}
        ctaText="Want to Be First in Line?"
      />
      <Footer />
    </>
  )
}
