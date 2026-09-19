'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import FinancialPartnersSection from './FinancialPartnersSection'
import SiteLinksSection from './SiteLinksSection'
import type { ProjectData } from '@/lib/projects'

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
}
const darkGradient = 'linear-gradient(180deg, #004385 0%, #0D6BB2 100%)'
const WHATSAPP_NUMBER = '919150088097'

const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '1.0rem', fontWeight: 700 }
const easeLux = [0.16, 1, 0.3, 1] as const

const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: easeLux } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12%' }}
    >
      {children}
    </motion.div>
  )
}

const Kicker = ({ children, color = C.blue }: { children: React.ReactNode; color?: string }) => (
  <span className="block mb-4" style={{ ...mono, color }}>{children}</span>
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
          className="px-4 py-3 rounded-lg text-sm" style={{ ...body, backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" type="tel"
          className="px-4 py-3 rounded-lg text-sm" style={{ ...body, backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
          className="px-4 py-3 rounded-lg text-sm" style={{ ...body, backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }} />
        <button type="submit" className="mt-2 px-6 py-3 rounded-full text-sm font-semibold" style={{ ...body, backgroundColor: C.blue, color: '#fff' }}>
          Book a Free Site Visit
        </button>
      </form>
    </div>
  )
}

// Walks the list of sections this project actually has and assigns a
// background to each so no two adjacent sections repeat — needed
// because which sections exist (narrative, FAQ, map) varies per
// project, so a hardcoded alternating sequence can't be trusted.
function assignBackgrounds<T extends { id: string }>(sections: T[]): (T & { bg: 'paper' | 'panel' | 'dark' })[] {
  const order: Array<'paper' | 'panel' | 'dark'> = ['dark', 'paper', 'panel']
  let cursor = 0
  let prev: string | null = null
  return sections.map((s) => {
    let bg = order[cursor % order.length]
    if (bg === prev) {
      cursor += 1
      bg = order[cursor % order.length]
    }
    cursor += 1
    prev = bg
    return { ...s, bg }
  })
}
const bgStyle = (bg: 'paper' | 'panel' | 'dark') =>
  bg === 'dark' ? { background: darkGradient } : { backgroundColor: bg === 'paper' ? C.paper : C.panel, color: C.ink }

export default function ProjectLandingContent({ data }: { data: ProjectData }) {
  const address = `${data.name}, Chennai`
  const hasNarrative = data.narrativeSections.length > 0
  const hasFaq = data.faq.length > 0

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
      {/* ---------------- Hero ---------------- */}
      <section className="relative min-h-[80vh] flex items-end px-6 md:px-16 pb-16 pt-32" style={{ backgroundColor: C.ink }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,31,58,0.1) 0%, rgba(11,31,58,0.85) 100%)' }} />
        <div className="relative max-w-6xl mx-auto w-full">
          <Reveal>
            {data.type && <Kicker color={C.mist}>{data.type}</Kicker>}
            <h1 className="text-4xl md:text-6xl mb-6" style={{ ...display, color: '#fff' }}>{data.name}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hi, I'm interested in ${data.name}. Could you share more details?`)}`}
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

      {/* ---------------- Specifications ---------------- */}
      {data.specs.length > 0 && (
        <section className="px-6 md:px-16 py-20" style={bgStyle(bgs.specs)}>
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-12">
              <Kicker color={bgs.specs === 'dark' ? C.mist : C.blue}>Specifications</Kicker>
              <h2 className="text-2xl md:text-4xl" style={{ ...display, color: bgs.specs === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
                The Plot, In Numbers
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.specs.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.05}>
                  <div className="h-full rounded-2xl bg-white p-6 text-center" style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}>
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
        <section className="px-6 md:px-16 py-20" style={bgStyle(bgs.connectivity)}>
          <div className="max-w-5xl mx-auto">
            <Reveal className="mb-12">
              <Kicker color={bgs.connectivity === 'dark' ? C.mist : C.blue}>Connectivity</Kicker>
              <h2 className="text-2xl md:text-4xl" style={{ ...display, color: bgs.connectivity === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
                Locations Nearby
              </h2>
              {data.connectivityIntro && (
                <p className="mt-4 max-w-2xl" style={{ color: bgs.connectivity === 'dark' ? C.paperMuted : C.slate }}>
                  {data.connectivityIntro}
                </p>
              )}
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {data.connectivity.map((item, i) => {
                const { name, time } = splitConnectivity(item)
                return (
                  <Reveal key={item} delay={i * 0.03}>
                    <div className="flex items-baseline justify-between py-3" style={{ borderBottom: `1px solid ${C.hairLight}` }}>
                      <span style={{ color: bgs.connectivity === 'dark' ? C.paperMuted : C.inkMuted }}>{name}</span>
                      {time && <span style={{ ...mono, color: C.blue, fontSize: '0.9rem', flexShrink: 0, marginLeft: '1rem' }}>{time}</span>}
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
          <Reveal className="text-center mb-16">
            <Kicker color={bgs.keyfigures === 'dark' ? C.mist : C.blue}>By The Numbers</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: bgs.keyfigures === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
              Thirty-plus years. Zero title disputes.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'map', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, label: 'Acres successfully aggregated & developed' },
              { icon: 'building', to: 30, format: (n: number) => `${Math.round(n)}+`, label: 'Landmark projects delivered' },
              { icon: 'layers', to: 2, format: (n: number) => `${Math.round(n)} Lakh+`, label: 'Sq.Ft commercial space leased' },
              { icon: 'users', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, label: 'Happy customers since 1991' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="h-full rounded-2xl bg-white p-6 text-center" style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}>
                  <div className="flex justify-center"><StatIcon name={s.icon} /></div>
                  <div className="mt-4 text-3xl md:text-4xl font-bold" style={{ ...display, color: C.ink }}><CountUp to={s.to} format={s.format} /></div>
                  <p className="mt-2 text-sm" style={{ color: C.slate }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Since 1991 ---------------- */}
      <section className="px-6 md:px-16 py-28 text-center" style={bgStyle(bgs.since1991)}>
        <div className="max-w-3xl mx-auto">
          <Reveal><Kicker color={bgs.since1991 === 'dark' ? C.mist : C.blue}>Est. 1991 · Chennai</Kicker></Reveal>
          <Reveal delay={0.1}>
            <p className="text-2xl md:text-4xl" style={{ ...display, color: bgs.since1991 === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
              Incorporated in 1991 to consolidate land for the future — industries, Special Economic
              Zones and residential spaces around the prime corridors of the city.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Amenities ---------------- */}
      {data.amenities.length > 0 && (
        <section className="px-6 md:px-16 py-28" style={bgStyle(bgs.amenities)}>
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-16">
              <Kicker color={bgs.amenities === 'dark' ? C.mist : C.blue}>Amenities</Kicker>
              <h2 className="text-2xl md:text-4xl" style={{ ...display, color: bgs.amenities === 'dark' ? C.paper : C.ink }}>
                Where Lifestyle Meets Coziness
              </h2>
              {data.amenitiesIntro && (
                <p className="mt-4 max-w-2xl mx-auto" style={{ color: bgs.amenities === 'dark' ? C.paperMuted : C.slate }}>
                  {data.amenitiesIntro}
                </p>
              )}
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
              {data.amenities.map((label, i) => (
                <Reveal key={label} delay={i * 0.05} className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-white"
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
      <section className="px-6 md:px-16 py-28" style={bgStyle(bgs.mission)}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { t: 'Our Mission', p: 'To turn every rupee of trust into a real, title-clear asset that lasts for generations.' },
            { t: 'Our Vision', p: "To be South India's most trusted steward of land — where legacy is engineered, not imagined." },
          ].map((m, i) => (
            <Reveal key={m.t} delay={i * 0.1}>
              <Kicker color={bgs.mission === 'dark' ? C.mist : C.blue}>{m.t}</Kicker>
              <p className="text-2xl md:text-3xl" style={{ ...display, color: bgs.mission === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>{m.p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ — only if this project's real page had one ---------------- */}
      {hasFaq && (
        <section className="px-6 md:px-16 py-28" style={bgStyle(bgs.faq)}>
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-16">
              <Kicker color={bgs.faq === 'dark' ? C.mist : C.blue}>Good to Know</Kicker>
              <h2 className="text-2xl md:text-4xl" style={{ ...display, color: bgs.faq === 'dark' ? C.paper : C.ink, fontWeight: 500 }}>
                Frequently Asked Questions
              </h2>
            </Reveal>
            <div>
              {data.faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.04}>
                  <div className="py-7" style={{ borderTop: `1px solid ${C.hairLight}` }}>
                    <h3 className="text-lg md:text-xl mb-3" style={{ ...display, color: bgs.faq === 'dark' ? C.paper : C.ink }}>{f.q}</h3>
                    <p style={{ color: bgs.faq === 'dark' ? C.paperMuted : C.slate }}>{f.a}</p>
                  </div>
                </Reveal>
              ))}
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
          <Reveal delay={0.08} className="rounded-2xl overflow-hidden mb-6" style={{ height: 360 }}>
            <iframe
              title={`${data.name} location`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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

      {/* ---------------- Book a Free Site Visit ---------------- */}
      <section className="px-6 md:px-16 py-24" style={bgStyle(bgs.visit)}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-start">
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
