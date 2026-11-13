'use client'
import { useEffect, useRef, useState } from 'react'
import './CinematicTimeline.css'

const milestones = [
  {
    year: '1991',
    // Optional, only set here: shown instead of `year` wherever a
    // milestone's year is displayed (.ct-slide__year-display,
    // .ct-bar__bigyear-text, .ct-seg__year) — `year` itself stays
    // '1991' so the ct-slide--1991 CSS hook is untouched.
    yearDisplay: '1991-95',
    title: 'The Beginning',
    // **bold** marks the highlighted phrase — see renderDescription() below.
    description: 'Founded **OmShakthy Agencies (Madras) Pvt. Ltd.,** marking the beginning of a legacy in creating enduring real assets.',
    stat: '1',
    statLabel: 'Company Founded',
    // .webp, not .jpg — JPEG's block compression visibly bands the smooth
    // white-panel gradient on this image (confirmed: the .jpg export shows
    // a banding line the source .png doesn't have). .webp handles it
    // cleanly and comes in smaller besides.
    image: '/timeline-1991.webp',
    // All 6 background images have had their baked-in text removed and
    // replaced by the live .ct-slide__content overlay below.
    textFree: true,
  },
  {
    year: '1993',
    // Same yearDisplay device as 1991-95 above: shown instead of `year`
    // wherever a milestone's year is displayed, `year` itself untouched
    // so ct-slide--1993 keeps working.
    yearDisplay: '2000',
    // Real content, from "Journey Oms.txt": the company is "SITCO" in
    // the source, not "SIDCO" (the fabricated spelling this slide used
    // before), and the ₹350 crore figure is the project's value, not
    // an acreage.
    title: 'SITCO Partnership',
    // barTitle: the bottom-bar label's text, with \n marking where it
    // breaks on mobile (CinematicTimeline.css). Kept separate from
    // `title` so the big slide title isn't affected. Falls back to
    // `title` when omitted (1991 stays on one line).
    barTitle: 'SITCO\nPartnership',
    description: 'Undertook a major land aggregation for **SITCO**, valued at approximately **₹350 crore** — a defining early challenge.',
    stat: '350',
    statLabel: 'Crore Project Value',
    image: '/timeline-1993.webp',
    textFree: true,
  },
  {
    year: '1997',
    yearDisplay: '2005',
    // \n here forces "World City" onto its own line in .ct-slide__title
    // (see renderTitle() below) — harmless everywhere else this field is
    // used as plain text (.ct-bar__bigyear-label), where it just
    // collapses to whitespace like any other newline in inline HTML text.
    title: 'Mahindra\nWorld City',
    // Real content: the source document puts Phase 1 at 1,350 acres,
    // not the 2,000-acre SEZ figure this slide fabricated before.
    description: "Undertook one of the company's largest land aggregations — **1,350 acres** for Mahindra World City, Phase 1.",
    stat: '1,350',
    statLabel: 'Acres, Phase 1',
    image: '/timeline-1997.webp',
    textFree: true,
  },
  {
    year: '1998',
    yearDisplay: '2010',
    // Retitled from "Construction Era" — the source document has no
    // single construction milestone at this exact year; closest real
    // match is its own "Growth into Real Estate Development" section
    // (2006-2015), highlighted here via its largest listed project.
    title: 'Real Estate\nGrowth',
    barTitle: 'Real Estate\nGrowth',
    description: 'Expanded into real estate with projects like **Omshakthy Kanopus**, spanning over **11.5 lakh sq.ft.** of plotted development.',
    stat: '11.5L',
    statLabel: 'Sq.Ft Developed',
    image: '/timeline-1998.webp',
    textFree: true,
  },
  {
    year: '2000',
    yearDisplay: '2015',
    // Retitled copy only: the source document confirms PepsiCo, not
    // Reliance (never mentioned), and gives no acreage figure — both
    // were fabricated in the previous description.
    title: 'Corporate Giants',
    barTitle: 'Corporate\nGiants',
    description: 'Executed a major land aggregation for **PepsiCo**, strengthening our experience with large corporate land requirements.',
    stat: '2000',
    statLabel: 'PepsiCo Partnership',
    image: '/timeline-2000.webp',
    textFree: true,
  },
  {
    year: '2024',
    yearDisplay: '2020',
    // Real content for 2020, from "Journey Oms.txt" Part V: a pure
    // company-growth fact this time, not the leadership-transition
    // narrative the previous two passes used (direct feedback: "only
    // the company growth... not this stuff what company achieved").
    // The Madurai land aggregation is the real growth stat tied to
    // this era in the source document.
    title: 'Madurai\nExpansion',
    barTitle: 'Madurai\nExpansion',
    description: 'Undertook a massive land aggregation spanning approximately **2,000 acres** in Madurai, strengthening our large-scale land strategy.',
    stat: '2,000',
    statLabel: 'Acres in Madurai',
    // Temporary — timeline-2024.webp (this slide's old image) moved to
    // the 2025 slide below, which fits its "PLOTS/VILLAS/..." category
    // graphic better now that 2025 covers Manigantan's diversified
    // expansion. Swap this for a dedicated land/expansion photo
    // (aerial land parcel, survey markers) once one exists.
    image: '/timeline-2000.webp',
    textFree: true,
  },
  {
    // 7th slide extending the timeline through 2025. Now uses
    // timeline-2024.webp (moved from the 2020 slide above, which needed
    // it freed up for its own new land/expansion-themed image) — its
    // "PLOTS / VILLAS / APARTMENTS / COMMERCIAL / TOWNSHIPS /
    // COMMUNITIES" category graphic fits this slide's real content
    // (Manigantan's diversified expansion) better than the slide it
    // came from.
    year: '2025',
    title: 'The Next Chapter',
    barTitle: 'The Next\nChapter',
    // Real content, from "Journey Oms.txt" Part V: Manigantan's
    // 2021-2024 project launches and the NBE quarrying diversification
    // — replaces the generic "35+ years of trust" copy this slide had
    // as a placeholder. The Madurai land figure moved to the 2020 slide
    // above, which needed its own growth stat.
    description: 'Launched **Mithila, Elite Orchard, Mathura, Regalia** and more — while diversifying into **NBE** granite and quarrying.',
    stat: '4',
    statLabel: 'States (NBE Quarrying)',
    image: '/timeline-2024.webp',
    textFree: true,
  },
]

