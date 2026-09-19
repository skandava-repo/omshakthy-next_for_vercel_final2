'use client'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'
// Same "BANKS Offering Loans" bank-logo strip regalia-lp.html has —
// reused directly from the home page rather than rebuilt, since a
// real version of it already exists there (FinancialPartnersSection).
import FinancialPartnersSection from './FinancialPartnersSection'
// The real, audited "Site Links" footer block — see that component's
// own header comment for what it contains and why it's shared.
import SiteLinksSection from './SiteLinksSection'

/* ------------------------------------------------------------------
   Site-wide blue-only palette — this page was still on its own
   "Heritage Indigo" gold-accented brand direction (brass #C9A227,
   ink #025f8a) from before the rest of the site consolidated onto
   one blue accent (same tokens AboutContent.tsx/ProjectsContent.tsx/
   ContactContent.tsx already use). Gold is gone; the accent role it
   played (brass) is now C.blue everywhere it was referenced.
   ------------------------------------------------------------------ */
const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  // Same alternate-section tint AboutContent.tsx/ProjectsContent.tsx/
  // ContactContent.tsx already use, for the light sections.
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
  paperMuted: 'rgba(251, 248, 242, 0.66)',
  inkMuted: 'rgba(11, 31, 58, 0.68)',
  hairLight: 'rgba(13, 107, 178, 0.35)',
  hairDark: 'rgba(251, 248, 242, 0.18)',
}

// Same gradient Footer.css's var(--gradient-dark-section) uses — every
// other section alternates back to this instead of going all-white.
const darkGradient = 'linear-gradient(180deg, #004385 0%, #0D6BB2 100%)'

// Same real WhatsApp number Footer.tsx's own floating button and
// ContactContent.tsx's lead form already use.
const WHATSAPP_NUMBER = '919150088097'
const ADDRESS = 'OmShakthy Regalia, Tambaram, Chennai'

const display: React.CSSProperties = {
  fontFamily: "'Fraunces', Georgia, serif",
  lineHeight: 1.02,
  letterSpacing: '-0.01em',
  fontWeight: 400,
}
const body: React.CSSProperties = {
  fontFamily: "'Inter', Helvetica, Arial, sans-serif",
  lineHeight: 1.6,
  fontWeight: 400,
}
const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', Consolas, monospace",
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  // Kicker labels ("Specifications", "Connectivity", "Generating Real
  // Assets"...) were reading too faint — 10% bigger (0.72rem -> 0.8rem)
  // and bolder (400 -> 700). Other mono usages set their own explicit
  // fontSize (times, footer contact line, etc.) so they're unaffected.
  fontSize: '1.0rem',
  fontWeight: 700,
}

/* ---------- Motion helpers ---------- */
const easeLux = [0.16, 1, 0.3, 1] as const

const Reveal = ({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Don't animate on the server — render content visible immediately.
  // Once hydrated, enable scroll-reveal animations.
  if (!mounted) {
    return <div className={className} style={style}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: easeLux } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12%' }}
    >
      {children}
    </motion.div>
  )
}

const Kicker = ({ children, color = C.blue }: { children: React.ReactNode; color?: string }) => (
  <span className="block mb-4" style={{ ...mono, color }}>
    {children}
  </span>
)

