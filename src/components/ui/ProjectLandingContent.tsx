'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from 'framer-motion'
import FinancialPartnersSection from './FinancialPartnersSection'
import SiteLinksSection from './SiteLinksSection'
import type { ProjectData } from '@/lib/projects'
import './ProjectLandingContent.css'

/* ProjectLandingContent — the same page RegaliaContent.tsx built by
   hand, made reusable once six more real project landing pages needed
   the identical structure. Every project's content here comes from its
   own real page on the old mirror site (www.omshakthy.com/<slug>-lp.html
   — see src/data/projects/, extracted the same way src/data/blog/ was),
   not from Regalia's copy re-typed with a new name. Two sections only
   render when the source project actually has the matching real
   content: the narrative block (some projects only got 1 H2 section on
   the old site, not Regalia's 4) and FAQ (only kanopus-mithila,
   elite-orchard and mathura had a real FAQ accordion on their own
   pages — kanopus-magha, elite-grand and industrial-park don't, so
   they don't get an invented one here either). No per-project photo
   gallery either, for the same reason: unlike Regalia, none of these
   six had their own images/<project>/gallery/ folder in the mirror. */

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
  paperMuted: 'rgba(251, 248, 242, 0.66)',
  inkMuted: 'rgba(11, 31, 58, 0.68)',
  hairLight: 'rgba(13, 107, 178, 0.35)',
  // A single warm accent, used sparingly (kicker rules, ornament
  // glyphs, a hover edge on cards) — a navy+gold pairing reads as
  // "premium township" the same way it does on the real gate signage
  // several of these projects now use (Elite Grand's own real render
  // uses this same maroon+gold palette). Never a background, never
  // body text — an accent line/glyph only, so it stays a flourish
  // rather than competing with the site's actual blue identity.
  gold: '#C9A227',
  goldSoft: 'rgba(201, 162, 39, 0.35)',
}
const darkGradient = 'linear-gradient(180deg, #004385 0%, #0D6BB2 100%)'
const WHATSAPP_NUMBER = '919150088097'
// Real tree cutout, used as a soft corner/ divider accent rather than a
// literal photo of anything project-specific — same restraint as the
// site's icon set: decoration, not a claim about what's actually on
// site.
const TREE = '/decor/tree-accent.webp'

const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '1.0rem', fontWeight: 700 }
const easeLux = [0.16, 1, 0.3, 1] as const

// Same "focus pull" reveal AboutContent.tsx uses — was a plain fade+
// rise here; now blur(6px)->0 and scale(0.96)->1 ride alongside the
// same opacity/y, so content settles into focus as it scrolls in
// rather than just fading up. Brought over deliberately: this page
// had its own simpler Reveal while About had the richer one, and
// there was no real reason for the two to differ.
const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, delay, ease: easeLux }}
    >
      {children}
    </motion.div>
  )
}

// Same word-by-word rise AboutContent.tsx's KineticHeading uses — each
// word sits in its own overflow-hidden mask and slides up into place
// with its own stagger, so the copy itself is what's moving rather
// than a box fading in around it. Used for this page's main section
// headings (the ones that used to be a plain <h2> inside Reveal).
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
        // Gap between words is a margin on the wrapper, not a literal
        // space character inside the animated text — a trailing space
        // baked into an inline-block's content gets trimmed at the box
        // edge by normal whitespace collapsing, which was silently
        // running every heading's words together ("LocationsNearby").
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
// same device AboutContent.tsx's "Where We Build" marquee uses for its
// ghost "09". Real counts only (amenity count, connectivity count),
// never a made-up decoration.
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

// Same curtain-wipe photo entrance as AboutContent.tsx's ImageReveal —
// a solid panel slides away right-to-left while the photo itself
// settles from a slight zoom+blur into focus. Boxed/rounded usage
// (unlike the Hero's own full-bleed inline version of this device).
const ImageReveal = ({
  src,
  alt = '',
  imgClassName,
  imgStyle,
  delay = 0,
  panelColor = C.gold,
}: {
  src: string
  alt?: string
  imgClassName?: string
  imgStyle?: React.CSSProperties
  delay?: number
  panelColor?: string
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return (
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={imgClassName} style={imgStyle} />
      </div>
    )
  }
  return (
    <div className="relative">
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        style={imgStyle}
        initial={{ scale: 1.18, filter: 'blur(6px)' }}
        whileInView={{ scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.3, delay: delay + 0.15, ease: easeLux }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: panelColor, transformOrigin: 'right center' }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.85, delay, ease: easeLux }}
      />
    </div>
  )
}

