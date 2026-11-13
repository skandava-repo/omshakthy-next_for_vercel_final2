'use client'

// "Latest Blogs" — the old live site's homepage had a real blog
// preview strip our rebuild never recreated. Prod's own 4 featured
// slugs (A-Register, Assignment Deed, Deed of Declaration, Best Areas
// to Buy a Plot in Tambaram) are now real posts in our dataset too —
// added in a later pass once a sitemap diff turned them up as
// completely missing pages, not substitutes. Card markup/classes are
// new (scoped to this file, not reusing BlogListingContent's .bp__card
// globally), but the same photo-top/category/title/byline shape
// already established there.
import Link from 'next/link'
import { motion } from 'framer-motion'
import blogPosts from '@/data/blog/summary.json'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  gold: '#C9A227',
  border: 'rgba(13, 107, 178, 0.12)',
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

const FEATURED_SLUGS = [
  'a-register-meaning-importance-and-how-to-check-it',
  'assignment-deed-meaning-types-process-format-and-legal-importance',
  'deed-of-declaration-meaning-importance-format-and-registration-process',
  'best-areas-to-buy-a-plot-in-tambaram',
]

export default function HomeLatestBlogsSection() {
  const posts = FEATURED_SLUGS
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)

  return (
    <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <Reveal>
            <Kicker color={C.blue}>From the Blog</Kicker>
            <h2 className="text-2xl md:text-4xl mt-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Latest Blogs
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/blog" className="text-sm font-semibold" style={{ color: C.blue }}>
              View all articles →
            </Link>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="block h-full rounded-xl overflow-hidden"
                style={{ border: `1px solid ${C.border}`, backgroundColor: '#fff' }}
              >
                {post.heroImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.heroImage} alt={post.title} className="w-full h-40 object-cover" loading="lazy" />
                )}
                <div className="p-5">
                  <span style={{ ...mono, color: C.blue, fontSize: '0.65rem' }}>{post.category}</span>
                  <h3 className="text-base mt-3 mb-2" style={{ ...display, color: C.ink, fontWeight: 500, lineHeight: 1.25 }}>
                    {post.title}
                  </h3>
                  <span className="text-xs" style={{ color: C.slate }}>{post.readTime}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
