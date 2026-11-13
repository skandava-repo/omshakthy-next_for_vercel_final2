'use client'

// Homepage FAQ — the old live site's index.php had a real 14-question
// accordion here that our rebuild never recreated. Ported faithfully
// (one answer had an obvious copy-paste duplication in the source,
// cleaned up here; "30 years" updated to "35+" per the site-wide pass).
// Real accordion (AnimatePresence height toggle), same visual pattern
// ProjectLandingContent.tsx's own FAQ section already uses elsewhere
// on this site.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
  hairLight: 'rgba(11, 31, 58, 0.1)',
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

const Kicker = ({ children, center = false, color = C.blue }: { children: React.ReactNode; center?: boolean; color?: string }) => (
  <div style={center ? { textAlign: 'center' } : undefined}>
    <span style={{ ...mono, color }}>{children}</span>
    <span aria-hidden style={{ display: 'block', width: 34, height: 2.5, borderRadius: 999, background: C.gold, marginTop: 8, ...(center ? { marginLeft: 'auto', marginRight: 'auto' } : {}) }} />
  </div>
)

const faqs = [
  {
    q: 'Is OmShakthy Homes a trusted real estate developer in Chennai?',
    a: 'OmShakthy Homes (a division of OmShakthy Agencies, established in 1991) is a leading name in Chennai real estate, having served more than 20,000 customers across several RERA-registered residential plot and apartment projects citywide.',
  },
  {
    q: 'Is OmShakthy Homes RERA registered?',
    a: 'Yes. All our projects are registered individually with the Tamil Nadu Real Estate Regulatory Authority (TNRERA) as per law. For example, Omshakthy Regalia holds RERA ID TN/1/Layout/2490/2025 and Omshakthy Elite Orathur holds RERA ID TN/01/Layout/8390/2022. You can find each project’s RERA number in its brochure and verify it yourself on the official TNRERA portal.',
  },
  {
    q: 'How long has OmShakthy been in the real estate business?',
    a: 'Omshakthy Agencies (Madras) Pvt Ltd traces its roots to 1991 and carries more than 35 years of experience in the Chennai real estate market.',
  },
  {
    q: 'Who are the best plot promoters in Chennai?',
    a: 'What matters most is clear titles, CMDA/DTCP approval, RERA compliance, genuine location growth potential, and real after-sales support. OmShakthy Homes has built its reputation on exactly that — clear-title land, RERA-registered layouts, and CMDA-approved plots in high-growth corridors.',
  },
  {
    q: 'What makes OmShakthy different from other real estate developers in Chennai?',
    a: 'We only deal in genuine clearances — clear ownership titles and CMDA/DTCP approved layouts — in locations chosen for long-term growth, not short-term hype. That includes full transparency from the first discussion through handover, whether you’re buying land or a built home.',
  },
  {
    q: 'Where is OmShakthy Homes located / how can I visit their office?',
    a: 'OmShakthy Homes is based at N-1, Jawaharlal Nehru Road, Ekkattuthangal, Chennai – 600 032. Call +91 44 4030 3040 to arrange an appointment or a site visit at any of our project locations.',
  },
  {
    q: 'Is OmShakthy only into plots, or do they build apartments too?',
    a: 'Both. While OmShakthy Homes is best known for RERA-approved residential and industrial plots, we’ve also delivered apartment projects — Omshakthy Kanopus in Avadi, for instance. We can guide you toward the right fit depending on what you need.',
  },
  {
    q: 'Which areas in Chennai does OmShakthy have plots in?',
    a: 'Our plot developments span high-growth corridors in and around Chennai, including Guduvanchery, Padappai, Tambaram (Varadharajapuram), Orathur, and Avadi — all close to major expressways and transit routes.',
  },
  {
    q: 'Does OmShakthy have any ready-to-move or completed projects?',
    a: 'Yes. Several of our plot layouts — Om Shakthy Elite Orathur and Omshakthy Regalia among them — are ready to move into, alongside completed apartment projects.',
  },
  {
    q: 'Can NRIs buy plots from OmShakthy Homes?',
    a: 'Yes, NRIs can invest in plots and properties with OmShakthy Homes, subject to standard RBI and FEMA guidelines governing NRI property purchases in India. We recommend consulting your own financial or legal adviser on any documentation specific to your country of residence.',
  },
  {
    q: 'What is the resale value/appreciation potential of OmShakthy plots?',
    a: 'Appreciation depends on location, infrastructure development, and market trends. Our project locations are chosen for growth corridors, proximity to expressways and industrial hubs, and emerging residential demand — all strong indicators for long-term value.',
  },
  {
    q: 'What documents should I check before buying a plot from OmShakthy?',
    a: 'Before purchasing, review: the project’s RERA registration certificate, CMDA/DTCP layout approval, the mother deed and chain of title, Patta and Chitta (land revenue records), the Encumbrance Certificate (EC), and the sale agreement terms. We provide all of this upfront and are happy to walk you through each one — an independent legal review before final purchase is standard practice we recommend to every buyer.',
  },
  {
    q: 'How is OmShakthy Homes rated by past customers?',
    a: 'You can read customer experiences and testimonials on our website and on individual project pages. We’d also encourage checking independent listings and review sites for a balanced view — we take customer feedback seriously and continue to improve our process based on it.',
  },
]

export default function HomeFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <section className="relative px-6 md:px-16 py-24" style={{ backgroundColor: '#fff', color: C.ink, ...body }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <Reveal><Kicker center color={C.blue}>Good to Know</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-2xl md:text-4xl mt-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
        </div>
        <div>
          {faqs.map((f, i) => {
            const isOpen = openFaq === i
            return (
              <Reveal key={f.q} delay={i * 0.02}>
                <div style={{ borderTop: `1px solid ${C.hairLight}` }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-6 text-left"
                  >
                    <h3 className="text-base md:text-lg" style={{ ...display, color: C.ink }}>{f.q}</h3>
                    <span
                      aria-hidden
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{
                        width: 28, height: 28,
                        border: `1.5px solid ${C.gold}`,
                        color: C.gold,
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
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
                        transition={{ duration: 0.35, ease }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p className="pb-6 text-sm md:text-base" style={{ color: C.slate }}>{f.a}</p>
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
  )
}
