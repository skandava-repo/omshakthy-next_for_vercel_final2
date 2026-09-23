'use client'

// Real content rebuilt from the live site's own
// /buy-cmda-dtcp-plots-for-sale-chennai/* pages — these are indexed,
// ranking URLs (per Balaji's Aug 2026 SEO report) that the Next.js
// rebuild had never recreated. Preserved at their exact original
// paths rather than redirected/consolidated, per the explicit
// direction to keep marketing's indexed URLs working as-is. Same `C`
// palette / Reveal / Kicker / FAQ-accordion patterns as every other
// page on the site — duplicated locally rather than imported, same
// site-wide convention.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LocationHubData, LocationPageData } from '@/lib/locations'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  paperMuted: 'rgba(11, 31, 58, 0.66)',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const darkGradient = 'linear-gradient(180deg, #004385 0%, #0D6BB2 100%)'
const WHATSAPP_NUMBER = '919150088097'
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const easeLux = [0.16, 1, 0.3, 1] as const

const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10%' }}
    transition={{ duration: 0.7, delay, ease: easeLux }}
  >
    {children}
  </motion.div>
)

const Kicker = ({ children, color = C.blue, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) => (
  <div className={center ? 'flex flex-col items-center' : undefined}>
    <span style={{ ...mono, color }}>{children}</span>
    <span aria-hidden style={{ display: 'block', width: 34, height: 2.5, borderRadius: 999, background: C.gold, marginTop: 8 }} />
  </div>
)

// Real project cards — the same three OmShakthy Homes projects the
// live location pages themselves feature, linked to their actual
// rebuilt pages rather than duplicating spec data here.
const FEATURED: Record<string, { name: string; image: string; price: string; type: string; link: string }> = {
  'elite-grand': { name: 'Elite Grand', image: '/projects/elite-grand.webp', price: '₹10L onwards', type: 'DTCP Approved · Near Guduvanchery', link: '/elite-grand' },
  'kanopus-magha': { name: 'Kanopus Magha', image: '/projects/canopus-magha.webp', price: '₹5,500/Sq.Ft.', type: 'CMDA Approved · Near Avadi', link: '/kanopus-magha' },
  regalia: { name: 'OmShakthy Regalia', image: '/projects/regalia.webp', price: 'From ₹16.8L', type: 'CMDA & RERA Approved · Near Tambaram', link: '/regalia' },
}

function isHub(data: LocationPageData | LocationHubData): data is LocationHubData {
  return 'purchaseSteps' in data
}

export default function LocationPageContent({ data }: { data: LocationPageData | LocationHubData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const hub = isHub(data) ? data : null

  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>CMDA & DTCP Approved Plots</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              {data.heading}
            </h1>
          </Reveal>
          {data.intro.map((p, i) => (
            <Reveal key={p.slice(0, 30)} delay={0.06 + i * 0.05}>
              <p className="mt-4 max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.85)' }}>
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.2} className="mt-8">
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hi, I'm interested in plots near ${data.locationName}. Could you share more details?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold"
              style={{ ...body, backgroundColor: '#fff', color: C.blueDeep }}
            >
              Enquire on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Connectivity / amenities ---------------- */}
      {(data.connectivity?.length || data.amenities?.length) ? (
        <section className="px-6 md:px-16 py-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.connectivity?.length ? (
              <Reveal>
                <Kicker>Connectivity</Kicker>
                <h2 className="text-2xl md:text-3xl mt-4 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                  Getting Around {data.locationName}
                </h2>
                <ul className="space-y-3">
                  {data.connectivity.map((c) => (
                    <li key={c} className="flex items-baseline gap-3 text-sm" style={{ ...body, color: C.slate }}>
                      <span aria-hidden style={{ width: 5, height: 5, background: C.gold, transform: 'rotate(45deg)', flexShrink: 0 }} />
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
            {data.amenities?.length ? (
              <Reveal delay={0.08}>
                <Kicker>Amenities</Kicker>
                <h2 className="text-2xl md:text-3xl mt-4 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                  Well-Planned Infrastructure
                </h2>
                <ul className="space-y-3">
                  {data.amenities.map((a) => (
                    <li key={a} className="flex items-baseline gap-3 text-sm" style={{ ...body, color: C.slate }}>
                      <span aria-hidden style={{ width: 5, height: 5, background: C.gold, transform: 'rotate(45deg)', flexShrink: 0 }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ---------------- Hub-only: amenities intro ---------------- */}
      {hub && (
        <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <Kicker center>Project Amenities</Kicker>
              <h2 className="text-2xl md:text-4xl mt-4 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                Well-Planned Infrastructure for Modern Living
              </h2>
              <p style={{ ...body, color: C.slate }}>{hub.amenitiesIntro}</p>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8">
              {hub.amenities?.map((a) => (
                <span key={a} className="text-sm" style={{ ...mono, color: C.blue }}>
                  {a}
                </span>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------------- Featured projects ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-10">
            <Kicker>Featured Projects</Kicker>
            <h2 className="text-2xl md:text-4xl mt-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Real Projects Near {data.locationName}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.featuredProjects.map((slug, i) => {
              const p = FEATURED[slug]
              if (!p) return null
              return (
                <Reveal key={slug} delay={i * 0.06}>
                  <a href={p.link} className="block rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-full h-44 object-cover" loading="lazy" />
                    <div className="p-5">
                      <h3 className="text-lg" style={{ ...display, color: C.ink, fontWeight: 500 }}>{p.name}</h3>
                      <p className="mt-1 text-xs" style={{ ...mono, color: C.blue }}>{p.type}</p>
                      <p className="mt-2 text-sm font-semibold" style={{ ...body, color: C.ink }}>{p.price}</p>
                    </div>
                  </a>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Hub-only: purchase steps ---------------- */}
      {hub && (
        <section className="px-6 md:px-16 py-20" style={{ background: darkGradient }}>
          <div className="max-w-4xl mx-auto">
            <Reveal className="mb-10">
              <Kicker color={C.mist}>How It Works</Kicker>
              <h2 className="text-2xl md:text-4xl mt-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
                Steps to Purchase Your Plot
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hub.purchaseSteps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.05}>
                  <div className="flex gap-4">
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
                      style={{ width: 32, height: 32, border: `1px solid ${C.gold}`, color: C.gold, ...mono, fontSize: '0.85rem' }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold" style={{ ...body, color: '#fff' }}>{step.title}</h3>
                      <p className="mt-1 text-sm" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>{step.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Hub-only: mistakes to avoid ---------------- */}
      {hub && (
        <section className="px-6 md:px-16 py-20">
          <div className="max-w-3xl mx-auto">
            <Reveal className="mb-8">
              <Kicker>Buyer's Checklist</Kicker>
              <h2 className="text-2xl md:text-4xl mt-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                Mistakes to Avoid When Buying Plots in Chennai
              </h2>
            </Reveal>
            <ul className="space-y-4">
              {hub.mistakesToAvoid.map((m, i) => (
                <Reveal key={m.slice(0, 24)} delay={i * 0.05}>
                  <li className="flex gap-3 text-sm" style={{ ...body, color: C.slate }}>
                    <span aria-hidden style={{ width: 5, height: 5, background: C.gold, transform: 'rotate(45deg)', flexShrink: 0, marginTop: 8 }} />
                    {m}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------- FAQ (real accordion) ---------------- */}
      <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.panel }}>
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <Kicker center>Good to Know</Kicker>
            <h2 className="text-2xl md:text-4xl mt-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div>
            {data.faq.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={f.q} delay={i * 0.03}>
                  <div className="py-6" style={{ borderTop: `1px solid ${C.border}` }}>
                    <button
                      type="button"
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
                          transition={{ duration: 0.3, ease: easeLux }}
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
              Book a Free Site Visit
            </h2>
            <p className="mb-6" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Talk to our team about CMDA & DTCP approved plots near {data.locationName}.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hi, I'd like to book a site visit for plots near ${data.locationName}.`)}`}
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
