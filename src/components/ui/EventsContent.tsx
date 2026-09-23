'use client'

// Real content from the old live site's own events.html (via the local
// site mirror) — the company's own event history, not invented. Same C
// palette / Reveal / Kicker pattern as LocationPageContent.tsx /
// ContactContent.tsx.
import { motion } from 'framer-motion'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const

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

interface EventItem {
  date: string
  title: string
  description: string
  image: string
}

// The 7 real events on the old site's events.html, in date order.
const events: EventItem[] = [
  { date: '25 Mar 2017', title: 'OmShakthy New Logo Launch', description: 'OmShakthy New Logo Launch', image: '/events/new-logo-launch.webp' },
  { date: '9 Apr 2017', title: 'Fire Realty Opening Ceremony', description: 'OmShakthy Fire Realty Opening Ceremony', image: '/events/fire-realty-opening.webp' },
  { date: '11 Apr 2017', title: 'OmShakthy Kanopus Launch', description: 'OmShakthy Kanopus Launch', image: '/events/kanopus-launch.webp' },
  { date: '11 Apr 2017', title: 'OmShakthy Elite Bhoomi Pooja', description: 'OmShakthy Elite — Bhoomi Pooja', image: '/events/elite-bhoomi-pooja.webp' },
  { date: '23 Apr 2017', title: 'Ungalil Yaar Adutha Prabhu Deva', description: 'Ungalil Yaar Adutha Prabhu Deva', image: '/events/vijay-tv-show.webp' },
  { date: '4 Sep 2017', title: 'Donation of Sewing Machines', description: 'Donation of 16 Sewing Machines to the school for Muscular Dystrophy by OmShakthy Homes', image: '/events/sewing-donation.webp' },
  { date: '23 Nov 2021', title: "Founder's Day Celebration", description: "Celebrated 30 years of our company's formation day at our office", image: '/events/founders-day.webp' },
]

export default function EventsContent() {
  const featured = events[events.length - 1]
  const rest = events.slice(0, -1).reverse()

  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>News &amp; Updates</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Events
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Milestones, launches and moments from three decades of OmShakthy Homes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Featured event ---------------- */}
      <section className="px-6 md:px-16 pt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, backgroundColor: '#fff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.image} alt={featured.title} className="w-full h-64 md:h-full object-cover" loading="lazy" />
              <div className="p-8 flex flex-col justify-center">
                <span style={{ ...mono, color: C.gold, fontSize: '0.75rem' }}>{featured.date}</span>
                <h2 className="text-2xl md:text-3xl mt-2 mb-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                  {featured.title}
                </h2>
                <p className="text-sm" style={{ color: C.slate }}>{featured.description}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Event grid ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((e, i) => (
            <Reveal key={e.title} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.image} alt={e.title} className="w-full h-44 object-cover" loading="lazy" />
                <div className="p-5 flex flex-col flex-1">
                  <span style={{ ...mono, color: C.blue, fontSize: '0.7rem' }}>{e.date}</span>
                  <h3 className="text-base md:text-lg mt-2 mb-2" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                    {e.title}
                  </h3>
                  <p className="text-sm flex-1" style={{ color: C.slate }}>{e.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