const Kicker = ({ children, color = C.blue, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) => (
  <span className={`mb-4 ${center ? 'flex flex-col items-center' : 'block'}`}>
    <span style={{ ...mono, color }}>{children}</span>
    {/* Small gold rule under every kicker — the one place this page's
        accent color shows up consistently, so it reads as a deliberate
        motif rather than decoration in only one spot. */}
    <span
      className="block mt-2 rounded-full"
      style={{ width: 34, height: 2.5, background: C.gold }}
    />
  </span>
)

// Soft, low-opacity foliage anchored to a corner — real tree cutout,
// never full-strength (never mistaken for site photography), just
// enough presence to keep a section from reading as flat color.
// `side` mirrors it left/right, `tone` swaps between the warm original
// greens (light backgrounds) and a duotone-navy recolor (dark-gradient
// sections, where full green would fight the blue).
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

// A thin rule + diamond glyph, used between a section's kicker/heading
// block and its body content on the more "heritage" sections (Since
// 1991, Mission/Vision) — a small classical flourish rather than the
// plain gap every other section uses.
const OrnamentDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-6" aria-hidden>
    <span style={{ width: 44, height: 1, background: color, opacity: 0.4 }} />
    <span style={{ width: 7, height: 7, background: C.gold, transform: 'rotate(45deg)', flexShrink: 0 }} />
    <span style={{ width: 44, height: 1, background: color, opacity: 0.4 }} />
  </div>
)

// Small gold corner brackets on two opposite corners — a framed-print
// treatment for the one piece of embedded, non-decorative media on the
// page (the map), so it reads as a deliberately presented plate rather
// than a plain iframe with rounded corners.
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
        style={{ width: 36, height: 36, borderColor: C.gold, borderStyle: 'solid', ...pos }}
      />
    ))}
    {children}
  </div>
)

// A single oversized serif quote mark, laid behind a statement rather
// than beside it — the classic "editorial pull-quote" device, in gold
// so it reads as ornament rather than a second layer of text.
const GoldQuoteMark = () => (
  <span
    aria-hidden
    className="block leading-none select-none"
    style={{ ...display, fontSize: '5rem', color: C.gold, opacity: 0.45, height: '2.2rem', marginBottom: '0.25rem' }}
  >
    &ldquo;
  </span>
)