// Splits a description on **bold** markers and renders the marked
// portion as <strong>. Plain string in, JSX out — keeps the milestones
// data readable instead of forcing each description into an array of
// pre-split fragments.
function renderDescription(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// Splits a title on \n and renders each segment on its own line via <br>.
// Only used for .ct-slide__title — other places that read m.title
// (.ct-bar__bigyear-label) render it as plain text, where a literal \n
// just collapses to whitespace like normal inline HTML.
function renderTitle(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ))
}

const CinematicTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  // Keep ref in sync
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Expose a handler PageController can call. Returns true if the timeline
  // consumed the scroll (still has milestones left in that direction),
  // false if it's at a boundary and PageController should move sections.
  //
  // __timelineReset is separate and intentional: PageController calls it
  // specifically when the user backs OUT of LeadersSection into this one
  // (Leadership -> Timeline, scrolling up) — re-entering should always
  // restart at 1991, not resume wherever the timeline was left (e.g. still
  // on 2024 from having scrolled all the way through it earlier). This
  // used to also fire on every up-tick while already INSIDE the timeline,
  // which is what caused a real bug (a single accidental up-blip ejecting
  // the user to a different section entirely, read as the timeline
  // "skipping") — that part was removed; only the Leadership-re-entry
  // case calls this now.
  useEffect(() => {
    (window as any).__timelineAdvance = (dir: number) => {
      const next = activeIndexRef.current + dir
      if (next >= 0 && next < milestones.length) {
        setActiveIndex(next)
        return true // consumed
      }
      return false // boundary — let page move
    }
    ;(window as any).__timelineReset = () => {
      setActiveIndex(0)
    }
    return () => {
      delete (window as any).__timelineAdvance
      delete (window as any).__timelineReset
    }
  }, [])

  return (
    <div className="ct-section">
      {/* .ct-stage wraps the track so the mobile prev/next arrows can be
          positioned against the slide area only (not the .ct-bar below).
          On desktop it's a transparent flex:1 column, same box the track
          used to fill directly, and the arrows are display:none. */}
      <div className="ct-stage">
      <div
        className="ct-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {milestones.map((m, i) => (
          <div
            // ct-slide--<year> is a per-slide styling hook — lets any of the
            // six milestones get its own CSS override (font-size, spacing,
            // position, whatever) without touching the other five, on top
            // of the shared .ct-slide__* baseline rules in the CSS file.
            className={`ct-slide ct-slide--${m.year} ${i === activeIndex ? 'ct-slide--active' : ''}`}
            key={i}
          >
            <div className="ct-slide__bgwrap">
              <div
                className="ct-slide__bg"
                style={{
                  backgroundImage: `url(${m.image})`,
                  backgroundPosition: m.image === '/timeline-1997.webp' ? 'center 22%' : m.image === '/timeline-1998.webp' ? 'center 40%' : ['/timeline-1993.webp', '/timeline-2000.webp', '/timeline-2024.webp'].includes(m.image) ? 'center 30%' : 'center',
                  backgroundSize: 'cover',
                }}
              />
            </div>
            <div className="ct-slide__overlay" />
            {m.textFree && (
              <div className="ct-slide__content">
                <div className="ct-slide__year-display">{m.yearDisplay ?? m.year}</div>
                <div className="ct-slide__underline" />
                <div className="ct-slide__title">{renderTitle(m.title)}</div>
                <div className="ct-slide__dash" />
                <p className="ct-slide__desc">{renderDescription(m.description)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

        {/* Mobile-only prev/next (CinematicTimeline.css hides these above
            768px, where wheel-stepping drives the slider instead). */}
        <div className="ct-arrows">
          <button
            type="button"
            className="ct-arrow ct-arrow--prev"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous milestone"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            className="ct-arrow ct-arrow--next"
            onClick={() => setActiveIndex((i) => Math.min(milestones.length - 1, i + 1))}
            disabled={activeIndex === milestones.length - 1}
            aria-label="Next milestone"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Innovative timeline progress bar */}
      <div className="ct-bar">
        {/* Big morphing year on the left */}
        <div className="ct-bar__bigyear">
          <span
            className={`ct-bar__bigyear-text${activeIndex === 0 ? ' ct-bar__bigyear-text--1991' : ''}`}
            key={activeIndex}
          >
            {milestones[activeIndex].yearDisplay ?? milestones[activeIndex].year}
          </span>
          <span className="ct-bar__bigyear-label">
            {/* Honours the \n in titles (e.g. "Mahindra\nWorld City") via a
                <br> that CinematicTimeline.css only shows on mobile. The
                leading space keeps desktop reading "Mahindra World City"
                on one line while the <br> is hidden; on mobile the browser
                drops that space at the start of the new line. */}
            {(milestones[activeIndex].barTitle ?? milestones[activeIndex].title).split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br className="ct-bar__bigyear-br" />}
                {i > 0 ? ` ${line}` : line}
              </span>
            ))}
          </span>
        </div>

        {/* Segmented liquid-fill progress */}
        <div className="ct-bar__segments">
          {milestones.map((m, i) => (
            <button
              key={i}
              className={`ct-seg ${i === activeIndex ? 'ct-seg--active' : ''} ${i < activeIndex ? 'ct-seg--done' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className="ct-seg__fill" />
              <span className="ct-seg__year">{m.yearDisplay ?? m.year}</span>
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="ct-bar__counter">
          <span className="ct-bar__counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="ct-bar__counter-total">/ {String(milestones.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

export default CinematicTimeline