/* ---------- Count-up figure ---------- */
const CountUp = ({
  to,
  format = (n: number) => Math.round(n).toLocaleString('en-IN'),
}: {
  to: number
  format?: (n: number) => string
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

/* ---------- Simple line icons — same set/paths AboutContent.tsx's
   "By The Numbers" stat cards already use, reused here so Regalia's
   own stat cards (Specifications, Key Figures) look like the same
   design system instead of inventing a fresh icon style. ---------- */
const ICONS: Record<string, string> = {
  shield: 'M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z M9 12l2 2 4-4',
  pin: 'M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z M12 12a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  layers: 'm12 3 9 4.8-9 4.8-9-4.8L12 3Z M3 13l9 4.8 9-4.8 M3 17.4l9 4.8 9-4.8',
  calendar: 'M4 6h16v15H4Z M4 11h16 M8 3v5 M16 3v5',
  users: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M2 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5 M18 8a3 3 0 1 0 0-6 M17 12c2.5 0 5 2 5 5.5',
  map: 'M9 4 3 6v15l6-2 6 2 6-2V4l-6 2-6-2Z M9 4v15 M15 6v15',
  building: 'M5 21V7l7-4 7 4v14Z M9 21v-6h6v6 M9 11h.01 M15 11h.01 M9 15h.01 M15 15h.01',
  coin: 'M12 3v2.5 M12 18.5V21 M8 7.5c0-1.7 1.7-2.8 4-2.8s4 1.1 4 2.8-1.7 2.3-4 2.3-4 .6-4 2.3 1.7 2.9 4 2.9 4-1.1 4-2.9',
  // Amenities set — real per-item icons, not the "✦" glyph this had.
  gate: 'M6 20V10 M18 20V10 M6 10a6 4 0 0 1 12 0 M4 20h16 M10 20v-4h4v4',
  road: 'M9 3 6 21 M15 3l3 18 M12 6.5v2.5 M12 12v2.5 M12 17.5v2',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7l2.5 5L12 17l-2.5-5L12 7Z',
  lock: 'M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z M9.5 12.2h5v3.6h-5Z M10.5 12.2v-1.4a1.5 1.5 0 0 1 3 0v1.4',
  droplet: 'M12 3c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z',
  lamp: 'M12 3a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z M12 8.2V20 M8.5 20h7 M9 4.2l-1-1 M15 4.2l1-1',
  play: 'M3 20 8 4h8l5 16 M9 8v6l3 3 3-3V8',
  footprints: 'M4 16v-2.4c0-2.1-1-3.1-1-5.6.1-2.7 1.5-6 4.5-6C9.4 2 10 3.8 10 5.5c0 3.1-2 5.7-2 8.7V16a2 2 0 1 1-4 0Z M20 20v-2.4c0-2.1 1-3.1 1-5.6-.1-2.7-1.5-6-4.5-6-2.1 0-2.8 1.8-2.8 3.5 0 3.1 2 5.7 2 8.7V20a2 2 0 1 0 4 0Z M16 17h4 M4 13h4',
  court: 'M4 5h16v14H4Z M4 12h16 M12 5v14 M8 8.5a1 1 0 1 0 0 2 M16 8.5a1 1 0 1 0 0 2',
  camera: 'M4 8h3l1.5-2h7L17 8h3v11H4Z M12 12.5a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z',
}
const StatIcon = ({ name, size = 30, color = C.blue }: { name: string; size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[name]} />
  </svg>
)

/* ---------- Site visit lead form ----------
   regalia-lp.html's own "Book a free Site Visit — Furnish your
   details below" form (its own copy actually says "...to Canopus
   Mithila", leftover boilerplate from a different project's page —
   not repeated here). Same honest pattern as ContactContent.tsx: no
   backend/API route exists in this codebase, so submitting hands the
   details to the same real WhatsApp number Footer.tsx's own floating
   button uses, rather than a fake "thanks, we'll be in touch". */
const RegaliaSiteVisitForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = [
      `Hi, I'm ${name || 'a visitor from omshakthy.net'}. I'd like to book a free site visit to Omshakthy Regalia.`,
      phone ? `My number: ${phone}.` : '',
      email ? `Email: ${email}.` : '',
    ].filter(Boolean).join(' ')
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="rounded-2xl p-8" style={{ backgroundColor: C.panel }}>
      <h3 className="text-lg font-bold mb-1" style={{ ...display, color: C.ink }}>Book a Free Site Visit</h3>
      <p className="text-sm mb-6" style={{ color: C.slate }}>Furnish your details below to book a free site visit.</p>
      {/* Name/Mobile/Email — same 3 fields as regalia-lp.html's own
          <section class="freevisitbox"> form, which this was missing
          the Email field from. */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-5 py-3 rounded-full text-sm outline-none"
          style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile number"
          className="w-full px-5 py-3 rounded-full text-sm outline-none"
          style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full px-5 py-3 rounded-full text-sm outline-none"
          style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
        />
        <button
          type="submit"
          className="mt-1 px-6 py-3 rounded-full text-sm font-semibold self-start"
          style={{ ...mono, backgroundColor: C.blueDeep, color: '#fff' }}
        >
          Send via WhatsApp
        </button>
      </form>
    </div>
  )
}

const Regalia = () => {
  // Set page background to ink on mount
  useEffect(() => {
    document.body.style.backgroundColor = C.paper
    return () => { document.body.style.backgroundColor = '' }
  }, [])

  /* Page scroll progress */
  const { scrollYProgress } = useScroll()

  /* Hero parallax */
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const videoScale = useTransform(heroProgress, [0, 1], [1, 1.18])
  const videoY = useTransform(heroProgress, [0, 1], ['0%', '14%'])
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -140])
  const heroTextOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])

  return (
    <div style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0% 50%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: C.blue,
          zIndex: 1002,
        }}
      />

      {/* ---------------- Cinematic hero ---------------- */}
      <div ref={heroRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: C.blueDeep }}>
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: videoScale, y: videoY }}
          src="/regalia-video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={(e) => {
            // freeze on the final frame instead of looping
            const v = e.currentTarget
            v.pause()
            if (v.duration) v.currentTime = v.duration
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,67,133,0.94) 4%, rgba(0,67,133,0.25) 45%, rgba(0,67,133,0.4))' }}
        />

        {/* Foreground hero copy */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="absolute bottom-16 left-6 md:left-16 max-w-3xl"
        >
          <motion.span
            className="block mb-4"
            style={{ ...mono, color: C.blue }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLux }}
          >
            Now Open · Tambaram, Chennai
          </motion.span>
          <motion.h1
            className="text-5xl md:text-8xl"
            style={{ ...display, color: C.paper, fontWeight: 500 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: easeLux }}
          >
            Omshakthy Regalia
          </motion.h1>
          <motion.p
            className="mt-5 text-base md:text-xl"
            style={{ ...body, color: C.paperMuted }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeLux }}
          >
            Plots you can walk. Papers you can trust.
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ ...mono, color: C.paperMuted, fontSize: '0.6rem' }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll
        </motion.div>
      </div>

      {/* ---------------- Brand story (paper, pulled up over hero) ---------------- */}
      <div
        className="relative -mt-16 rounded-t-[2.5rem] overflow-hidden"
        style={{ backgroundColor: C.paper, boxShadow: '0 -40px 80px rgba(0,67,133,0.6)' }}
      >
        <section className="relative px-6 md:px-16 py-28 max-w-4xl mx-auto">
          <Reveal>
            <Kicker>Generating Real Assets</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-3xl md:text-5xl mb-8" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              We don't sell plots. We help families plant something that outlives us.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ color: C.inkMuted }}>
              Omshakthy begins with a simple conviction — that the most honest wealth a family can
              build is rooted, measured in acres not algorithms. From DTCP-approved layouts to gated
              farm communities, every project is a promise: clear title, transparent paperwork, and
              guidance from a team that treats each buyer like a life-long neighbour.
            </p>
          </Reveal>
        </section>
      </div>

      {/* ---------------- Specifications (footer-blue gradient) ----------------
          The one thing this page didn't have at all — the actual plot
          specs a buyer needs, pulled straight from regalia-lp.html's
          own spec table (961 Plots / ₹2800 per sq.ft / 600-2400 sqft /
          70 Acres), not invented. Everything above/below this was
          generic company copy; this is Regalia-specific.
          Cards rebuilt to match AboutContent.tsx's "A Legacy Measured
          by Trust" stat cards (white bordered cards, icon on top, bold
          number, gray label), floating on the same blue gradient
          Footer.css uses — not converted to a flat white section, the
          gradient itself stays. */}
      <section className="px-6 md:px-16 py-20" style={{ background: darkGradient }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker color={C.mist}>Specifications</Kicker>
              <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 500 }}>
                The Plot, In Numbers
              </h2>
            </div>
            {/* regalia-lp.html has a "Download Brochure" button here —
                its own link points to a different project's PDF
                (ebro_kanopus.pdf), and no real Regalia brochure file
                exists anywhere in the source. Rather than replicate
                that broken/mismatched link, this asks for the
                brochure over WhatsApp instead — real, working,
                honest about what's actually available. */}
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent('Hi, could you send me the Omshakthy Regalia brochure?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ ...body, backgroundColor: C.paper, color: C.blueDeep }}
            >
              Request Brochure
            </a>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: 'building', label: 'Number of Units', value: '961 Plots' },
              { icon: 'coin', label: 'Price', value: '₹2,800 / Sq.Ft' },
              { icon: 'layers', label: 'Size', value: '600 – 2400 Sq.Ft' },
              { icon: 'pin', label: 'Type', value: 'Residential Plots' },
              { icon: 'map', label: 'Total Area', value: '70 Acres' },
              { icon: 'calendar', label: 'Possession', value: 'Ready for Construction' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div
                  className="h-full rounded-2xl bg-white p-6 text-center"
                  style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}
                >
                  <div className="flex justify-center">
                    <StatIcon name={s.icon} />
                  </div>
                  <p className="mt-4 text-lg md:text-xl font-bold" style={{ ...display, color: C.ink }}>{s.value}</p>
                  <p className="mt-1 text-sm" style={{ color: C.slate }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Connectivity (paper) ----------------
          Real nearby-landmark drive times, from regalia-lp.html's own
          "Locations Nearby" list. Was missing 2 of the 10 real entries
          (Auro Hub, Max Showroom) on the first pass — full list now.
          Intro paragraph is regalia-lp.html's own "A Tambaram Location
          That Keeps You Connected" copy, word for word — was entirely
          absent before, only the structured list existed.
          paper, not ink — Specifications right above is now ink,
          alternating properly instead of two ink sections in a row. */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-12">
            <Kicker>Connectivity</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              A Tambaram Address That Keeps You Close
            </h2>
            <p className="mt-4 max-w-2xl" style={{ color: C.slate }}>
              Tambaram is valued by families and working professionals for its access to schools,
              colleges, healthcare facilities, workplaces and major road networks — the Outer Ring
              Road is about four minutes away, supporting easier travel to key parts of Chennai and
              its developing suburbs.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { name: 'Vels Global School', time: '9 Mins' },
              { name: 'Sri Chaitanya Techno School', time: '14 Mins' },
              { name: 'Dhanalakshmi College of Engineering', time: '11 Mins' },
              { name: 'Annai Arul Hospital', time: '14 Mins' },
              { name: 'Outer Ring Road', time: '4 Mins' },
              { name: 'Thirumudivakkam SIDCO & SIPCOT', time: '13 Mins' },
              { name: 'MEPZ', time: '20 Mins' },
              { name: 'Shri Kailasanathar Temple', time: '8 Mins' },
              { name: 'Auro Hub', time: '30 Mins' },
              { name: 'Max Showroom', time: '10 Mins' },
            ].map((l, i) => (
              <Reveal key={l.name} delay={i * 0.03}>
                <div className="flex items-baseline justify-between py-3" style={{ borderBottom: `1px solid ${C.hairLight}` }}>
                  <span style={{ color: C.inkMuted }}>{l.name}</span>
                  <span style={{ ...mono, color: C.blue, fontSize: '0.9rem', flexShrink: 0, marginLeft: '1rem' }}>{l.time}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Build Your Future (panel) ----------------
          regalia-lp.html's <section class="page-innerlocation-section">
          — one cohesive H1 + four H2 block with full paragraphs under
          each. Earlier passes only pulled short excerpts from this
          into other sections' subtitles (Brand Story, Amenities,
          Connectivity); this is the actual block, built as its own
          section in its real document position, not fragments.
          panel, not white or dark — Connectivity right above is white
          and Key Figures right below is the dark gradient, so panel
          keeps three different tones in a row instead of repeating
          either neighbor. */}
      <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.panel }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker>Nature Dream Influence</Kicker>
            <h2 className="text-3xl md:text-5xl mb-6" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Build Your Future at Omshakthy Regalia
            </h2>
            <p style={{ color: C.inkMuted }}>
              A home begins with the freedom to shape it your way. Omshakthy Homes Regalia brings
              that freedom to life through thoughtfully planned residential plots in a secure,
              well-connected setting near Tambaram. Developed by Omshakthy Homes, a trusted name in
              Chennai real estate, this project is designed for homebuyers and investors seeking a
              location that supports comfortable everyday living and long-term value.
            </p>
            <p className="mt-4" style={{ color: C.inkMuted }}>
              The Omshakthy Regalia residential layout combines the advantages of plot ownership
              with the comfort of a planned gated community. Whether the goal is to build a home for
              your family now or invest in land for the future, Regalia offers a space where
              convenience, safety, and lifestyle come together. The project&rsquo;s CMDA and
              DTCP-approved plots add an important layer of assurance for buyers who value properly
              approved property investments.
            </p>
          </Reveal>

          {[
            {
              h: 'A Gated Plot Community Designed for Everyday Comfort',
              p: [
                'At Omshakthy Regalia, every feature is planned to make life easier, safer, and more enjoyable. The layout offers the setting of a residential neighbourhood while allowing buyers the flexibility to build a home that reflects their needs, preferences, and timeline.',
                'A welcoming grand entrance creates a strong first impression, while blacktop internal roads support smooth movement within the community. Vastu-compliant planning adds further appeal for buyers who prefer homesites aligned with traditional principles. The gated community setting and 24x7 CCTV surveillance are designed to offer an added sense of security for residents and their families.',
                'Lifestyle is also woven into the layout through landscaped open spaces, a children’s play area, walking and jogging tracks, and multipurpose courts. Solar LED streetlights help create well-lit internal streets, while rainwater-harvesting provisions reflect a thoughtful approach to responsible living. These features make Omshakthy Regalia Tambaram more than a plot purchase; it is an opportunity to be part of a planned community.',
              ],
            },
            {
              h: 'A Tambaram Location That Keeps You Connected',
              p: [
                'The Omshakthy Regalia Tambaram location places residents close to many of the everyday destinations that matter. Tambaram continues to be valued by families and working professionals for its access to schools, colleges, healthcare facilities, workplaces, and major road networks.',
                'The Outer Ring Road is approximately four minutes away, supporting easier travel to key parts of Chennai and its developing suburbs. Educational institutions such as Vels Global School, Sri Chaitanya Techno School, and Dhanalakshmi College of Engineering are within convenient reach. Annai Arul Hospital is also nearby, helping families stay connected to essential healthcare services.',
                'For professionals, employment hubs such as Thirumudivakkam SIDCO and SIPCOT, as well as MEPZ, are accessible from the project. This connectivity can make the Omshakthy Regalia residential layout a practical choice for those who want to live close to work corridors without giving up the calm of a residential environment.',
              ],
            },
            {
              h: 'An Approved Plot Investment with Lasting Potential',
              p: [
                'Buying a plot gives you the ability to plan your home on your own terms. With CMDA and DTCP approvals, the plots at Omshakthy Regalia offer buyers greater confidence while evaluating their property purchase. Approved layouts are especially important for buyers looking for clarity in documentation and an easier path toward financing, subject to individual bank eligibility.',
                'Omshakthy Homes brings its experience in land aggregation, residential development, and customer support to every project. The brand focuses on clear-title land, strategic locations, and transparent support throughout the buying journey. With a gated setting, lifestyle amenities, and connectivity to Tambaram’s key destinations, Omshakthy Regalia Tambaram is positioned for families who wish to build and investors who wish to plan ahead.',
              ],
            },
            {
              h: 'Take the First Step Towards Your Plot',
              p: [
                'Visit Omshakthy Regalia and experience the location, layout, and community features firsthand. Book a free site visit with Omshakthy Homes to explore the available CMDA and DTCP-approved residential plots and choose a space for the home you have envisioned.',
              ],
            },
          ].map((block, i) => (
            <Reveal key={block.h} delay={0.06 + i * 0.05} className="mt-10">
              <h3 className="text-xl md:text-2xl mb-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                {block.h}
              </h3>
              {block.p.map((para) => (
                <p key={para.slice(0, 24)} className="mt-3" style={{ color: C.inkMuted }}>{para}</p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Key figures (footer-blue gradient) — animated count-up ----------------
          Same white stat cards as Specifications, floating on the
          same Footer.css blue gradient — the Marquee ticker right
          above it is dropped entirely (didn't fit either version). */}
      <section className="px-6 md:px-16 py-24" style={{ background: darkGradient }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <Kicker color={C.mist}>By The Numbers</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 500 }}>
              Thirty-plus years. Zero title disputes.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'map', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, unit: 'Acres', label: 'Successfully aggregated & developed' },
              { icon: 'building', to: 30, format: (n: number) => `${Math.round(n)}+`, unit: 'Projects', label: 'Landmark projects delivered' },
              { icon: 'layers', to: 2, format: (n: number) => `${Math.round(n)} Lakh+`, unit: 'Sq.Ft', label: 'Commercial space leased' },
              { icon: 'users', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, unit: 'Customers', label: 'Happy customers since 1991' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div
                  className="h-full rounded-2xl bg-white p-6 text-center"
                  style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}
                >
                  <div className="flex justify-center">
                    <StatIcon name={s.icon} />
                  </div>
                  <div className="mt-4 text-3xl md:text-4xl font-bold" style={{ ...display, color: C.ink }}>
                    <CountUp to={s.to} format={s.format} />
                  </div>
                  <p className="mt-2 text-sm" style={{ color: C.slate }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Since 1991 (paper, oversized statement) ----------------
          paper, not ink — Key Figures right above is ink; this and
          Amenities right below were both ink too (three ink sections
          in a row before this fix). */}
      <section className="px-6 md:px-16 py-28 text-center" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <Kicker>Est. 1991 · Chennai</Kicker>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-2xl md:text-4xl" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Incorporated in 1991 to consolidate land for the future — industries, Special Economic
              Zones and residential spaces around the prime corridors of the city.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Amenities (footer-blue gradient) ----------------
          Real 10-item list from regalia-lp.html's "Special Features" —
          was 5 generic real-estate-marketing badges that weren't
          specific to this project ("Fast-Growing Location", "Modern
          Amenities") before. White icon circles float on the same
          Footer.css blue gradient, same as Specifications/Key Figures. */}
      <section className="px-6 md:px-16 py-28" style={{ background: darkGradient }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <Kicker color={C.mist}>Amenities</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper }}>
              Where Lifestyle Meets Coziness
            </h2>
            {/* regalia-lp.html's own "A Gated Plot Community Designed
                for Everyday Comfort" copy, word for word — was entirely
                absent, only the structured badge list existed. */}
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: C.paperMuted }}>
              A welcoming grand entrance creates a strong first impression, while blacktop internal
              roads support smooth movement within the community. The gated setting and 24×7 CCTV
              surveillance offer an added sense of security, while landscaped open spaces, a
              children&rsquo;s play area and walking &amp; jogging tracks weave lifestyle into the
              layout itself.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {[
              { label: 'Grand Entrance', icon: 'gate' },
              { label: 'Blacktop Roads', icon: 'road' },
              { label: 'Vastu Compliant', icon: 'compass' },
              { label: 'Gated Community', icon: 'lock' },
              { label: 'Rainwater Harvesting', icon: 'droplet' },
              { label: 'Solar LED Streetlights', icon: 'lamp' },
              { label: "Children's Play Area", icon: 'play' },
              { label: 'Walking & Jogging Tracks', icon: 'footprints' },
              { label: 'Multipurpose Courts', icon: 'court' },
              { label: '24x7 CCTV Surveillance', icon: 'camera' },
            ].map((a, i) => (
              <Reveal key={a.label} delay={i * 0.05} className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-white"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3, ease: easeLux }}
                >
                  <StatIcon name={a.icon} size={26} />
                </motion.div>
                <p style={{ ...mono, color: C.paper, fontSize: '0.71rem' }}>{a.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Mission / Vision (white) ---------------- */}
      <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { t: 'Our Mission', p: 'To turn every rupee of trust into a real, title-clear asset that lasts for generations.' },
            { t: 'Our Vision', p: "To be South India's most trusted steward of land — where legacy is engineered, not imagined." },
          ].map((m, i) => (
            <Reveal key={m.t} delay={i * 0.1}>
              <Kicker>{m.t}</Kicker>
              <p className="text-2xl md:text-3xl" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                {m.p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ (footer-blue gradient) ---------------- */}
      <section className="px-6 md:px-16 py-28" style={{ background: darkGradient }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <Kicker color={C.mist}>Good to Know</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 500 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div>
            {[
              {
                q: 'Is Omshakthy a trusted real estate developer in Chennai?',
                a: 'Omshakthy Homes (a division of Omshakthy Agencies, established 1991) has served more than 20,000 customers across several RERA-registered residential plots and apartment projects.',
              },
              {
                q: 'Is Omshakthy Regalia RERA registered?',
                a: 'Yes — the project carries CMDA and DTCP approvals, and is registered with TNRERA. Ask our sales team for the exact RERA registration number and verify it directly on the TNRERA portal before booking.',
              },
              {
                q: 'How long has Omshakthy been in the business?',
                a: 'Omshakthy Agencies (Madras) Pvt Ltd traces its roots to 1991 and carries more than 30 years of experience in the Chennai land market.',
              },
              {
                q: 'Where is Omshakthy located?',
                a: 'OmShakthy Tower, 1N1 Jawaharlal Nehru Salai, Ekkaduthangal, Chennai 600032. Call to arrange an office visit or a Saturday site walk.',
              },
              {
                q: 'Can NRIs buy plots from Omshakthy?',
                a: 'Yes. NRIs can invest subject to standard RBI and FEMA guidelines governing NRI property purchases in India.',
              },
            ].map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className="py-7" style={{ borderTop: `1px solid ${C.hairLight}` }}>
                  <h3 className="text-lg md:text-xl mb-3" style={{ ...display, color: C.paper }}>
                    {f.q}
                  </h3>
                  <p style={{ color: C.paperMuted }}>{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Project Images (paper) ----------------
          regalia-lp.html's actual "Project Images & Videos" swiper —
          missed entirely on the first two passes because it's a list
          of <img> tags, which the plain-text extraction method used
          to read the rest of the page strips out along with every
          other tag. All 9 real site photos (snap.0123-0263.webp),
          not the 3 generic ones this had a moment ago. */}
      <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <Kicker>Project Images</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              See Regalia for Yourself
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'snap.0123', 'snap.0134', 'snap.0169',
              'snap.0191', 'snap.0240', 'snap.0244',
              'snap.0248', 'snap.0250', 'snap.0263',
            ].map((name, i) => (
              <Reveal key={name} delay={i * 0.04} className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)' }}>
                <img
                  src={`/projects/regalia-gallery/${name}.webp`}
                  alt="Omshakthy Regalia"
                  className="w-full h-[180px] md:h-[200px] object-cover"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Banks Offering Loans ----------------
          regalia-lp.html's own "BANKS Offering Loans" carousel — the
          real version of this already exists on the home page
          (FinancialPartnersSection), reused here as-is rather than
          rebuilt from scratch. */}
      <FinancialPartnersSection />

      {/* ---------------- Location Map (footer-blue gradient) ----------------
          regalia-lp.html's "Location Map" + "Find the directions from
          nearby locations" quick-links — didn't exist here at all.
          Real embedded map (Google's no-API-key q=-embed, geocoded
          from the real address) and real Google Maps direction links,
          not fabricated coordinates. */}
      <section className="px-6 md:px-16 py-24" style={{ background: darkGradient }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-10">
            <Kicker color={C.mist}>Location Map</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 500 }}>
              Find the Directions From Nearby Locations
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl overflow-hidden mb-6" style={{ height: 360 }}>
            <iframe
              title="Omshakthy Regalia location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
          <Reveal delay={0.16} className="flex flex-wrap gap-3">
            {['Mudichur', 'Chromepet', 'Thirumudivakkam', 'Vandalur'].map((area) => (
              <a
                key={area}
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(area + ', Chennai')}&destination=${encodeURIComponent(ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-sm"
                style={{ ...body, border: `1px solid ${C.hairLight}`, color: C.paper }}
              >
                From {area}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- Book a Free Site Visit (paper) ----------------
          regalia-lp.html's actual lead-capture form + "Quick Contact"
          block, plus its closing "An Approved Plot Investment with
          Lasting Potential" / "Take the First Step" narrative — none
          of this existed here before. No backend/API route exists
          anywhere in this codebase, so the form hands off to the same
          real WhatsApp number Footer.tsx's own button uses, instead of
          pretending to submit to an endpoint that isn't there (same
          pattern as ContactContent.tsx's form). */}
      <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-start">
          <Reveal>
            <Kicker>Take the First Step</Kicker>
            <h2 className="text-2xl md:text-4xl mb-6" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Book a Free Site Visit
            </h2>
            <p style={{ color: C.inkMuted }}>
              With CMDA and DTCP approvals, the plots at Omshakthy Regalia offer buyers greater
              confidence while evaluating their property purchase. Visit Regalia and experience the
              location, layout and community features firsthand — furnish your details below to
              book a free site visit.
            </p>
            <div className="mt-8">
              <Kicker>Quick Contact</Kicker>
              <p style={{ color: C.inkMuted }}>
                <a href="tel:04440303040" className="hover:opacity-70" style={{ color: C.blue }}>Ph: +91 44 40303040</a>
                <br />
                <a href="mailto:marketing@omshakthy.net" className="hover:opacity-70" style={{ color: C.blue }}>E-Mail: marketing@omshakthy.net</a>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <RegaliaSiteVisitForm />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Contact (footer-blue gradient) ----------------
          Was white/paper before — changed so the alternation keeps
          going after the two new light sections above it, and so it
          hands off smoothly into Footer's own dark blue right below. */}
      <section className="px-6 md:px-16 py-24 text-center" style={{ background: darkGradient, color: C.paper }}>
        <Reveal>
          <Kicker color={C.mist}>Get in Touch</Kicker>
          <p className="text-2xl md:text-4xl mb-4" style={{ ...display, color: C.paper, fontWeight: 500 }}>
            Omshakthy Agencies (Madras) Pvt Ltd
          </p>
          <p style={{ ...mono, color: C.paperMuted, fontSize: '0.7rem' }}>
            OmShakthy Tower · 1N1 Jawaharlal Nehru Salai · Ekkaduthangal · Chennai 600032
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4" style={{ ...mono, color: C.paper }}>
            <a href="tel:04440303040" className="hover:opacity-70">044 40303040</a>
            <span style={{ color: C.hairLight }}>·</span>
            <a href="mailto:marketing@omshakthy.net" className="hover:opacity-70">marketing@omshakthy.net</a>
          </div>
          <p className="mt-10" style={{ ...mono, color: C.paperMuted, fontSize: '0.66rem' }}>
            Generating Real Assets
          </p>
        </Reveal>
      </section>

      {/* ---------------- Site Links (white) ----------------
          regalia-lp.html's own <div class="innrfooterbox"> content —
          per request, built as this page's own section (not merged
          into the shared <Footer/>, which renders separately right
          after this component in page.tsx), so it sits before the
          footer rather than inside it. Every entry was audited link-
          by-link against what actually exists in this rebuild (see
          SiteLinksSection.tsx's own header comment for the full list
          of fixes) — pulled into its own shared component once the
          six other project landing pages needed the exact same,
          already-verified block. */}
      <SiteLinksSection backgroundColor={C.paper} />
    </div>
  )
}

export default Regalia
