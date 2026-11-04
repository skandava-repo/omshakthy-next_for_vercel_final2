'use client'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'
// Same "BANKS Offering Loans" bank-logo strip regalia-lp.html has —
// reused directly from the home page rather than rebuilt, since a
// real version of it already exists there (FinancialPartnersSection).
import Link from 'next/link'
import FinancialPartnersSection from './FinancialPartnersSection'
// The real, audited "Site Links" footer block — see that component's
// own header comment for what it contains and why it's shared.
import SiteLinksSection from './SiteLinksSection'
// Same cross-sell data ProjectLandingContent.tsx pulls from — see
// that file's own comments on both of these. Duplicated here rather
// than imported, matching this file's own established convention of
// not cross-importing primitives between these two pages.
import { projects } from '@/lib/projectsData'
import blogPosts from '@/data/blog/summary.json'
import './RegaliaContent.css'

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
  // One deliberate exception to "gold is gone" above: the Kicker rule
  // below is the one place every other project page (ProjectLandingContent.tsx)
  // still shows this same brass gold consistently, so this page now
  // matches that one detail for parity rather than being the odd one out.
  gold: '#C9A227',
}

// Same gradient Footer.css's var(--gradient-dark-section) uses — every
// other section alternates back to this instead of going all-white.
const darkGradient = 'linear-gradient(180deg, #004385 0%, #0D6BB2 100%)'

// Same real WhatsApp number Footer.tsx's own floating button and
// ContactContent.tsx's lead form already use.
const WHATSAPP_NUMBER = '919150088097'
const ADDRESS = 'OmShakthy Regalia, Tambaram, Chennai'
// Same real tree cutout ProjectLandingContent.tsx's TreeAccent uses —
// this page never had the decorative corner foliage the other 8
// project landing pages all got once that component existed.
const TREE = '/decor/tree-accent.webp'

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

// Real reviews from the old site's own testimonials.html — same
// "Know More... Directly from the Owners" block every project landing
// page on the old mirror showed (confirmed on industrial-park.html),
// missing entirely on this page until now. Same fixed set
// ProjectLandingContent.tsx uses, not page-specific content.
const testimonials = [
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
]

// Same "Our Blogs - Explore Property Development in Chennai!" fixed
// 3-post cross-sell ProjectLandingContent.tsx uses, also missing here
// until now.
const BLOG_CROSS_SELL_SLUGS = [
  'what-is-rera-act-in-real-estate-and-why-is-rera-registration-important',
  'how-to-check-if-your-plot-is-dtcp-approved-or-not',
  '6-best-places-to-buy-residential-plots-in-chennai',
]
const crossSellPosts = BLOG_CROSS_SELL_SLUGS
  .map((slug) => blogPosts.find((b) => b.slug === slug))
  .filter((b): b is (typeof blogPosts)[number] => Boolean(b))

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

