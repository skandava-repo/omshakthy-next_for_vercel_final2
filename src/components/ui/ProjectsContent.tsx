'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import Link from 'next/link'
import { projects, type Project } from '@/lib/projectsData'

// Re-exported so /ongoing-projects, /upcoming-projects, and
// /completed-projects (real indexed URLs Balaji's SEO report flagged
// as missing — Server Components, so they import the plain data
// module directly rather than through this 'use client' file) can
// keep importing from either place.
export type { Project }
export { projects }

/* ProjectsContent — built to mirror stewartcorealty.com's
   /search-result-sales page (the reference the user pointed at): a
   real filter bar (search + status + type, all functionally wired,
   not decorative) above a 2-column full-bleed photo grid, each card's
   name/price/type overlaid directly on the image rather than sitting
   below it in a text block. Same C/display/body/mono/Reveal/
   KineticHeading pattern AboutContent.tsx already established for
   this site's content pages — duplicated locally rather than shared,
   same as that file did for its own primitives.

   Project data is the real set already defined in PropertyGrid.tsx
   (home page) — not invented for this page. Six real projects, three
   sold out — no fake "Load More" pagination, since there's nothing
   more to load. */

// Blue-only palette, same as AboutContent.tsx's post-rebrand C object —
// this page never actually used the old brass/cream tokens (grep turned
// up zero usages beyond their own definitions), so this is a cleanup,
// not a visual change: dropping the dead gold-adjacent tokens so there's
// nothing left to accidentally reach for later.
const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  // Same blue-tinted fill AboutContent.tsx uses for its alternate
  // section background — reused here on the filter fields themselves so
  // they read as distinct controls against the white section instead of
  // blending into it (white-on-white with only a 12%-opacity border).
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif" }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace" }

// v2 — a bare thin-stroke chevron floating on the same panel background
// read as too quiet/generic still (basically the native arrow's shape,
// just recolored). A solid filled disc instead of an outline gives it
// actual presence as a real control, not a leftover default: brand blue
// fill (C.blue — this page's own palette is blue-only by design, see
// the comment on C above; no gold/brass here to reach for instead) with
// a crisp white chevron cut into it.
// A quarter-turn on focus was tried here too (matching Header.tsx's own
// dropdown caret flipping open/closed) but dropped: confirmed live that
// `transform` doesn't visibly apply to elements in this environment at
// all right now, independent of whether it's set via a Tailwind utility
// or a raw inline style — the DOM correctly holds rotate(180deg) either
// way, but getComputedStyle keeps reporting the identity matrix, and
// nothing rotates on screen. That's a pre-existing rendering issue
// bigger than this one icon, not something to chase mid-icon-swap —
// left as a static badge rather than shipping an onFocus/onBlur wiring
// that would have had zero visible effect.
const DropdownChevron = () => (
  <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
    <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: C.blue }}>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  </span>
)
const ease = [0.16, 1, 0.3, 1] as const

// Cheap 2-layer shadow, not .hero-slider__title's full 8-layer stack —
// that one has 4 large-blur glows (up to 150px) which are fine on
// Hero's small clamp(24-42px) text but were genuinely janking scroll
// here once applied to this page's much larger text-6xl heading (the
// browser has to rasterize that blur radius over a far bigger glyph
// area, repeatedly, on every repaint). One tight offset shadow plus one
// moderate blur gives the same "reads over any photo" legibility for a
// fraction of the paint cost.
const heroTextShadow = '2px 2px 4px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.55)'

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
  if (!mounted) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Count-up figure ---------- */
