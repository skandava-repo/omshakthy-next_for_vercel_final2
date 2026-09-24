'use client'

// Real content: the same 6 YouTube videos embedded on the old live
// site's own video-gallery.html (via the local site mirror) — the
// company's real project/construction videos, not invented. Same C
// palette / Reveal / Kicker pattern as LocationPageContent.tsx.
import { motion } from 'framer-motion'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const

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

// Same 6 real video IDs the old site embeds on both video-gallery.html
// and completed-projects.html.
const VIDEO_IDS = ['qqQ5WKXB2PE', 'FKmFjEt1eO4', 'RtRb_UKNJgo', 'S1L7Gix0l_M', 'Uoe77mhNe30', 'gduULdE1jFI']

export default function VideoGalleryContent() {
  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Construction &amp; Project Videos</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Video Gallery
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              A closer look at OmShakthy Homes&rsquo; projects, in motion.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Video grid ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {VIDEO_IDS.map((id, i) => (
            <Reveal key={id} delay={(i % 2) * 0.1}>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#000', border: `1px solid ${C.border}`, aspectRatio: '16/9' }}>
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
      </section>
    </main>
  )
}
