'use client'

// Motion building blocks for /kanopus-magha1. They use the same vocabulary as
// the site's About page (focus-pull reveal, word-by-word heading rise, curtain
// image reveal, count-up figures, scroll parallax), all built on framer-motion,
// which the project already ships. Each one renders plain, complete HTML on the
// server and only animates after hydration.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion, useInView, animate, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export const ease = [0.16, 1, 0.3, 1] as const

// false on the server and during hydration, true afterwards. Lets each helper
// render complete static HTML first, then start animating.
const noSubscribe = () => () => {}
function useHydrated() {
  return useSyncExternalStore(noSubscribe, () => true, () => false)
}

/** Focus-pull reveal: fades up while settling from a slight blur and scale. */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
  y = 28,
  blur = true,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
  y?: number
  /** set false for wrappers around backdrop-filter (glass) children */
  blur?: boolean
}) {
  const mounted = useHydrated()
  const reduce = useReducedMotion()
  if (!mounted || reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={blur ? { opacity: 0, y, scale: 0.96, filter: 'blur(6px)' } : { opacity: 0, y }}
      whileInView={blur ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Heading whose words rise one by one out of their own mask. */
export function Kinetic({
  text,
  as = 'h2',
  className,
  style,
  delay = 0,
  onLoad = false,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  style?: React.CSSProperties
  delay?: number
  /** animate immediately on load (hero) instead of when scrolled into view */
  onLoad?: boolean
}) {
  const mounted = useHydrated()
  const reduce = useReducedMotion()
  const Tag = as
  if (!mounted || reduce) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    )
  }
  const words = text.split(' ')
  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.18em', marginBottom: '-0.18em' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '112%', rotate: 4 }}
            {...(onLoad ? { animate: { y: '0%', rotate: 0 } } : { whileInView: { y: '0%', rotate: 0 }, viewport: { once: true, margin: '-10%' } })}
            transition={{ duration: 0.85, delay: delay + i * 0.09, ease }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Photo entrance: a panel wipes away right-to-left while the image settles from a zoom. */
export function ImageReveal({
  src,
  alt = '',
  sizes,
  imgClassName = 'object-cover',
  curtain = '#E9F1F9',
  priority = false,
}: {
  src: string
  alt?: string
  sizes: string
  imgClassName?: string
  curtain?: string
  priority?: boolean
}) {
  const mounted = useHydrated()
  const reduce = useReducedMotion()
  const animated = mounted && !reduce
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={animated ? { scale: 1.15 } : false}
        whileInView={animated ? { scale: 1 } : undefined}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.4, ease }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className={imgClassName} preload={priority} />
      </motion.div>
      {animated && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: curtain, transformOrigin: 'right' }}
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </div>
  )
}

/** Slow crossfade slideshow that fills its (positioned) parent. */
export function AutoSlide({ images, alt, sizes, interval = 4800 }: { images: string[]; alt: string; sizes: string; interval?: number }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce || images.length < 2) return
    const t = setInterval(() => setActive((a) => (a + 1) % images.length), interval)
    return () => clearInterval(t)
  }, [images.length, interval, reduce])
  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? alt : ''}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1.04)' : 'scale(1)', transition: 'opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 6s cubic-bezier(0.16,1,0.3,1)' }}
        />
      ))}
    </div>
  )
}

/** Photo with live scroll parallax inside a rounded frame. */
export function ParallaxPhoto({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-x-0 h-[124%]" style={{ top: '-12%', y }}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  )
}

/** Slow Ken Burns drift for the hero photo. */
export function HeroBg({ src, sizes = '100vw' }: { src: string; sizes?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.03 }}
      animate={reduce ? undefined : { scale: 1.12 }}
      transition={{ duration: 24, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
    >
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" preload />
    </motion.div>
  )
}

/** Number that counts up when scrolled into view. Server renders the final value. */
export function CountUp({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useReducedMotion()
  const fmt = (n: number) =>
    prefix + n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  const [val, setVal] = useState<number | null>(null)
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, reduce, to])
  return <span ref={ref}>{fmt(val ?? to)}</span>
}

/** Proximity bar that grows to `ratio` (0..1) when scrolled into view. */
export function Bar({ ratio, delay = 0 }: { ratio: number; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: 'rgba(13,107,178,0.14)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg,#004385,#0D6BB2 55%,#7DB4EB)', transformOrigin: 'left', width: `${Math.max(4, ratio * 100)}%` }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.4, delay, ease }}
      />
    </div>
  )
}

/** Endless horizontal ticker. Children are repeated once so the loop seams at 50%. */
export function Marquee({ children, seconds = 60 }: { children: React.ReactNode; seconds?: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: seconds, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