const CountUp = ({ to, format }: { to: number; format: (n: number) => string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

// Badge label/color per status, shown on each project card.
const STATUS_STYLE: Record<Project['status'], { label: string; bg: string; color: string }> = {
  Ongoing: {
    label: 'Ongoing',
    bg: 'rgba(13,107,178,0.1)',
    color: C.blue,
  },
  Sold: {
    label: 'Sold Out',
    bg: 'rgba(180,83,9,0.1)',
    color: '#B45309',
  },
}

const statusOptions = ['All Status', 'Ongoing', 'Sold'] as const
const typeOptions = ['All Types', ...Array.from(new Set(projects.map((p) => p.type)))]
const locationOptions = ['All Locations', ...Array.from(new Set(projects.map((p) => p.location)))]

const ProjectsContent = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<(typeof statusOptions)[number]>('All Status')
  const [type, setType] = useState('All Types')
  const [location, setLocation] = useState('All Locations')

  // The project grid below switches from a fixed-aspect-ratio
  // photo-with-overlaid-text card (desktop, 2-column) to a stacked
  // photo-then-details card (mobile, 1 column) — see that grid's own
  // comment for why. They're different enough (overlay vs. normal
  // flow, different element tree) that branching the JSX on a real
  // "are we at the single-column breakpoint" check is far safer than
  // trying to force one DOM shape to cover both with CSS alone — this
  // mirrors the width ProjectsContent already treats as the single-
  // column cutover (grid md:grid-cols-2, Tailwind's md: = 768px).
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      const matchesStatus = status === 'All Status' || p.status === status
      const matchesType = type === 'All Types' || p.type === type
      const matchesLocation = location === 'All Locations' || p.location === location
      return matchesQuery && matchesStatus && matchesType && matchesLocation
    })
  }, [search, status, type, location])

  const resetFilters = () => {
    setSearch('')
    setStatus('All Status')
    setType('All Types')
    setLocation('All Locations')
  }

  return (
    <main style={{ backgroundColor: '#fff', color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section
        className="relative flex items-end min-h-[69vh] pt-48 pb-20 px-6 md:px-10"
        style={{
          backgroundImage: `url('/projects/explore-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1180px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-3"
            style={{ ...mono, fontSize: '0.8rem', letterSpacing: '0.2em', color: C.mist, textTransform: 'uppercase', textShadow: heroTextShadow }}
          >
            <span style={{ width: 36, height: 1.5, background: C.mist, display: 'inline-block' }} />
            Our Projects
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-6xl font-bold"
            style={{ ...display, color: '#fff', textShadow: heroTextShadow }}
          >
            Landmark Developments Across Tamil Nadu
          </motion.h1>
        </div>
      </section>

      {/* ---------------- Filter bar ----------------
          The reference has a centered tracked-caps "EXPLORE OUR
          PROPERTIES" heading above the fields, and the fields
          themselves sit in a 2-row grid of pill dropdowns (not one
          mixed row of a text input + segmented buttons, which is what
          this had before). Rebuilt to match: Search / Location / Type
          on row one, Status / Reset Filters on row two — Location and
          Type are real dropdowns built from this page's own actual
          data (6 real locations, 4 real project types), not filler
          fields copied from a listing site that also tracks bedrooms
          and bathrooms, which our land/plot inventory doesn't have. */}
      {/* Back to white with the animated building-sketch watermark — the
          real aerial photo tried here didn't work out, reverted. */}
      <section className="relative overflow-hidden px-6 md:px-10 pt-16 pb-16" style={{ backgroundColor: '#fff' }} data-header-theme="light">
        <motion.img
          src="/about/building-sketch.webp"
          alt=""
          aria-hidden
          className="absolute left-1/2 w-[900px] md:w-[1300px] max-w-none pointer-events-none select-none hidden sm:block"
          style={{ opacity: 0.08, top: '80%', y: '-50%' }}
          animate={{ x: ['-60%', '-40%', '-60%'], rotate: [-2, 2, -2] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1180px] mx-auto relative">
          <Reveal className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-bold uppercase"
              style={{ ...display, color: C.ink, letterSpacing: '0.08em' }}
            >
              Explore Our Projects
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke={C.slate}
                strokeWidth={1.6}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
              />
            </div>

            {/* Was a bare <select> with no appearance styling at all —
                every browser falls back to its own generic native arrow
                for that (a plain gray triangle on macOS Chrome), which
                is the one piece of this bar that never got the same
                pill/serif treatment as everything around it. appearance-
                none turns that native arrow off; DropdownChevron below
                draws a real one in the site's own line-icon language
                instead (same stroke width/style as the search icon
                right next to it), the same "custom-styled to match, not
                left as whatever the OS defaults to" idea Header.tsx's
                own dropdown already went through. */}
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none px-5 pr-11 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
              >
                {locationOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <DropdownChevron />
            </div>

            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full appearance-none px-5 pr-11 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <DropdownChevron />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as (typeof statusOptions)[number])}
                className="w-full appearance-none px-5 pr-11 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <DropdownChevron />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3.5 rounded-full text-sm font-semibold uppercase"
              style={{ ...mono, backgroundColor: C.ink, color: '#fff', letterSpacing: '0.08em' }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Project grid ----------------
          The reference's cards are flush edge-to-edge — no rounded
          corners, no drop shadow, no gap between them, cards butt
          straight up against each other in a seamless 2-column grid.
          This had all three (rounded-[10px], a boxShadow, gap-6),
          which is why it read as a generic "card" grid instead of
          matching the reference's flatter, more architectural gallery
          feel. Text on the photo also carries no colored badge pill in
          the reference — just plain tracked uppercase text, which is
          what "Ongoing"/"Sold Out" now use instead of a filled chip. */}
      {/* No longer full-bleed — per request, the cards were reading as
          "flush left and right" against the viewport edges, so the grid
          now sits inside the same px-6/md:px-10 + max-w-[1180px]
          centered container the filter bar above it already uses,
          shrinking the cards in from both edges. (Was deliberately
          edge-to-edge before, matching a reference design — that's the
          part being reversed here.) */}
      <section className="px-4 md:px-6" data-header-theme="light">
        <div className="max-w-[1600px] mx-auto">
          {filtered.length === 0 && (
            <Reveal className="text-center py-20">
              <p className="text-lg" style={{ color: C.slate }}>No projects match those filters.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-6 py-3 rounded-full text-sm font-semibold"
                style={{ backgroundColor: C.ink, color: '#fff' }}
              >
                Reset Filters
              </button>
            </Reveal>
          )}
          {filtered.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((p, i) => {
              /* Link vs. plain div can't share one polymorphic tag
                 without fighting TS's LinkProps typing — the inner
                 markup is identical either way, so it's built once
                 and just wrapped differently. */
              /* Redesigned per request: rounded corners (was
                 deliberately flat/square before). Previous pass tried a
                 row of two separate boxes (a white panel + a photo box
                 side by side), each with its own background — that
                 always shows a seam where the two meet, because their
                 colors can never line up pixel-for-pixel at every
                 height. Fixed by going back to ONE photo filling the
                 whole card, with a single gradient scrim laid on top of
                 it (white/pale-blue, opaque on the left, fading to
                 fully transparent by the image's midpoint) — the
                 "opaque left portion" is just where that scrim reads as
                 solid, so it's physically the same layer as the fade,
                 not two things touching. Project details sit on top of
                 the scrim as plain dark text. gap-3 -> gap-5 to narrow
                 each card slightly, per request. */
              const desktopCardInner = (
                <div className="relative overflow-hidden" style={{ aspectRatio: '2.5 / 1' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      ...(p.imagePosition ? { objectPosition: p.imagePosition } : {}),
                    }}
                    loading="lazy"
                  />

                  {/* One continuous scrim — opaque white/pale-blue on
                      the left, gradually fading to fully transparent.
                      Nothing else shares this edge, so there's nothing
                      for it to seam against. */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to right, #ffffff 0%, #ffffff 20%, #eaf3fb 28%, rgba(234,243,251,0.65) 34%, rgba(234,243,251,0.25) 39%, rgba(234,243,251,0) 45%)',
                    }}
                  />

                  {/* Project details, sitting on the opaque part of the scrim. */}
                  <div className="absolute inset-y-0 left-0 flex flex-col justify-center" style={{ width: '38%', padding: '0 1.1rem 0 1.4rem' }}>
                    <span
                      className="inline-flex items-center gap-1 rounded-full uppercase w-fit"
                      style={{
                        ...body,
                        padding: '0.2rem 0.5rem',
                        background: STATUS_STYLE[p.status].bg,
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: STATUS_STYLE[p.status].color,
                      }}
                    >
                      <span
                        className="rounded-full flex-shrink-0"
                        style={{ width: 5, height: 5, background: 'currentColor' }}
                      />
                      {STATUS_STYLE[p.status].label}
                    </span>
                    <h3
                      className="uppercase"
                      style={{
                        ...display,
                        margin: '0.3rem 0 0',
                        fontSize: 28,
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: '0.02em',
                        color: C.ink,
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        minWidth: 0,
                        maxWidth: 210,
                      }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="flex items-center gap-1"
                      style={{ ...body, margin: '0.15rem 0 0', fontSize: 15, color: C.slate, minWidth: 0 }}
                    >
                      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.4" />
                      </svg>
                      {p.location}
                    </p>
                    <p style={{ ...body, marginTop: '0.35rem', fontSize: 14.5, fontWeight: 600, color: C.ink }}>
                      {p.price}
                    </p>
                    {/* Same type label already shown top-right on the
                        photo (className="block text-sm") — also added
                        here in the details panel, per request. */}
                    <p className="block text-sm" style={{ ...body, marginTop: '0.35rem', color: C.slate }}>
                      {p.type}
                    </p>
                  </div>
                </div>
              )

              /* Mobile card — the desktop card above packs a status
                 badge + 2-line uppercase title + location + price +
                 type into a column absolutely positioned and vertically
                 centered inside a fixed aspectRatio:2.5/1 box. That
                 ratio only has enough height at desktop's 2-column
                 width; at mobile's single column (full card width) the
                 same ratio makes the card too short for that much
                 text, and the centered, overflow:hidden column clips
                 it top and bottom — confirmed live: "KANOPUS MAGHA"
                 rendering as just "MAG HA", its first word and part of
                 its second sheared off above the visible card. Fixing
                 it by giving mobile its own layout — photo on top at a
                 normal photo ratio, status badge as a small corner chip
                 on the photo instead of sharing the text column, and
                 the title/location/price/type below the photo in
                 ordinary document flow, so their height is whatever
                 they actually need instead of being forced into a
                 fixed box. */
              const mobileCardInner = (
                <div>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        ...(p.imagePosition ? { objectPosition: p.imagePosition } : {}),
                      }}
                      loading="lazy"
                    />
                    <span
                      className="absolute inline-flex items-center gap-1 rounded-full uppercase w-fit"
                      style={{
                        ...body,
                        top: 10,
                        left: 10,
                        padding: '0.25rem 0.6rem',
                        background: '#fff',
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: STATUS_STYLE[p.status].color,
                      }}
                    >
                      <span
                        className="rounded-full flex-shrink-0"
                        style={{ width: 5, height: 5, background: 'currentColor' }}
                      />
                      {STATUS_STYLE[p.status].label}
                    </span>
                  </div>

                  <div style={{ padding: '0.9rem 1.1rem 1.1rem' }}>
                    <h3
                      className="uppercase"
                      style={{
                        ...display,
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: '0.02em',
                        color: C.ink,
                      }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="flex items-center gap-1"
                      style={{ ...body, margin: '0.4rem 0 0', fontSize: 14, color: C.slate }}
                    >
                      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.4" />
                      </svg>
                      {p.location}
                    </p>
                    <div className="flex items-center justify-between" style={{ marginTop: '0.5rem' }}>
                      <p style={{ ...body, margin: 0, fontSize: 14.5, fontWeight: 600, color: C.ink }}>
                        {p.price}
                      </p>
                      <p style={{ ...body, margin: 0, fontSize: 12.5, color: C.slate }}>
                        {p.type}
                      </p>
                    </div>
                  </div>
                </div>
              )

              const cardInner = isMobile ? mobileCardInner : desktopCardInner
              return (
                <Reveal key={p.name} delay={(i % 2) * 0.08}>
                  {p.link ? (
                    <Link href={p.link} className="block overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(13, 107, 178, 0.35)' }}>
                      {cardInner}
                    </Link>
                  ) : (
                    <div className="block overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(13, 107, 178, 0.35)' }}>
                      {cardInner}
                    </div>
                  )}
                </Reveal>
              )
            })}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Stats strip ----------------
          The reference has exactly this — three plain number+line
          facts between the grid and the footer (25 years experience /
          3 countries of practice / 1 goal). Missed entirely in the
          first build. Real OmShakthy numbers here, not invented ones:
          the 35+ years and 100% litigation-free figures are the same
          facts the About page's own legacy section uses, and the
          project count is the actual length of the array above, so it
          never drifts out of sync with what's really listed. */}
      <section className="px-6 md:px-10 py-16" style={{ borderTop: `1px solid ${C.border}` }} data-header-theme="light">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { to: 35, format: (n: number) => `${Math.round(n)}+`, label: 'years shaping Tamil Nadu’s real estate landscape.' },
            { to: projects.length, format: (n: number) => `${Math.round(n)}`, label: 'landmark developments delivered across Tamil Nadu.' },
            { to: 100, format: (n: number) => `${Math.round(n)}%`, label: 'litigation-free track record, every single time.' },
          ].map((s) => (
            <Reveal key={s.label} className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-bold flex-shrink-0" style={{ ...display, color: C.ink }}>
                <CountUp to={s.to} format={s.format} />
              </span>
              <span className="text-sm md:text-base" style={{ color: C.slate }}>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ProjectsContent
