'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import './PageController.css'

interface PageControllerProps {
  children: React.ReactNode[]
  // Below MOBILE_BREAKPOINT, sections from this index onward stop being
  // pinned/wheel-jacked and render as plain stacked content instead —
  // see the comment above MOBILE_BREAKPOINT for why. Omit to keep every
  // section pinned at all viewport widths (today's behavior).
  freeFlowFrom?: number
}

// A pinned "one wheel-tick = one full-screen slide" section only works if
// every slide actually fits in 100vh. LeadersSection/TestimonialsSection/
// WhatWeDoCloneContent's own CSS deliberately grows taller than 100vh
// below their tablet breakpoints (980px/900px/980px) — stacking a row
// that was side-by-side on desktop needs more vertical room once it wraps.
// .page-controller__section's height:100vh + overflow:hidden never had a
// matching override, so at those widths the bottom of each section was
// silently clipped and permanently unreachable (confirmed live at iPad
// Air's 820px width: .wc alone was ~1970px of real content cut down to
// 870px, with no scroll mechanism able to reach the rest — native scroll
// is fully hijacked while pinned, and .page-controller__section has no
// overflow-y of its own to fall back on).
// Widest of those breakpoints is 980px; CinematicTimeline (the other
// wheel-dependent section, index 2) already has its own tap-to-jump
// fallback (.ct-seg buttons) independent of wheel input, so it stays
// pinned safely at every width. 1024px matches Header.css's own
// "mobile/tablet" breakpoint elsewhere on this site.
const MOBILE_BREAKPOINT = 1024

