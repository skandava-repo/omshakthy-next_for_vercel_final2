'use client'

// Shared template for /ongoing-projects, /upcoming-projects, and
// /completed-projects — 3 real, indexed URLs (Balaji's Aug 2026 SEO
// report) that had never been built. Rather than re-typing project
// data a third time, this reuses the one real dataset ProjectsContent.tsx
// already exports (Project[]), filtered by status per page. Narrative
// copy and FAQs are each page's own real content from the old site's
// own *-projects.html (via the local mirror). Same C palette / Reveal /
// Kicker / FAQ-accordion pattern as LocationPageContent.tsx.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/lib/projectsData'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '919150088097'

const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10%' }}
    transition={{ duration: 0.7, delay, ease }}
  >
    {children}
  </motion.div>
)

const Kicker = ({ children, color = C.blue }: { children: React.ReactNode; color?: string }) => (
  <div>
    <span style={{ ...mono, color }}>{children}</span>
    <span aria-hidden style={{ display: 'block', width: 34, height: 2.5, borderRadius: 999, background: C.gold, marginTop: 8 }} />
  </div>
)

export interface NarrativeSection {
  heading: string
  text: string
}

export interface FaqItem {
  q: string
  a: string
}

export default function ProjectStatusPageContent({
  kicker,
  title,
  intro,
  projects,
  videoIds,
  narrativeSections,
  faq,
  ctaText,
}: {
  kicker: string
  title: string
  intro: string
  projects?: Project[]
  videoIds?: string[]
  narrativeSections: NarrativeSection[]
  faq: FaqItem[]
  ctaText: string
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>{kicker}</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              {title}
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              {intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Project cards (Ongoing/Completed only) ---------------- */}
      {projects && projects.length > 0 && (
        <section className="px-6 md:px-16 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => {
              const card = (
                <div
                  className="h-full rounded-2xl overflow-hidden"
                  style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
                >
                  <div className="relative" style={{ aspectRatio: '4/3' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg mb-1" style={{ ...display, color: C.ink, fontWeight: 500 }}>{p.name}</h3>
                    <p className="text-sm mb-2" style={{ color: C.slate }}>{p.location}</p>
                    <p className="text-sm font-semibold" style={{ color: C.blue }}>{p.price}</p>
                  </div>
                </div>
              )
              return (
                <Reveal key={p.name} delay={(i % 3) * 0.08}>
                  {p.link ? <Link href={p.link} className="block h-full">{card}</Link> : card}
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* ---------------- Project videos (Completed only) ---------------- */}
      {videoIds && videoIds.length > 0 && (
        <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-10 text-center">
              <Kicker color={C.blue}>See Them for Yourself</Kicker>
              <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                Project Videos
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoIds.map((id, i) => (
                <Reveal key={id} delay={(i % 3) * 0.08}>
                  <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#000', aspectRatio: '16/9' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${id}?rel=0`}
                      title="OmShakthy Homes project video"
                      className="w-full h-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Narrative ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: projects && projects.length > 0 ? C.panel : undefined }}>
        <div className="max-w-4xl mx-auto space-y-14">
          {narrativeSections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.07}>
              <Kicker>{s.heading}</Kicker>
              <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-10">
            <Kicker>Common Questions</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div className="space-y-3">
            {faq.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={f.q} delay={(i % 6) * 0.04}>
                  <div className="rounded-xl p-5" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left"
                    >
                      <h3 className="text-base md:text-lg" style={{ ...display, color: C.ink, fontWeight: 500 }}>{f.q}</h3>
                      <span
                        aria-hidden
                        className="flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ width: 28, height: 28, border: `1px solid ${C.gold}`, color: C.gold, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}
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
                          transition={{ duration: 0.3, ease }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p className="pt-3 text-sm" style={{ ...body, color: C.slate }}>{f.a}</p>
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

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.ink }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              {ctaText}
            </h2>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hi, I'd like to know more about ${title.toLowerCase()} at OmShakthy Homes.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold"
              style={{ ...body, backgroundColor: C.gold, color: C.ink }}
            >
              Enquire on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
