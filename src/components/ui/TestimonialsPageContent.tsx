'use client'

// Real content extracted from the old live site's own testimonials.html
// (via the local site mirror), not the placeholder-padded reviews in
// TestimonialsSection.tsx (the homepage carousel — see that file's own
// comments: those quotes have clearly-marked lorem-ipsum filler
// appended, deliberately, pending real replacement text). This page is
// a real, indexed URL per Balaji's Aug 2026 SEO report, so it gets the
// genuine short quotes as they actually appear on the old site instead.
// Same C palette / Reveal / Kicker pattern as LocationPageContent.tsx.
import { motion } from 'framer-motion'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  blueDeep: '#004385',
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

const Kicker = ({ children, color = C.blue, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) => (
  <div className={center ? 'flex flex-col items-center' : undefined}>
    <span style={{ ...mono, color }}>{children}</span>
    <span aria-hidden style={{ display: 'block', width: 34, height: 2.5, borderRadius: 999, background: C.gold, marginTop: 8 }} />
  </div>
)

interface Review {
  quote: string
  name: string
  detail: string
  photo: string
}

// The 6 real reviews on the old site's testimonials.html, verbatim
// (typos and all — not corrected, to stay faithful to the source).
const reviews: Review[] = [
  {
    quote: 'Definitely! I feel happier and luckier after purchasing this flat. Life has changed for better. Owning a flat in Santha Towers is a symbol of security for my retired life.',
    name: 'Jalaja Madanmohan',
    detail: 'B103 — OmShakthy Santha Towers',
    photo: '/testimonials/real/jalaja-madanmohan.webp',
  },
  {
    quote: 'I specifically would like to thank OmShakthy and its team for providing, at extra cost, Reticulated Gas facility which was not originally listed in the construction agreement.',
    name: 'D. Dhanasekaran',
    detail: 'D802 — OmShakthy Santha Towers',
    photo: '/testimonials/real/dhanasekaran.webp',
  },
  {
    quote: "We are proud to be the owners of Santha Towers which has fulfilled all our criteria's. Our special thanks to the management who have conceptualised budget homes.",
    name: 'C. Nireesh',
    detail: 'B703 — OmShakthy Santha Towers',
    photo: '/testimonials/real/nireesh.webp',
  },
  {
    quote: "It's simply awesome, wonderful living environment and its remarkable tribute to both OmShakthy & Santha Towers to change the vicinity of Paruthipattu as spree in Chennai forever.",
    name: 'Inturi Sivanarayana',
    detail: 'B802 — OmShakthy Santha Towers',
    photo: '/testimonials/real/sivanarayana.webp',
  },
  {
    quote: 'OmShakthy built the flats in an uncompromised quality. I have observed it in stage wise. OmShakthy stands first to find the strategic location like Paruthipattu to community living. Customer friendly in sorting out the needs of customer.',
    name: 'Aradyula V Sastry',
    detail: 'B801 — OmShakthy Santha Towers',
    photo: '/testimonials/real/aradyula-sastry.webp',
  },
  {
    quote: 'It is really our weekend gateway for the time being. So at present my views are filled with peace, tranquillity, energy, breeze and brightness.',
    name: 'S. Vasant Rao',
    detail: 'C1004 — OmShakthy Santha Towers',
    photo: '/testimonials/real/vasant-rao.webp',
  },
]

export default function TestimonialsPageContent() {
  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>What Our Clients Say</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Testimonials
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Real words from OmShakthy homeowners — on the community they moved into, and the
              team that got them there.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Reviews grid ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.08}>
              <div
                className="h-full rounded-2xl p-6 flex flex-col"
                style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
              >
                <span aria-hidden style={{ ...display, fontSize: '2.5rem', color: C.gold, lineHeight: 1 }}>
                  &ldquo;
                </span>
                <p className="mt-2 text-sm flex-1" style={{ ...body, color: C.ink }}>
                  {r.quote}
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.photo}
                    alt={r.name}
                    width={44}
                    height={44}
                    loading="lazy"
                    className="rounded-full object-cover"
                    style={{ width: 44, height: 44 }}
                  />
                  <div>
                    <p className="text-sm font-semibold" style={{ ...display, color: C.ink }}>{r.name}</p>
                    <p className="text-xs" style={{ color: C.slate }}>{r.detail}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.ink }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Ready to Own Your Next Chapter?
            </h2>
            <p className="mb-6" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Talk to our team about CMDA & DTCP approved plots across Chennai.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I'd like to know more about OmShakthy's projects.")}`}
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