const CountUp = ({ to, format = (n: number) => Math.round(n).toLocaleString('en-IN') }: { to: number; format?: (n: number) => string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

// Same icon set RegaliaContent.tsx/AboutContent.tsx already use — spec
// cards cycle through the first six by position, amenities badges
// match on keywords so a real, project-specific label ("Blacktop
// Roads", "24x7 CCTV Surveillance"...) still gets a fitting icon
// instead of one repeated glyph.
const ICONS: Record<string, string> = {
  building: 'M5 21V7l7-4 7 4v14Z M9 21v-6h6v6 M9 11h.01 M15 11h.01 M9 15h.01 M15 15h.01',
  coin: 'M12 3v2.5 M12 18.5V21 M8 7.5c0-1.7 1.7-2.8 4-2.8s4 1.1 4 2.8-1.7 2.3-4 2.3-4 .6-4 2.3 1.7 2.9 4 2.9 4-1.1 4-2.9',
  layers: 'm12 3 9 4.8-9 4.8-9-4.8L12 3Z M3 13l9 4.8 9-4.8 M3 17.4l9 4.8 9-4.8',
  pin: 'M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z M12 12a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  map: 'M9 4 3 6v15l6-2 6 2 6-2V4l-6 2-6-2Z M9 4v15 M15 6v15',
  calendar: 'M4 6h16v15H4Z M4 11h16 M8 3v5 M16 3v5',
  users: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M2 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5 M18 8a3 3 0 1 0 0-6 M17 12c2.5 0 5 2 5 5.5',
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
  shield: 'M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z M9 12l2 2 4-4',
  factory: 'M3 21V10l6 3V10l6 3V6h6v15H3Z M7 16h2 M12 16h2 M17 16h2',
  money: 'M3 7h18v10H3Z M3 7 12 3l9 4 M12 10v4 M9 12h.01 M15 12h.01',
  wifi: 'M2 8.5a16 16 0 0 1 20 0 M5.5 12a11 11 0 0 1 13 0 M9 15.5a6 6 0 0 1 6 0 M12 19h.01',
  bank: 'M4 21h16 M5 21V10l7-5 7 5v11 M9 21v-8h6v8',
}
const ICON_KEYWORDS: [string, string][] = [
  ['grand entrance', 'gate'], ['entrance', 'gate'], ['archway', 'gate'],
  ['road', 'road'], ['blacktop', 'road'],
  ['vastu', 'compass'], ['accessib', 'compass'], ['connect', 'compass'],
  ['gated', 'lock'], ['secur', 'lock'], ['cctv', 'camera'], ['surveillance', 'camera'],
  ['rainwater', 'droplet'], ['water', 'droplet'], ['drainage', 'droplet'],
  ['solar', 'lamp'], ['light', 'lamp'], ['street', 'lamp'],
  ['play', 'play'], ['park', 'play'], ['kid', 'play'], ["children", 'play'],
  ['jogging', 'footprints'], ['walking', 'footprints'], ['track', 'footprints'],
  ['court', 'court'], ['sport', 'court'], ['gym', 'court'], ['fitness', 'court'],
  ['bank', 'bank'], ['financ', 'bank'], ['loan', 'bank'], ['roi', 'money'], ['rental', 'money'], ['price', 'coin'],
  ['industr', 'factory'], ['business', 'factory'],
  ['wifi', 'wifi'], ['network', 'wifi'],
  ['clear title', 'shield'], ['approved', 'shield'], ['compound', 'shield'], ['fenc', 'shield'],
  ['plant', 'droplet'], ['landscap', 'play'],
]
const SPEC_ICONS = ['building', 'coin', 'layers', 'pin', 'map', 'calendar']
const iconFor = (label: string) => {
  const low = label.toLowerCase()
  for (const [kw, icon] of ICON_KEYWORDS) if (low.includes(kw)) return icon
  return 'shield'
}
const StatIcon = ({ name, size = 30, color = C.blue }: { name: string; size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[name] ?? ICONS.shield} />
  </svg>
)

// Connectivity items are either "Name : N Mins" (Regalia/kanopus-magha
// style) or a plain phrase with no separate time (elite-orchard style)
// — both real, just written differently on their own source pages.
const splitConnectivity = (item: string): { name: string; time: string | null } => {
  const parts = item.split(':')
  if (parts.length >= 2) {
    return { name: parts.slice(0, -1).join(':').trim(), time: parts[parts.length - 1].trim() }
  }
  return { name: item, time: null }
}

const SiteVisitForm = ({ projectName }: { projectName: string }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = [
      `Hi, I'm ${name || 'a visitor from omshakthy.net'}. I'd like to book a free site visit to ${projectName}.`,
      phone ? `My number: ${phone}.` : '',
      email ? `Email: ${email}.` : '',
    ].filter(Boolean).join(' ')
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="rounded-2xl p-8" style={{ backgroundColor: C.panel }}>
      <h3 className="text-lg font-bold mb-1" style={{ ...display, color: C.ink }}>Book a Free Site Visit</h3>
      <p className="text-sm mb-6" style={{ color: C.slate }}>Furnish your details below to book a free site visit</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required
          className="pl-input px-4 py-3 rounded-lg text-sm" style={{ ...body, backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" type="tel"
          className="pl-input px-4 py-3 rounded-lg text-sm" style={{ ...body, backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
          className="pl-input px-4 py-3 rounded-lg text-sm" style={{ ...body, backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }} />
        <button type="submit" className="pl-gold-btn mt-2 px-6 py-3 rounded-full text-sm font-semibold" style={{ ...body, backgroundColor: C.blue, color: '#fff' }}>
          Book a Free Site Visit
        </button>
      </form>
    </div>
  )
}

// Walks the list of sections this project actually has and assigns a
// strict two-tone alternation — white (paper) first, then the dark
// navy gradient, back to white, and so on — so which sections exist
// (narrative, FAQ, map) varies per project but the white/blue/white
// rhythm itself never breaks. 'panel' stays a valid bg for any section
// that opts out of the alternation explicitly, but the walk itself
// no longer assigns it.
function assignBackgrounds<T extends { id: string }>(sections: T[]): (T & { bg: 'paper' | 'panel' | 'dark' })[] {
  return sections.map((s, i) => ({ ...s, bg: i % 2 === 0 ? 'paper' : 'dark' }))
}
const bgStyle = (bg: 'paper' | 'panel' | 'dark') =>
  bg === 'dark' ? { background: darkGradient } : { backgroundColor: bg === 'paper' ? C.paper : C.panel, color: C.ink }

export default function ProjectLandingContent({ data }: { data: ProjectData }) {
  const address = `${data.name}, Chennai`
  const hasNarrative = data.narrativeSections.length > 0
  const hasFaq = data.faq.length > 0
  // Real accordion now (was every answer sitting open at once) — first
  // question starts expanded so the section doesn't read as empty rows
  // of questions-only on first paint.
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Hero video parallax — the same scroll-tied scale/drift
  // RegaliaContent.tsx's own cinematic hero uses.
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroVideoScale = useTransform(heroProgress, [0, 1], [1, 1.18])
  const heroVideoY = useTransform(heroProgress, [0, 1], ['0%', '14%'])

  const sectionIds = [
    'specs', 'connectivity',
    ...(hasNarrative ? ['narrative'] : []),
    'keyfigures', 'since1991', 'amenities', 'mission',
    ...(hasFaq ? ['faq'] : []),
    'map', 'visit',
  ]
  const bgs = Object.fromEntries(assignBackgrounds(sectionIds.map((id) => ({ id }))).map((s) => [s.id, s.bg]))

  return (
    <div style={{ backgroundColor: C.paper }}>
      {/* ---------------- Hero ----------------
          Bigger, more theatrical than a plain "photo + heading": a
          gold rule + serif kicker line ahead of the name and a much
          larger display size. No TreeAccent cutouts here (unlike every
          section below) — the video backdrop already carries its own
          real depth and motion, so the corner foliage just competed
          with it instead of framing it the way it does over a static
          section background. The backdrop itself is the same cinematic
          video treatment RegaliaContent.tsx's own hero uses —
          autoplaying, muted, freezing on its final frame rather than
          looping, with a live scroll-tied scale/drift as the visitor
          scrolls past it. */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-end overflow-hidden px-6 md:px-16 pb-20 pt-32" style={{ backgroundColor: C.ink }}>
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: heroVideoScale, y: heroVideoY }}
          src="/project-hero-video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={(e) => {
            // freeze on the final frame instead of looping, same as
            // Regalia's own hero
            const v = e.currentTarget
            v.pause()
            if (v.duration) v.currentTime = v.duration
          }}
        />
        {/* Curtain-wipe entrance — same device AboutContent.tsx's
            ImageReveal uses (a solid panel wipes away right-to-left)
            — in gold rather than ink since ink is already the
            section's own background and wouldn't read as a distinct
            reveal against itself. Runs once, on load, over the video
            that's already begun playing underneath — this is the very
            first thing a visitor sees on the page. */}
        <motion.div
          className="absolute inset-0"
          style={{ background: C.gold, transformOrigin: 'right center' }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.9, ease: easeLux }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,31,58,0.05) 0%, rgba(11,31,58,0.28) 55%, rgba(11,31,58,0.65) 100%)' }} />
        {/* Vignette + a faint gold glow low in the frame — depth behind
            the title without a second hard-edged rectangle. */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 70% at 50% 100%, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0) 60%)' }} />
        <div className="relative max-w-6xl mx-auto w-full">
          <Reveal>
            {data.type && <Kicker color={C.mist}>{data.type}</Kicker>}
          </Reveal>
          {/* KineticHeading animates its own words — not wrapped in
              Reveal, which would double-animate the same text as a
              whole block on top of each word's own rise. */}
          <KineticHeading
            text={data.name}
            className="text-5xl md:text-8xl mb-7"
            style={{ ...display, color: '#fff', fontWeight: 500, textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
          />
          <Reveal delay={0.1} className="flex flex-wrap items-center gap-4">
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hi, I'm interested in ${data.name}. Could you share more details?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold"
              style={{ ...body, backgroundColor: '#fff', color: C.blueDeep }}
            >
              Enquire on WhatsApp
            </a>
            {/* Thin gold-bordered ghost button — the one place a second,
                lighter-weight CTA style earns its keep, echoing the gold
                kicker rule rather than repeating the solid white pill. */}
            <a
              href="#visit"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold"
              style={{ ...body, color: '#fff', border: `1px solid ${C.goldSoft}` }}
            >
              Book a Site Visit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Specifications ---------------- */}
      {data.specs.length > 0 && (
        <section className="relative overflow-hidden px-6 md:px-16 py-20" style={bgStyle(bgs.specs)}>
          <TreeAccent side="right" tone={bgs.specs === 'dark' ? 'navy' : 'natural'} size={240} bottom={-20} opacity={bgs.specs === 'dark' ? 0.14 : 0.1} />
          <div className="relative max-w-6xl mx-auto">
            <div className="mb-12">
              <Reveal><Kicker color={bgs.specs === 'dark' ? C.mist : C.blue}>Specifications</Kicker></Reveal>
              <KineticHeading
                text="The Plot, In Numbers"
                className="text-2xl md:text-4xl"
                style={{ ...display, color: bgs.specs === 'dark' ? C.paper : C.ink, fontWeight: 500 }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.specs.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.05}>
                  <div className="pl-stat-card h-full rounded-2xl bg-white p-6 text-center" style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}>
                    <div className="flex justify-center"><StatIcon name={SPEC_ICONS[i % SPEC_ICONS.length]} /></div>
                    <p className="mt-4 text-lg md:text-xl font-bold" style={{ ...display, color: C.ink }}>{s.value}</p>
                    <p className="mt-1 text-sm" style={{ color: C.slate }}>{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Connectivity ---------------- */}
      {data.connectivity.length > 0 && (
        <section className="relative overflow-hidden px-6 md:px-16 py-20" style={bgStyle(bgs.connectivity)}>
          {/* Lamp-post photo anchored to the left edge, fading out into
              the section's own background toward the right rather than
              a hard-edged rectangle — the same "a real place, not a
              stock backdrop" read the gate photos give the rest of the
              site, here standing in for the streets/city this section's
              list of nearby locations is actually about. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decor/lamp-post.webp"
            alt=""
            aria-hidden
            className="absolute inset-y-0 left-0 w-[45%] md:w-[34%] h-full object-cover hidden sm:block"
            style={{
              opacity: bgs.connectivity === 'dark' ? 0.4 : 0.22,
              WebkitMaskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 92%)',
              maskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 92%)',
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Ghost numeral is the real count of locations listed below —
                same "decoration that's actually true" restraint as
                AboutContent.tsx's "09" corridors. */}
            <GhostNumeral n={data.connectivity.length} color={bgs.connectivity === 'dark' ? C.goldSoft : C.panel} />
            <div className="mb-12">
              <Reveal><Kicker color={bgs.connectivity === 'dark' ? C.mist : C.blue}>Connectivity</Kicker></Reveal>
              <KineticHeading
                text="Locations Nearby"
                className="text-2xl md:text-4xl"
                style={{ ...display, color: bgs.connectivity === 'dark' ? C.paper : C.ink, fontWeight: 500 }}
              />
              {data.connectivityIntro && (
                <Reveal delay={0.1}>
                  <p className="mt-4 max-w-2xl" style={{ color: bgs.connectivity === 'dark' ? '#fff' : C.slate, fontWeight: 500 }}>
                    {data.connectivityIntro}
                  </p>
                </Reveal>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {data.connectivity.map((item, i) => {
                const { name, time } = splitConnectivity(item)
                return (
                  <Reveal key={item} delay={i * 0.03}>
                    <div className="flex items-baseline justify-between py-3" style={{ borderBottom: `1px solid ${C.hairLight}` }}>
                      <span className="flex items-baseline gap-3">
                        <span aria-hidden style={{ width: 5, height: 5, background: C.gold, transform: 'rotate(45deg)', flexShrink: 0 }} />
                        {/* C.paperMuted is only 66% opacity — read as
                            dim against this section's own dark navy
                            background. Full paper white instead. */}
                        <span style={{ color: bgs.connectivity === 'dark' ? '#fff' : C.inkMuted, fontWeight: 600 }}>{name}</span>
                      </span>
                      {/* Was hardcoded to C.blue — invisible on this
                          section's own dark navy background since the
                          two colors are nearly identical. Switches to
                          gold there instead, matching the bullet dot
                          beside each location name. */}
                      {time && <span style={{ ...mono, color: bgs.connectivity === 'dark' ? C.gold : C.blue, fontSize: '0.9rem', flexShrink: 0, marginLeft: '1rem' }}>{time}</span>}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Narrative — only if this project's real page had one ---------------- */}
      {hasNarrative && (
        <section className="px-6 md:px-16 py-24" style={bgStyle(bgs.narrative)}>
          <div className="max-w-4xl mx-auto">
            {data.tagline && (
              <Reveal>
                <Kicker color={bgs.narrative === 'dark' ? C.mist : C.blue}>Nature Dream Influence</Kicker>
                <p className="text-xl md:text-2xl mb-6" style={{ ...display, color: bgs.narrative === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
                  {data.tagline}
                </p>
              </Reveal>
            )}
            {data.narrativeIntro.map((p) => (
              <p key={p.slice(0, 24)} className="mt-3" style={{ color: bgs.narrative === 'dark' ? C.paperMuted : C.inkMuted }}>{p}</p>
            ))}
            {data.narrativeSections.map((block, i) => (
              <Reveal key={block.heading} delay={0.06 + i * 0.05} className="mt-10">
                <h3 className="text-xl md:text-2xl mb-3" style={{ ...display, color: bgs.narrative === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
                  {block.heading}
                </h3>
                {block.paragraphs.map((para) => (
                  <p key={para.slice(0, 24)} className="mt-3" style={{ color: bgs.narrative === 'dark' ? C.paperMuted : C.inkMuted }}>{para}</p>
                ))}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- Key figures — same company-wide real facts Regalia's page uses ---------------- */}
      <section className="px-6 md:px-16 py-24" style={bgStyle(bgs.keyfigures)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><Kicker center color={bgs.keyfigures === 'dark' ? C.mist : C.blue}>By The Numbers</Kicker></Reveal>
            <KineticHeading
              text="Thirty-plus years. Zero title disputes."
              className="text-2xl md:text-4xl"
              style={{ ...display, color: bgs.keyfigures === 'dark' ? C.paper : C.ink, fontWeight: 500 }}
            />
          </div>
          <CornerFrame>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: 'map', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, label: 'Acres successfully aggregated & developed' },
                { icon: 'building', to: 30, format: (n: number) => `${Math.round(n)}+`, label: 'Landmark projects delivered' },
                { icon: 'layers', to: 2, format: (n: number) => `${Math.round(n)} Lakh+`, label: 'Sq.Ft commercial space leased' },
                { icon: 'users', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, label: 'Happy customers since 1991' },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div className="pl-stat-card h-full rounded-2xl bg-white p-6 text-center" style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}>
                    <div className="flex justify-center"><StatIcon name={s.icon} /></div>
                    <div className="mt-4 text-3xl md:text-4xl font-bold" style={{ ...display, color: C.ink }}><CountUp to={s.to} format={s.format} /></div>
                    <p className="mt-2 text-sm" style={{ color: C.slate }}>{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </CornerFrame>
        </div>
      </section>

      {/* ---------------- Since 1991 ----------------
          The one section that's explicitly about heritage/legacy, so
          it's the one that earns the ornament divider and flanking
          trees rather than the plain kicker+statement every other
          section uses — restraint elsewhere is what makes this feel
          special here instead of everywhere. */}
      <section className="relative overflow-hidden px-6 md:px-16 py-32 text-center" style={bgStyle(bgs.since1991)}>
        <TreeAccent side="left" tone={bgs.since1991 === 'dark' ? 'navy' : 'natural'} size={280} bottom={-30} opacity={bgs.since1991 === 'dark' ? 0.18 : 0.14} />
        <TreeAccent side="right" tone={bgs.since1991 === 'dark' ? 'navy' : 'natural'} size={280} bottom={-30} opacity={bgs.since1991 === 'dark' ? 0.18 : 0.14} />
        <div className="relative max-w-3xl mx-auto">
          <Reveal><Kicker center color={bgs.since1991 === 'dark' ? C.mist : C.blue}>Est. 1991 · Chennai</Kicker></Reveal>
          <OrnamentDivider color={bgs.since1991 === 'dark' ? C.paperMuted : C.hairLight} />
          <Reveal delay={0.1}>
            <p className="text-2xl md:text-4xl" style={{ ...display, color: bgs.since1991 === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
              Incorporated in 1991 to consolidate land for the future — industries, Special Economic
              Zones and residential spaces around the prime corridors of the city.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Signature photo ----------------
          Same full-bleed "brand moment" AboutContent.tsx closes its
          own heritage block with: the project's own hero photo again,
          darkened, with the OmShakthy mark held centered over it — a
          deliberate pause between the legacy statement above and the
          amenities detail below, rather than another kicker+heading
          panel. Reuses data.heroImage rather than a new asset. */}
      <section className="relative px-4 md:px-6 pb-10" style={{ backgroundColor: bgs.since1991 === 'dark' ? C.blueDeep : C.paper }}>
        <div className="max-w-[1180px] mx-auto rounded-[28px] overflow-hidden relative" style={{ boxShadow: '0 24px 60px -20px rgba(11,31,58,0.25)' }}>
          <ImageReveal
            src={data.heroImage}
            alt={data.name}
            imgClassName="w-full h-[320px] md:h-[420px] object-cover"
            imgStyle={{ filter: 'brightness(0.55)' }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.55, ease: easeLux }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/omshakthy-logo.webp" alt="OmShakthy Homes" className="w-20 h-20 md:w-28 md:h-28 object-contain" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }} />
            <span className="tracking-[0.3em] text-sm md:text-base font-semibold uppercase" style={{ color: '#fff' }}>
              OmShakthy Homes
            </span>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Amenities ---------------- */}
      {data.amenities.length > 0 && (
        <section className="relative overflow-hidden px-6 md:px-16 py-28" style={bgStyle(bgs.amenities)}>
          {/* A real playground, not a stock lifestyle render — grounds
              "Where Lifestyle Meets Coziness" in an actual place rather
              than the icon grid alone. Sits along the floor of the
              section, fading up into the background rather than a hard
              rectangle, so the icons above stay perfectly legible. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decor/playground.webp"
            alt=""
            aria-hidden
            className="absolute inset-x-0 bottom-0 w-full h-[220px] md:h-[300px] object-cover hidden sm:block"
            style={{
              opacity: bgs.amenities === 'dark' ? 0.22 : 0.28,
              WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 95%)',
              maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 95%)',
            }}
          />
          <TreeAccent side="left" tone={bgs.amenities === 'dark' ? 'navy' : 'natural'} size={260} bottom={-20} opacity={bgs.amenities === 'dark' ? 0.16 : 0.12} />
          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Real count of the amenities listed below, same restraint
                as the Connectivity ghost numeral above. */}
            <GhostNumeral n={data.amenities.length} color={bgs.amenities === 'dark' ? C.goldSoft : C.panel} />
            <div className="text-center mb-16">
              <Reveal><Kicker center color={bgs.amenities === 'dark' ? C.mist : C.blue}>Amenities</Kicker></Reveal>
              <KineticHeading
                text="Where Lifestyle Meets Coziness"
                className="text-2xl md:text-4xl"
                style={{ ...display, color: bgs.amenities === 'dark' ? C.paper : C.ink, fontWeight: 500 }}
              />
              {data.amenitiesIntro && (
                <Reveal delay={0.1}>
                  <p className="mt-4 max-w-2xl mx-auto" style={{ color: bgs.amenities === 'dark' ? C.paperMuted : C.slate }}>
                    {data.amenitiesIntro}
                  </p>
                </Reveal>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
              {data.amenities.map((label, i) => (
                <Reveal key={label} delay={i * 0.05} className="text-center">
                  <motion.div
                    className="pl-amenity-ring w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-white"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.3, ease: easeLux }}
                  >
                    <StatIcon name={iconFor(label)} size={26} />
                  </motion.div>
                  <p style={{ ...mono, color: bgs.amenities === 'dark' ? C.paper : C.ink, fontSize: '0.71rem' }}>{label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Mission / Vision ---------------- */}
      <section className="relative overflow-hidden px-6 md:px-16 py-28" style={bgStyle(bgs.mission)}>
        <TreeAccent side="left" tone={bgs.mission === 'dark' ? 'navy' : 'natural'} size={230} bottom={-30} opacity={bgs.mission === 'dark' ? 0.14 : 0.1} />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { t: 'Our Mission', p: 'To turn every rupee of trust into a real, title-clear asset that lasts for generations.' },
            { t: 'Our Vision', p: "To be South India's most trusted steward of land — where legacy is engineered, not imagined." },
          ].map((m, i) => (
            <Reveal key={m.t} delay={i * 0.1}>
              <Kicker color={bgs.mission === 'dark' ? C.mist : C.blue}>{m.t}</Kicker>
              <GoldQuoteMark />
              <p className="text-2xl md:text-3xl" style={{ ...display, color: bgs.mission === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>{m.p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ — only if this project's real page had one ---------------- */}
      {hasFaq && (
        <section className="relative overflow-hidden px-6 md:px-16 py-28" style={bgStyle(bgs.faq)}>
          <TreeAccent side="right" tone={bgs.faq === 'dark' ? 'navy' : 'natural'} size={230} bottom={-30} opacity={bgs.faq === 'dark' ? 0.14 : 0.1} />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Reveal><Kicker center color={bgs.faq === 'dark' ? C.mist : C.blue}>Good to Know</Kicker></Reveal>
              <KineticHeading
                text="Frequently Asked Questions"
                className="text-2xl md:text-4xl"
                style={{ ...display, color: bgs.faq === 'dark' ? C.paper : C.ink, fontWeight: 500 }}
              />
            </div>
            <div>
              {/* Real accordion — only the open question shows its
                  answer, toggled by the gold +/− mark rather than every
                  answer sitting permanently expanded. */}
              {data.faq.map((f, i) => {
                const isOpen = openFaq === i
                return (
                  <Reveal key={f.q} delay={i * 0.04}>
                    <div style={{ borderTop: `1px solid ${C.hairLight}` }}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 py-7 text-left"
                      >
                        <h3 className="text-lg md:text-xl" style={{ ...display, color: bgs.faq === 'dark' ? C.paper : C.ink }}>{f.q}</h3>
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
                            transition={{ duration: 0.35, ease: easeLux }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="pb-7" style={{ color: bgs.faq === 'dark' ? C.paperMuted : C.slate }}>{f.a}</p>
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
      )}

      {/* ---------------- Banks Offering Loans ---------------- */}
      <FinancialPartnersSection />

      {/* ---------------- Location Map ---------------- */}
      <section className="px-6 md:px-16 py-24" style={bgStyle(bgs.map)}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-10">
            <Kicker color={bgs.map === 'dark' ? C.mist : C.blue}>Location Map</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: bgs.map === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
              Find Us on the Map
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mb-6">
            <CornerFrame>
              <div className="rounded-2xl overflow-hidden" style={{ height: 360 }}>
                <iframe
                  title={`${data.name} location`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CornerFrame>
          </Reveal>
          <Reveal delay={0.16}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-full text-sm"
              style={{ ...body, border: `1px solid ${C.hairLight}`, color: bgs.map === 'dark' ? C.paper : C.ink }}
            >
              Get Directions
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Book a Free Site Visit ----------------
          Bookends the hero's flanking trees at the other end of the
          page, at low opacity so it stays a closing flourish rather
          than competing with the form. */}
      <section id="visit" className="relative overflow-hidden px-6 md:px-16 py-24" style={bgStyle(bgs.visit)}>
        <TreeAccent side="right" tone={bgs.visit === 'dark' ? 'navy' : 'natural'} size={240} bottom={-20} opacity={bgs.visit === 'dark' ? 0.14 : 0.1} />
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-start">
          <Reveal>
            <Kicker color={bgs.visit === 'dark' ? C.mist : C.blue}>Take the First Step</Kicker>
            <h2 className="text-2xl md:text-4xl mb-6" style={{ ...display, color: bgs.visit === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
              Book a Free Site Visit
            </h2>
            <p style={{ color: bgs.visit === 'dark' ? C.paperMuted : C.inkMuted }}>
              Visit {data.name} and experience the location, layout and community features
              firsthand — furnish your details below to book a free site visit.
            </p>
            <div className="mt-8">
              <Kicker color={bgs.visit === 'dark' ? C.mist : C.blue}>Quick Contact</Kicker>
              <p style={{ color: bgs.visit === 'dark' ? C.paperMuted : C.inkMuted }}>
                <a href="tel:04440303040" className="hover:opacity-70" style={{ color: bgs.visit === 'dark' ? '#fff' : C.blue }}>Ph: +91 44 40303040</a>
                <br />
                <a href="mailto:marketing@omshakthy.net" className="hover:opacity-70" style={{ color: bgs.visit === 'dark' ? '#fff' : C.blue }}>E-Mail: marketing@omshakthy.net</a>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SiteVisitForm projectName={data.name} />
          </Reveal>
        </div>
      </section>

      <SiteLinksSection backgroundColor={C.paper} />
    </div>
  )
}
