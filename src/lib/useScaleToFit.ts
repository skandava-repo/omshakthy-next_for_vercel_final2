'use client'

import { useEffect, type RefObject } from 'react'

/**
 * For a fixed `height: 100vh`, `overflow: hidden` slide (PageController's
 * pinned sections — LeadersSection, CinematicTimeline, TestimonialsSection,
 * WhatWeDoCloneContent — are each explicitly "one screen, not a scroll" by
 * design, no scroll mechanism of their own to fall back on) whose own
 * vw/vh-driven fluid sizing can still end up taller than whatever height is
 * actually available on an unusually SHORT viewport (a laptop's 768px-tall
 * screen, say): the fluid formulas are mostly width-driven and don't know
 * the section ran out of vertical room, so content that's "correctly" sized
 * by its own clamp()/vw math compresses against itself instead of shrinking
 * further — cards, photos, and text crowding or overlapping.
 *
 * This is the backstop for exactly that case: it measures `stageRef`'s
 * natural (unscaled) size against `rootRef`'s actual box and applies ONE
 * uniform `transform: scale()` to the whole stage — never per-element —
 * whenever it doesn't fit, so a section always shrinks as a single rigid
 * unit (text included) instead of any piece of it reflowing, wrapping, or
 * overlapping. Scale is 1 (a no-op, `transform` left unset) whenever the
 * content already fits, which is the normal case on most screens — this
 * only ever makes things smaller, never rearranges them.
 *
 * Usage: give the outer `height:100vh; overflow:hidden` element `rootRef`,
 * wrap everything that currently renders inside it in one more div with
 * `ref={stageRef}` and (in that div's own CSS) `transform-origin: center
 * center` — see LeadersSection's `.ld3__stage` for the reference shape.
 * Any `position: absolute` descendant that used to rely on the OLD outer
 * element as its containing block needs `position: relative` added to the
 * new stage div (LeadersSection.css's own `.ld3__stage` comment explains
 * why: a dynamically-applied `transform` changes which ancestor is the
 * containing block, so it has to be pinned down unconditionally instead of
 * shifting depending on whether scale is currently 1).
 */
export function useScaleToFit(
  rootRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return

    const fit = () => {
      // Reset to natural size first — measuring scrollHeight/Width while
      // an old scale is still applied would measure the shrunk box, not
      // the content's real size, and the fit would ratchet down forever.
      stage.style.transform = 'scale(1)'
      const availW = root.clientWidth
      const availH = root.clientHeight
      const naturalW = stage.scrollWidth
      const naturalH = stage.scrollHeight
      const scale = Math.min(1, availW / naturalW, availH / naturalH)
      stage.style.transform = scale < 1 ? `scale(${scale})` : ''
    }

    fit()
    // Watches both boxes, not just root: root only resizes when the
    // window itself does, but the stage's natural (pre-scale) size can
    // also change on its own — a lazy image finishing its load, or a web
    // font swapping in after the system-font fallback and reflowing text
    // to a different height — and either one can leave an already-applied
    // scale stale. Re-running fit() itself sets .transform, but that's a
    // paint-only change, not a layout one, so it can't retrigger this same
    // observer into a loop.
    const ro = new ResizeObserver(fit)
    ro.observe(root)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [rootRef, stageRef])
}
