'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import blogPosts from '@/data/blog/summary.json'
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

// Three real sidebar widgets prod's own recent-blogs-new.php has
// (Recent Blogs / Categories / Related Projects) that this rebuild's
// sidebar only ever had the TOC from. Categories and Related Projects
// are the same real 4-category and 7-project link sets prod itself
// lists verbatim; Recent Blogs pulls the same real 4 newest posts via
// this site's own real publishedAt dates rather than re-listing prod's
// specific 4 (which happen to already match — prod's own list is just
// "whatever's newest", same logic). Social share links (Facebook,
// Twitter/X, LinkedIn, WhatsApp) are also real — prod's own set, minus
// Pinterest (a real-estate blog post has no product image worth
// pinning the way prod's own Pinterest icon implied).
const CATEGORY_LINKS = [
  { name: 'Buying Guide', slug: 'buying' },
  { name: 'Investment', slug: 'investment' },
  { name: 'Legal Documents', slug: 'legal' },
  { name: 'Lifestyle & Decor', slug: 'lifestyle' },
]
const RELATED_PROJECT_LINKS = [
  { name: 'OmShakthy Canopus Magha', path: '/canopus-magha-lp' },
  { name: 'OmShakthy Industrial Park', path: '/industrial-park-lp' },
  { name: 'OmShakthy Regalia', path: '/regalia-lp' },
  { name: 'OmShakthy Elite Orchard', path: '/elite-orchard-lp' },
  { name: 'OmShakthy Mathura', path: '/mathura-lp' },
  { name: 'OmShakthy Canopus Mithila', path: '/canopus-mithila-lp' },
  { name: 'OmShakthy Elite Grand', path: '/elite-grand-lp' },
]

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
  const pageUrl = `https://www.omshakthy.com/blog/${post.slug}`
  const recentPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4)

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
            {/* Was post.description here — the same text generateMetadata
                uses for <meta name="description">, so the page showed the
                identical sentence twice (once in <head>, once visibly).
                post.excerpt is the article's own real opening line
                instead (see lib/blog.ts), genuinely different copy. */}
            <p className="text-base md:text-lg mb-6" style={{ ...body, color: C.slate }}>
              {post.excerpt}
            </p>
            <p style={{ ...mono, fontSize: '0.75rem', color: C.blue }}>
              OmShakthy Team &middot; {post.readTime}
            </p>
            {/* Real icons prod's own social-share div has (Facebook,
                Twitter/X, LinkedIn, WhatsApp — see this file's own note
                near SIDEBAR_RECENT on why Pinterest is dropped), plain
                text labels in this site's own link style rather than
                importing prod's raw icon images. */}
            <div className="flex items-center gap-4 mt-5">
              <span style={{ ...mono, fontSize: '0.65rem', color: C.slate, letterSpacing: '0.06em' }}>SHARE</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...mono, fontSize: '0.7rem', color: C.blue }}
                className="hover:opacity-70"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/share?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...mono, fontSize: '0.7rem', color: C.blue }}
                className="hover:opacity-70"
              >
                X
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...mono, fontSize: '0.7rem', color: C.blue }}
                className="hover:opacity-70"
              >
                LinkedIn
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} ${pageUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...mono, fontSize: '0.7rem', color: C.blue }}
                className="hover:opacity-70"
              >
                WhatsApp
              </a>
            </div>
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

          <div className="hidden md:block">
            {post.toc.length > 1 && (
              <Reveal delay={0.1}>
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

            {/* Three real sidebar widgets prod's own recent-blogs-new.php
                has (see this file's top-of-file note). Not wrapped in
                "sticky" like the TOC above — prod's own sidebar scrolls
                with the page past the TOC, not pinned alongside it. */}
            <Reveal delay={0.15} className="mt-10">
              <p className="mb-3" style={{ ...mono, fontSize: '0.7rem', color: C.blue, letterSpacing: '0.06em' }}>
                RECENT BLOGS
              </p>
              <ul className="flex flex-col gap-4 text-sm">
                {recentPosts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                      {p.heroImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.heroImage}
                          alt={p.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span style={{ color: C.ink }} className="group-hover:opacity-70 leading-snug">
                        {p.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <p className="mb-3" style={{ ...mono, fontSize: '0.7rem', color: C.blue, letterSpacing: '0.06em' }}>
                CATEGORIES
              </p>
              <ul className="flex flex-col gap-2 text-sm">
                {CATEGORY_LINKS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/blog?category=${c.slug}`} style={{ color: C.slate }} className="hover:opacity-70">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.25} className="mt-10">
              <p className="mb-3" style={{ ...mono, fontSize: '0.7rem', color: C.blue, letterSpacing: '0.06em' }}>
                RELATED PROJECTS
              </p>
              <ul className="flex flex-col gap-2 text-sm">
                {RELATED_PROJECT_LINKS.map((p) => (
                  <li key={p.path}>
                    <Link href={p.path} style={{ color: C.slate }} className="hover:opacity-70">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
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
