'use client'

// Real content from the old live site's own
// land-aggregation-projects-chennai.html (via the local site mirror).
// Same C palette / Reveal / Kicker / FAQ-accordion pattern as
// LocationPageContent.tsx. Skips the original page's generic
// testimonials/blogs/contact cross-link sections (already covered
// site-wide by TestimonialsSection, the Blog listing, and Footer/
// SiteLinksSection) and keeps only the genuinely unique copy.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '919150088097'

const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10%' }}
    transition={{ duration: 0.7, delay, ease }}
  >
    {children}
  </motion.div>
)

const Kicker = ({ children, color = C.blue }: { children: React.ReactNode; color?: string }) => (
  <div>
    <span style={{ ...mono, color }}>{children}</span>
    <span aria-hidden style={{ display: 'block', width: 34, height: 2.5, borderRadius: 999, background: C.gold, marginTop: 8 }} />
  </div>
)

const faqs = [
  {
    q: 'What is Land Aggregation?',
    a: 'Land aggregation is the process of collecting land parcels from several locations for the purpose of developing land into plots. The specialty of OmShakthy land aggregation involves in acquiring land from clean negotiations from the land owners having clear ownership titles. By this we create larger, more manageable properties for development or investment purposes, making it easier to plan and execute large-scale projects facilitating safer investments in Chennai real estate for the homebuyers.',
  },
  {
    q: 'How do land aggregators work?',
    a: 'As one of the prominent land aggregators in Chennai, we identify multiple small land parcels in a targeted area and negotiate with individual landowners to purchase their land. By consolidating these parcels into a larger piece of land, aggregators like us play a significant role in the real estate ecosystem, regulating supply and demand in real estate industry.',
  },
  {
    q: 'What are the benefits of land aggregation for buyers?',
    a: 'For buyers, land aggregation offers several advantages, including access to larger and more strategically located land parcels that might not be available otherwise. It ensures more efficient land use, potentially lower purchase prices due to scale, and the opportunity to invest in prime locations for residential or commercial development. OmShakthy focuses on aggregating lands with clear titles, enabling buyers to confidently invest without the post-purchase hassle of document verification typically required when buying from individual owners.',
  },
]

// Real, currently-live projects that came out of OmShakthy's land
// aggregation — links to their own already-built pages rather than
// duplicating project data here.
const projects = [
  { name: 'Kanopus Magha', location: 'Avadi, Chennai', link: '/canopus-magha-lp' },
  { name: 'OmShakthy Regalia', location: 'Tambaram, Chennai', link: '/regalia-lp' },
  { name: 'Elite Grand', location: 'Guduvanchery, Chennai', link: '/elite-grand-lp' },
]

export default function LandAggregationContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Shifting Horizons in Real Estate</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Land Aggregation
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Land stands out as a top option for real estate investment in Chennai due to its
              enduring value, versatility, and solid long-term investment. Its potential for
              rezoning or repurposing further enhances its value — a finite, tangible asset that
              offers security and stability amid market fluctuations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Why land / amenities ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-4xl mx-auto space-y-14">
          <Reveal>
            <Kicker>Why Land Is the Go-To Option</Kicker>
            <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>
              We understand that buying a plot of land gives you the flexibility in designing and
              constructing homes according to personal preferences. OmShakthy&rsquo;s expertise lies
              in ensuring the land they offer has clear titles, making the transaction secure for
              buyers.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>Project Amenities at a Glance</Kicker>
            <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>
              Carrying out bespoke land aggregation processes across Chennai and the outskirts for
              varied choices, our success is ensured by our careful selection of locations
              surrounded by modern day amenities — whether a residential township or land for an
              industrial venture. Meticulously designed plot layouts, avenue trees, and LED street
              lights in some of our residential projects are just the beginning of our broader
              sustainability efforts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Projects from land aggregation ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-10">
            <Kicker color={C.blue}>Prime Locations, Profitable Investments</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Ongoing Land Aggregation Projects
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <Link
                  href={p.link}
                  className="block h-full rounded-2xl p-6"
                  style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
                >
                  <h3 className="text-lg" style={{ ...display, color: C.ink, fontWeight: 500 }}>{p.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: C.slate }}>{p.location}</p>
                  <span className="inline-block mt-4 text-sm font-semibold" style={{ color: C.blue }}>
                    View project →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-10">
            <Kicker>Common Questions</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={f.q} delay={i * 0.05}>
                  <div className="rounded-xl p-5" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left"
                    >
                      <h3 className="text-base md:text-lg" style={{ ...display, color: C.ink, fontWeight: 500 }}>{f.q}</h3>
                      <span
                        aria-hidden
                        className="flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ width: 28, height: 28, border: `1px solid ${C.gold}`, color: C.gold, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p className="pt-3 text-sm" style={{ ...body, color: C.slate }}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.ink }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Looking to Invest in Land?
            </h2>
            <p className="mb-6" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              We offer personalized guidance to land buyers in Chennai — from choosing the location
              to buying in EMI. Contact us for details on a particular industrial or residential
              project.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I'd like to know more about OmShakthy's land aggregation projects.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold"
              style={{ ...body, backgroundColor: C.gold, color: C.ink }}
            >
              Enquire on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
