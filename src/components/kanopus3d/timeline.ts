// Scroll -> animation phases for the /kanopus-magha1 story. Pure functions,
// no DOM and no three.js, so they are cheap to import and easy to test.
//
// The story is CHAPTERS tall blocks stacked vertically. Each block is
// CHAPTER_VH viewport-heights long. One 3D object belongs to each block and
// passes through: enter (rises in) -> hold (animates with `a`) -> exit (lifts
// away while the next object rises). Text opacity follows the block itself.

export const CHAPTERS = 4
export const CHAPTER_VH = 2.4

export interface Phase {
  visible: boolean
  /** 0..1, how far the object has risen in (already eased) */
  enter: number
  /** 0..1, progress of the object's own animation while it is held on screen */
  a: number
  /** 0..1, how far the object has lifted away (already eased) */
  exit: number
  /** 0..1, opacity of this chapter's text */
  text: number
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

/**
 * @param s  scroll distance in px measured from the top of the story block
 * @param vh viewport height in px
 * @param i  chapter index (0-based)
 */
export function phases(s: number, vh: number, i: number): Phase {
  const len = CHAPTER_VH * vh
  const u = (s - i * len) / len // 0 at the chapter's start, 1 at its end

  const first = i === 0
  const last = i === CHAPTERS - 1

  const enterT = clamp((u - (first ? -0.6 : -0.35)) / (first ? 0.6 : 0.45))
  const exitT = last ? 0 : clamp((u - 0.9) / 0.45)
  const a = clamp((u - 0.1) / 0.8)

  // Enter: fast at first, then settles. Exit: slow at first, then accelerates.
  // Using different curves stops the hand-off leaving an empty band on screen.
  const enter = 1 - Math.pow(1 - enterT, 2.4)
  const exit = Math.pow(exitT, 2.2)

  const text = clamp((u + 0.05) / 0.15) * clamp((1.05 - u) / 0.15)

  return {
    visible: enterT > 0 && exitT < 1,
    enter,
    a,
    exit,
    text,
  }
}