const PageController = ({ children, freeFlowFrom }: PageControllerProps) => {
  const [currentSection, setCurrentSection] = useState(0)
  // Once true, this component stops owning the wheel — native scrolling
  // takes over so whatever is rendered after <PageController> in normal
  // document flow becomes reachable. Re-engaged if the user scrolls back up
  // to the very top of that free-flow content (see handleWheel below).
  const [released, setReleased] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const isAnimating = useRef(false)
  const totalSections = children.length
  // On desktop (or when freeFlowFrom isn't passed) this equals
  // totalSections — every section stays pinned, byte-for-byte the same
  // as before this prop existed. Only narrows below that on a narrow
  // viewport with freeFlowFrom set.
  const pinnedCount = isNarrow && freeFlowFrom != null ? freeFlowFrom : totalSections
  const pinnedChildren = children.slice(0, pinnedCount)
  const freeFlowChildren = children.slice(pinnedCount)

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= totalSections || isAnimating.current) return
    isAnimating.current = true
    setCurrentSection(index)
    setTimeout(() => { isAnimating.current = false }, 750)
  }, [totalSections])

  const handleWheel = useCallback((e: WheelEvent) => {
    // Block all section navigation while the intro overlay is still on screen
    // (keyhole + video + swipe). This prevents scrolling from advancing the
    // hidden sections in the background and landing the user on the wrong page.
    if (document.querySelector('.intro-section')) return

    if (released) {
      // Free-flowing — leave native scroll alone. The only thing we still
      // watch for is scrolling up past the top of that free-flow content,
      // which means the user wants back into the snapped section stack.
      if (window.scrollY <= 0 && e.deltaY < 0 && !isAnimating.current) {
        e.preventDefault()
        isAnimating.current = true
        setReleased(false)
        setTimeout(() => { isAnimating.current = false }, 750)
      }
      return
    }

    e.preventDefault()

    if (isAnimating.current) return
    if (Math.abs(e.deltaY) < 8) return

    const dir = e.deltaY > 0 ? 1 : -1

    // If current section is the timeline (index 2), step through its
    // horizontal milestones one at a time in EITHER direction, only
    // falling through to a real section change once already at a
    // boundary milestone (0 or the last one).
    //
    // This used to be asymmetric — scrolling down stepped one milestone
    // at a time, but scrolling up called timelineReset() and fell straight
    // through to a full section change on the very first up-tick, no
    // matter which milestone was showing. Trackpad momentum/rubber-banding
    // commonly produces a brief, unintended reversal in deltaY as a mostly-
    // downward gesture settles — with the old asymmetric handling, that
    // single accidental blip would eject the user straight out of the
    // timeline and onto a different page section, which is exactly what
    // read as the timeline "skipping" — it wasn't the horizontal transition
    // itself, it was losing the whole section. Routing both directions
    // through timelineAdvance fixes this: an accidental up-blip just steps
    // back one milestone (harmless), and the section only actually changes
    // once the user is genuinely at the first/last milestone and keeps
    // going.
    const timelineAdvance = (window as any).__timelineAdvance
    if (currentSection === 2 && typeof timelineAdvance === 'function') {
      const consumed = timelineAdvance(dir)
      if (consumed) {
        // Timeline handled it — block section change briefly
        isAnimating.current = true
        setTimeout(() => { isAnimating.current = false }, 700)
        return
      }
      // Boundary reached in this direction — fall through to move sections
    }

    // Backing out of LeadersSection (index 3) into the timeline (index 2)
    // should always restart the timeline at its first milestone (1991),
    // not resume wherever it was last left — e.g. if the user scrolled
    // all the way through to 2024 before moving on to Leadership, going
    // back should show 1991 again, not land back on 2024. This is
    // deliberately narrow: only this specific transition resets it, not
    // every up-scroll (see __timelineReset's own comment for why that
    // used to be broader and caused a real bug).
    const timelineReset = (window as any).__timelineReset
    if (currentSection === 3 && dir === -1 && typeof timelineReset === 'function') {
      timelineReset()
    }

    // TrustedPartnersSection (index 6, also the last snapped section) used
    // to special-case here the same way the timeline does above — it was
    // a one-pillar-at-a-time gallery stepped via a __tpGalleryAdvance hook
    // it registered on window. It's since been rebuilt as a plain grid
    // showing all 5 pillars at once (see TrustedPartnersSection's own
    // comment), so it no longer registers that hook at all and there's
    // nothing left to special-case — the wheel just falls straight
    // through to the normal section-change logic below, same as any
    // other slide.

    // At the last PINNED section and still scrolling down: hand off to
    // native scroll for whatever comes next — on desktop that's whatever
    // comes after PageController in the document (pinnedCount ===
    // totalSections there, so this is unchanged from before); on a narrow
    // viewport with freeFlowFrom set, it's this section's own free-flow
    // tail (see pinnedChildren/freeFlowChildren above) instead of sitting
    // stuck (goTo is a no-op past the last pinned index).
    if (currentSection === pinnedCount - 1 && dir === 1) {
      setReleased(true)
      return
    }

    goTo(currentSection + dir)
  }, [currentSection, goTo, released, pinnedCount])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Expose current section & notify listeners (header padding, etc.)
  useEffect(() => {
    (window as any).__pageControllerCurrentSection = currentSection
    window.dispatchEvent(new Event('pageSectionChange'))
  }, [currentSection])

  return (
    <>
      <div className={`page-controller${released ? ' page-controller--released' : ''}`}>
        <div
          className="page-controller__track"
          style={{ transform: `translateY(-${currentSection * 100}vh)` }}
        >
          {pinnedChildren.map((child, i) => (
            <div className="page-controller__section" key={i}>
              {child}
            </div>
          ))}
        </div>
      </div>
      {/* Only non-empty on a narrow viewport with freeFlowFrom set — on
          desktop, pinnedCount === totalSections so this is always []. Plain
          stacked normal-flow content, not wrapped in .page-controller__section
          (that class's height:100vh + overflow:hidden is exactly what was
          clipping these sections — see MOBILE_BREAKPOINT's comment above).
          Each section's own responsive CSS is what actually determines its
          height here; nothing in this file constrains it. */}
      {freeFlowChildren.map((child, i) => (
        <div key={pinnedCount + i}>{child}</div>
      ))}
    </>
  )
}

export default PageController
