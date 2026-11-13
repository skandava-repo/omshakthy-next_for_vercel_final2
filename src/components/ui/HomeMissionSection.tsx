'use client'

// Mission & Vision — real content from the old live site's own
// index.php (via the local mirror), which had this on the homepage
// and our rebuild never did. Rewritten tighter/less keyword-stuffed
// than the original SEO prose, but the same actual substance: clear
// titles + CMDA/DTCP approval + gated communities for the mission,
// growth-corridor planning + sustainability for the vision. Same
// C palette / Reveal / Kicker pattern as EventsContent.tsx /
// CareersContent.tsx — this site's standard text-section convention.
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

const pillars = [
  {
    kicker: 'Our Mission',
    title: 'Enabling Secure Land Possessions',
    text: 'We acquire land with unquestionable title and turn it into CMDA and DTCP sanctioned plots that hold up — gated communities built for safe, serene, long-term ownership, not just a sale.',
  },
  {
    kicker: 'Our Vision',
    title: 'Building Future-Ready Homes Across Chennai',
    text: "We find Chennai's most promising growth corridors and plan communities around them — seamless connectivity, everyday convenience, and sustainable, eco-conscious infrastructure built to last.",
  },
]

// Same homepage paragraph on the old site continues straight into this
// 4-item "we focus heavily on" list right before its own customer-count
// claim (already ported separately, in TestimonialsSection's Odometer)
// — a real, distinct content block this rebuild had dropped entirely.
const focusAreas = [
  'Areas or cities that promise good returns on investment',
  'CMDA & DTCP approved layouts',
  'Uncontested ownership titles',
  'Affordable prices to suit every pocket',
]

export default function HomeMissionSection() {
  return (
    <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
        {pillars.map((p, i) => (
          <Reveal key={p.kicker} delay={i * 0.1}>
            <Kicker color={C.blue}>{p.kicker}</Kicker>
            <h2 className="text-2xl md:text-3xl mt-4 mb-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              {p.title}
            </h2>
            <p className="text-base" style={{ color: C.slate }}>{p.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2} className="max-w-6xl mx-auto mt-16 pt-14" style={{ borderTop: `1px solid ${C.border}` }}>
        <Kicker color={C.blue}>What We Focus On</Kicker>
        <ul className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-4">
          {focusAreas.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base" style={{ color: C.slate }}>
              <span aria-hidden style={{ color: C.gold, marginTop: 2 }}>●</span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