const Kicker = ({ children, color = C.blue, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) => (
  <span className={`mb-4 ${center ? 'flex flex-col items-center' : 'block'}`}>
    <span style={{ ...mono, color }}>{children}</span>
    {/* Small accent rule under every kicker, same motif
        ProjectLandingContent.tsx's own Kicker has (in gold there) —
        missing here before. In blue, not gold: this page deliberately
        dropped the old brass accent for the site-wide blue-only
        palette (see this file's own top comment), so the rule is
        ported with that same substitution rather than reintroducing
        gold. `center` (also new, same reason) is needed so this rule
        actually centers under centered kickers (Since 1991, Key
        Figures, Amenities, FAQ) instead of sitting flush-left under
        centered text — a block element doesn't follow its parent's
        text-align on its own. */}
    <span className="block mt-2 rounded-full" style={{ width: 34, height: 2.5, background: C.gold }} />
  </span>
)

// Same word-by-word rise ProjectLandingContent.tsx's KineticHeading
// uses — each word sits in its own overflow-hidden mask and slides up
// into place with its own stagger. Every section heading on this page
// was a plain, static <h2>/<h3> until now; every other project landing
// page already had this.
const KineticHeading = ({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const words = text.split(' ')
  if (!mounted) {
    return <h2 className={className} style={style}>{text}</h2>
  }
  return (
    <h2 className={className} style={style}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            paddingBottom: '0.15em',
            marginBottom: '-0.15em',
            marginRight: i < words.length - 1 ? '0.28em' : 0,
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotate: 4 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: delay + i * 0.08, ease: easeLux }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

// A single oversized outline numeral, stroke-only and low-opacity —
// same device ProjectLandingContent.tsx's GhostNumeral uses behind the
// Connectivity/Amenities section counts. Real counts only.
const GhostNumeral = ({ n, color }: { n: number | string; color: string }) => (
  <span
    aria-hidden
    className="absolute select-none pointer-events-none hidden md:block"
    style={{
      ...display,
      top: '-2.5rem',
      right: 0,
      fontSize: 'clamp(6rem, 13vw, 10rem)',
      fontWeight: 700,
      lineHeight: 1,
      color: 'transparent',
      WebkitTextStroke: `1.5px ${color}`,
      opacity: 0.5,
    }}
  >
    {typeof n === 'number' ? String(n).padStart(2, '0') : n}
  </span>
)

// Soft, low-opacity foliage anchored to a corner — same decorative
// tree cutout ProjectLandingContent.tsx's TreeAccent uses on
// Specifications/Since-1991/Amenities/Mission/FAQ/Visit. `tone` swaps
// between warm original greens (light backgrounds) and a duotone-navy
// recolor (dark-gradient sections).
const TreeAccent = ({
  side = 'left',
  tone = 'natural',
  size = 340,
  bottom = -40,
  opacity = 0.22,
}: {
  side?: 'left' | 'right'
  tone?: 'natural' | 'navy'
  size?: number
  bottom?: number
  opacity?: number
}) => (
  <div
    aria-hidden
    className="absolute pointer-events-none select-none hidden md:block"
    style={{
      [side]: -size * 0.22,
      bottom,
      width: size,
      height: size,
      opacity,
      filter: tone === 'navy' ? 'grayscale(1) brightness(0.6) sepia(1) hue-rotate(175deg) saturate(3)' : undefined,
      transform: side === 'right' ? 'scaleX(-1)' : undefined,
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={TREE} alt="" className="w-full h-full object-contain object-bottom" />
  </div>
)

// A thin rule + diamond glyph between a section's kicker/heading block
// and its body — same "heritage" flourish ProjectLandingContent.tsx's
// OrnamentDivider uses on Since 1991. In blue, not gold — same
// substitution reasoning as Kicker's rule above.
const OrnamentDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-6" aria-hidden>
    <span style={{ width: 44, height: 1, background: color, opacity: 0.4 }} />
    <span style={{ width: 7, height: 7, background: C.blue, transform: 'rotate(45deg)', flexShrink: 0 }} />
    <span style={{ width: 44, height: 1, background: color, opacity: 0.4 }} />
  </div>
)

// Small corner brackets on two opposite corners — same framed-print
// treatment ProjectLandingContent.tsx's CornerFrame gives its map
// embed, applied here for the first time. In blue, not gold.
const CornerFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {[
      { top: -10, left: -10, borderWidth: '3px 0 0 3px' },
      { bottom: -10, right: -10, borderWidth: '0 3px 3px 0' },
    ].map((pos, i) => (
      <span
        key={i}
        aria-hidden
        className="absolute hidden md:block"
        style={{ width: 36, height: 36, borderColor: C.blue, borderStyle: 'solid', ...pos }}
      />
    ))}
    {children}
  </div>
)

// A single oversized serif quote mark behind a pull-quote statement —
// same device ProjectLandingContent.tsx's GoldQuoteMark uses on
// Mission/Vision. Named the same for cross-file consistency even
// though the color is blue here, not gold — same substitution as
// everywhere else above.
const GoldQuoteMark = () => (
  <span
    aria-hidden
    className="block leading-none select-none"
    style={{ ...display, fontSize: '5rem', color: C.blue, opacity: 0.45, height: '2.2rem', marginBottom: '0.25rem' }}
  >
    &ldquo;
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
          className="rg-input w-full px-5 py-3 rounded-full text-sm outline-none"
          style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile number"
          className="rg-input w-full px-5 py-3 rounded-full text-sm outline-none"
          style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="rg-input w-full px-5 py-3 rounded-full text-sm outline-none"
          style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
        />
        <button
          type="submit"
          className="rg-btn mt-1 px-6 py-3 rounded-full text-sm font-semibold self-start"
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

  // FAQ accordion state — every other project page (ProjectLandingContent.tsx)
  // has a real clickable button here (only the open question's answer
  // shows, toggled by a +/− mark); this page's own FAQ was plain static
  // text with all 5 answers permanently visible and no button at all —
  // the actual UI-element gap a parity pass caught. First question
  // starts open so the section doesn't read as empty rows of
  // questions-only on first paint.
  const [openFaq, setOpenFaq] = useState<number | null>(0)

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
            style={{ ...mono, color: C.paper }}
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
            style={{ ...body, color: '#FFFFFF', fontWeight: 500 }}
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
          <KineticHeading
            delay={0.08}
            text="We don't sell plots. We help families plant something that outlives us."
            className="text-3xl md:text-5xl mb-8"
            style={{ ...display, color: C.ink, fontWeight: 500 }}
          />
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
      <section className="relative overflow-hidden px-6 md:px-16 py-20" style={{ background: darkGradient }}>
        <TreeAccent side="right" tone="navy" size={240} bottom={-20} opacity={0.14} />
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker color={C.mist}>Specifications</Kicker>
              <KineticHeading
                text="The Plot, In Numbers"
                className="text-2xl md:text-4xl"
                style={{ ...display, color: C.paper, fontWeight: 500 }}
              />
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
                  className="rg-stat-card h-full rounded-2xl bg-white p-6 text-center"
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
      <section className="relative overflow-hidden px-6 md:px-16 py-20" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="relative max-w-5xl mx-auto">
          {/* Ghost numeral is the real count of locations listed below —
              same restraint ProjectLandingContent.tsx's own Connectivity
              section uses. */}
          <GhostNumeral n={10} color={C.panel} />
          <Reveal className="mb-12">
            <Kicker>Connectivity</Kicker>
            <KineticHeading
              text="A Tambaram Address That Keeps You Close"
              className="text-2xl md:text-4xl"
              style={{ ...display, color: C.ink, fontWeight: 500 }}
            />
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
          </Reveal>
          <KineticHeading
            text="Build Your Future at Omshakthy Regalia"
            className="text-3xl md:text-5xl mb-6"
            style={{ ...display, color: C.ink, fontWeight: 500 }}
          />
          <Reveal delay={0.08}>
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
          <div className="text-center mb-16">
            <Reveal><Kicker center color={C.mist}>By The Numbers</Kicker></Reveal>
            <KineticHeading
              text="Thirty-plus years. Zero title disputes."
              className="text-2xl md:text-4xl"
              style={{ ...display, color: C.paper, fontWeight: 500 }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'map', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, unit: 'Acres', label: 'Successfully aggregated & developed' },
              { icon: 'building', to: 30, format: (n: number) => `${Math.round(n)}+`, unit: 'Projects', label: 'Landmark projects delivered' },
              { icon: 'layers', to: 2, format: (n: number) => `${Math.round(n)} Lakh+`, unit: 'Sq.Ft', label: 'Commercial space leased' },
              { icon: 'users', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, unit: 'Customers', label: 'Happy customers since 1991' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div
                  className="rg-stat-card h-full rounded-2xl bg-white p-6 text-center"
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
      <section className="relative overflow-hidden px-6 md:px-16 py-28 text-center" style={{ backgroundColor: C.paper, color: C.ink }}>
        <TreeAccent side="left" tone="natural" size={280} bottom={-30} opacity={0.14} />
        <TreeAccent side="right" tone="natural" size={280} bottom={-30} opacity={0.14} />
        <div className="relative max-w-3xl mx-auto">
          <Reveal>
            <Kicker center>Est. 1991 · Chennai</Kicker>
          </Reveal>
          <OrnamentDivider color={C.hairLight} />
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
      <section className="relative overflow-hidden px-6 md:px-16 py-28" style={{ background: darkGradient }}>
        <TreeAccent side="left" tone="navy" size={260} bottom={-20} opacity={0.16} />
        <div className="relative max-w-7xl mx-auto">
          {/* Ghost numeral is the real count of amenities listed below —
              same restraint ProjectLandingContent.tsx's own Amenities
              section uses. */}
          <GhostNumeral n={10} color={C.mist} />
          <div className="text-center mb-16">
            <Reveal><Kicker center color={C.mist}>Amenities</Kicker></Reveal>
            <KineticHeading
              text="Where Lifestyle Meets Coziness"
              className="text-2xl md:text-4xl"
              style={{ ...display, color: C.paper, fontWeight: 500 }}
            />
            {/* regalia-lp.html's own "A Gated Plot Community Designed
                for Everyday Comfort" copy, word for word — was entirely
                absent, only the structured badge list existed. */}
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl mx-auto" style={{ color: C.paperMuted }}>
                A welcoming grand entrance creates a strong first impression, while blacktop internal
                roads support smooth movement within the community. The gated setting and 24×7 CCTV
                surveillance offer an added sense of security, while landscaped open spaces, a
                children&rsquo;s play area and walking &amp; jogging tracks weave lifestyle into the
                layout itself.
              </p>
            </Reveal>
          </div>
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

      {/* ---------------- Featured Projects (panel) ----------------
          "Also Available" cross-sell strip every other project page
          (ProjectLandingContent.tsx, which this page itself inspired)
          now has — missing here until now. Pulls from the same real
          /projects array, excluding Regalia's own listing. panel (the
          light blue-tinted tone "Build Your Future" above already
          uses), not paper — Amenities right above this is already
          dark, and Mission/Vision right below is already paper/white,
          so panel keeps a visible step between the two without two
          same-toned sections sitting back to back. */}
      {(() => {
        const featured = projects.filter((p) => p.link && p.link !== '/regalia-lp').slice(0, 3)
        if (featured.length === 0) return null
        return (
          <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.panel, color: C.ink }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Reveal><Kicker center>Also Available</Kicker></Reveal>
                <KineticHeading
                  text="Other Projects Worth a Look"
                  className="text-2xl md:text-4xl"
                  style={{ ...display, color: C.ink, fontWeight: 500 }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((p, i) => (
                  <Reveal key={p.name} delay={i * 0.08}>
                    <Link
                      href={p.link!}
                      className="block rounded-2xl overflow-hidden bg-white h-full"
                      style={{ border: `1px solid ${C.border}`, boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)' }}
                    >
                      <div className="relative" style={{ aspectRatio: '4 / 3' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined} />
                      </div>
                      <div className="p-5">
                        <p style={{ ...mono, color: C.blue, fontSize: '0.68rem' }}>{p.type}</p>
                        <h3 className="mt-2 text-lg" style={{ ...display, color: C.ink, fontWeight: 500 }}>{p.name}</h3>
                        <p className="mt-1 text-sm" style={{ color: C.slate }}>{p.location}</p>
                        <p className="mt-3 text-sm font-semibold" style={{ color: C.ink }}>{p.price}</p>
                        <span className="mt-4 inline-block text-sm" style={{ color: C.blue }}>Know More →</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ---------------- Mission / Vision (white) ---------------- */}
      <section className="relative overflow-hidden px-6 md:px-16 py-28" style={{ backgroundColor: C.paper, color: C.ink }}>
        <TreeAccent side="left" tone="natural" size={230} bottom={-30} opacity={0.1} />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { t: 'Our Mission', p: 'To turn every rupee of trust into a real, title-clear asset that lasts for generations.' },
            { t: 'Our Vision', p: "To be South India's most trusted steward of land — where legacy is engineered, not imagined." },
          ].map((m, i) => (
            <Reveal key={m.t} delay={i * 0.1}>
              <Kicker>{m.t}</Kicker>
              <GoldQuoteMark />
              <p className="text-2xl md:text-3xl" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                {m.p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ (footer-blue gradient) ---------------- */}
      <section className="relative overflow-hidden px-6 md:px-16 py-28" style={{ background: darkGradient }}>
        <TreeAccent side="right" tone="navy" size={230} bottom={-30} opacity={0.14} />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><Kicker center color={C.mist}>Good to Know</Kicker></Reveal>
            <KineticHeading
              text="Frequently Asked Questions"
              className="text-2xl md:text-4xl"
              style={{ ...display, color: C.paper, fontWeight: 500 }}
            />
          </div>
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
            ].map((f, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={f.q} delay={i * 0.04}>
                  <div style={{ borderTop: `1px solid ${C.hairLight}` }}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 py-7 text-left"
                    >
                      <h3 className="text-lg md:text-xl" style={{ ...display, color: C.paper }}>{f.q}</h3>
                      <span
                        aria-hidden
                        className="flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{
                          width: 28, height: 28,
                          border: `1.5px solid ${C.blue}`,
                          color: C.blue,
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
                          transition={{ duration: 0.35, ease: easeLux }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p className="pb-7" style={{ color: C.paperMuted }}>{f.a}</p>
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

      {/* ---------------- Project Images (paper) ----------------
          regalia-lp.html's actual "Project Images & Videos" swiper —
          missed entirely on the first two passes because it's a list
          of <img> tags, which the plain-text extraction method used
          to read the rest of the page strips out along with every
          other tag. All 9 real site photos (snap.0123-0263.webp),
          not the 3 generic ones this had a moment ago. */}
      <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Reveal><Kicker>Project Images</Kicker></Reveal>
            <KineticHeading
              text="See Regalia for Yourself"
              className="text-2xl md:text-4xl"
              style={{ ...display, color: C.ink, fontWeight: 500 }}
            />
          </div>
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

      {/* ---------------- Testimonials (footer-blue gradient) ----------------
          "Know More... Directly from the Owners" — every other project
          page now has this, missing here until now. dark, not paper:
          Loans right above has no strong background of its own
          (FinancialPartnersSection sits on plain white), so this opens
          with a real color step before Related Blog Posts (paper) and
          Location Map (dark) continue the alternation below. */}
      <section className="px-6 md:px-16 py-28" style={{ background: darkGradient }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><Kicker center color={C.mist}>From Our Owners</Kicker></Reveal>
            <KineticHeading
              text="Know More, Directly From the Owners"
              className="text-2xl md:text-4xl"
              style={{ ...display, color: C.paper, fontWeight: 500 }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  className="h-full rounded-2xl p-6"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}
                >
                  <GoldQuoteMark />
                  <p style={{ color: C.paperMuted }}>{t.quote}</p>
                  <div className="flex items-center gap-3 mt-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.photo} alt={t.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <p style={{ ...display, color: C.paper, fontWeight: 500 }}>{t.name}</p>
                      <p className="text-xs" style={{ color: C.paperMuted }}>{t.detail}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Related Blog Posts (paper) ----------------
          "Our Blogs - Explore Property Development in Chennai!" —
          same gap as Testimonials above, same fix. */}
      {crossSellPosts.length > 0 && (
        <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.paper, color: C.ink }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Reveal><Kicker center>From the Blog</Kicker></Reveal>
              <KineticHeading
                text="Explore Property Development in Chennai"
                className="text-2xl md:text-4xl"
                style={{ ...display, color: C.ink, fontWeight: 500 }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {crossSellPosts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.08}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl overflow-hidden h-full bg-white"
                    style={{ border: `1px solid ${C.border}` }}
                  >
                    <div className="relative" style={{ aspectRatio: '16 / 10' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.heroImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <p style={{ ...mono, color: C.blue, fontSize: '0.68rem' }}>{post.category}</p>
                      <h3 className="mt-2 text-lg" style={{ ...display, color: C.ink, fontWeight: 500 }}>{post.title}</h3>
                      <span className="mt-4 inline-block text-sm" style={{ color: C.blue }}>Continue Reading →</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

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
          <Reveal delay={0.08} className="mb-6">
            {/* Corner-bracket frame — same framed-print treatment
                ProjectLandingContent.tsx's CornerFrame gives every
                other project page's map embed, missing here before. */}
            <CornerFrame>
              <div className="rounded-2xl overflow-hidden" style={{ height: 360 }}>
                <iframe
                  title="Omshakthy Regalia location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CornerFrame>
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
      <section className="relative overflow-hidden px-6 md:px-16 py-24" style={{ backgroundColor: C.paper, color: C.ink }}>
        <TreeAccent side="right" tone="natural" size={240} bottom={-20} opacity={0.14} />
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-start">
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
          <Kicker center color={C.mist}>Get in Touch</Kicker>
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
