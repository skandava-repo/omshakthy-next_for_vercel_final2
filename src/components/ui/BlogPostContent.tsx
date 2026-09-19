'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import './BlogPostContent.css'

/* BlogPostContent — same C/display/body/mono/Reveal pattern every other
   content page in this site duplicates locally (AboutContent.tsx,
   ProjectsContent.tsx, ContactContent.tsx, RegaliaContent.tsx). Body
   content itself is real: extracted straight from the matching post on
   the old mirror site (www.omshakthy.com/blog/<slug>.html) — headings,
   paragraphs, lists and internal links all word-for-word, not rewritten.
   Two things the old page had that this one honestly can't reproduce:
   a publish date (never existed anywhere in that page's own markup, so
   showing one here would just be inventing it — see the RERA-ID/address
   fabrication this project already got flagged and fixed for once) and
   a named byline (same "OmShakthy Team" convention BlogListingContent.tsx
   already uses for the same reason). Read time is real, computed from
   this post's own word count, not invented either. */

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif" }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '919150088097'

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

const Kicker = ({ children, color = C.blue }: { children: React.ReactNode; color?: string }) => (
  <p className="mb-4" style={{ ...mono, fontSize: '1.0rem', letterSpacing: '0.08em', color }}>
    {children}
  </p>
)

export default function BlogPostContent({ post, related }: { post: BlogPost; related: { slug: string; title: string }[] }) {
  const whatsappText = encodeURIComponent(
    `Hi, I read "${post.title}" on the OmShakthy blog and had a question about it.`
  )

  return (
    <div style={{ backgroundColor: '#F8F8F5' }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-36 pb-16" style={{ backgroundColor: C.panel }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <Link href="/blog" className="inline-block mb-6 text-sm hover:opacity-70" style={{ ...body, color: C.blue }}>
              &larr; Back to Blog
            </Link>
            <Kicker>{post.category}</Kicker>
            <h1 className="text-3xl md:text-5xl mb-6" style={{ ...display, color: C.ink, lineHeight: 1.15 }}>
              {post.title}
            </h1>
            <p className="text-base md:text-lg mb-6" style={{ ...body, color: C.slate }}>
              {post.description}
            </p>
            <p style={{ ...mono, fontSize: '0.75rem', color: C.blue }}>
              OmShakthy Team &middot; {post.readTime}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Hero image ---------------- */}
      {post.heroImage && (
        <Reveal className="px-6 md:px-16 -mt-10">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.heroImage} alt={post.title} className="w-full h-auto block" />
          </div>
        </Reveal>
      )}

      {/* ---------------- Body + TOC ---------------- */}
      <section className="px-6 md:px-16 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_220px] gap-12">
          <Reveal
            className="blog-post-body"
            style={{ ...body, color: C.ink }}
          >
            <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          </Reveal>

          {post.toc.length > 1 && (
            <Reveal delay={0.1} className="hidden md:block">
              <div className="sticky top-28">
                <p className="mb-3" style={{ ...mono, fontSize: '0.7rem', color: C.blue, letterSpacing: '0.06em' }}>
                  ON THIS PAGE
                </p>
                <ul className="flex flex-col gap-2 text-sm" style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: '1rem' }}>
                  {post.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} style={{ color: C.slate }} className="hover:opacity-70">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------------- Related posts (real, same corpus) ---------------- */}
      {related.length > 0 && (
        <section className="px-6 md:px-16 py-16" style={{ backgroundColor: C.panel }}>
          <div className="max-w-5xl mx-auto">
            <Kicker>Keep Reading</Kicker>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block p-5 rounded-xl hover:opacity-80"
                  style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
                >
                  <p className="text-sm" style={{ ...display, color: C.ink }}>{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.blueDeep }}>
        <Reveal className="max-w-xl mx-auto">
          <p style={{ ...display, fontSize: '1.6rem', color: '#fff' }} className="mb-6">
            Have a question about this?
          </p>
          <a
            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full"
            style={{ ...mono, fontSize: '0.85rem', backgroundColor: '#fff', color: C.blueDeep }}
          >
            Chat With Us on WhatsApp
          </a>
        </Reveal>
      </section>
    </div>
  )
}
