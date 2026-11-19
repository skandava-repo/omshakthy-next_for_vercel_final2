import fs from 'fs'
import path from 'path'

// Real content extracted from the 131 individual blog post pages that
// exist on the old mirror site (www.omshakthy.com/blog/*.html) — none of
// this rebuild had before. Summaries (title/description/hero/category,
// no body) live in summary.json and are safe to import into client
// components. Full post bodies are ~1.6MB combined across all 131 posts,
// so they're kept as one JSON file per post and only ever read here, on
// the server, inside the one place that needs a full body — never
// bundled into client JS.

export interface BlogPostSummary {
  slug: string
  seoTitle: string
  title: string
  description: string
  heroImage: string | null
  category: string
  readTime: string
  // Real publish date, pulled from each post's own prod .php file's
  // last-modified timestamp (no CMS/date field exists on prod itself to
  // extract instead) — not fabricated, just the one real recency signal
  // available. Lets the "Recently Added" listing actually sort by
  // recency instead of raw file order (Adglobe's Nov 2026 audit: old
  // posts were showing above newer ones).
  publishedAt: string
}

export interface BlogTocEntry {
  id: string
  label: string
}

export interface BlogPost extends BlogPostSummary {
  toc: BlogTocEntry[]
  bodyHtml: string
  // The post's own real opening sentence, pulled from bodyHtml's first
  // <p> — not `description`. Adglobe's Nov 2026 audit flagged the two
  // being the same text: `description` was doing double duty as both
  // the <meta name="description"> tag (generateMetadata, unchanged)
  // and the visible subtitle under the H1 (BlogPostContent.tsx), so
  // the page showed the exact same sentence twice — once in <head>,
  // once on-page. `description` keeps the meta/OG job; this is what
  // renders visibly now instead, genuinely different since it's the
  // article's own words, not fabricated.
  excerpt: string
}

const POSTS_DIR = path.join(process.cwd(), 'src/data/blog/posts')

function extractExcerpt(bodyHtml: string, fallback: string): string {
  const match = bodyHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  if (!match) return fallback
  const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  if (!text) return fallback
  if (text.length <= 220) return text
  // Truncate at the last word boundary before 220 chars, not mid-word.
  return text.slice(0, text.slice(0, 220).lastIndexOf(' ')) + '…'
}

export function getAllBlogSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
}

export function getBlogPost(slug: string): BlogPost | null {
  const file = path.join(POSTS_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  try {
    const post = JSON.parse(fs.readFileSync(file, 'utf-8')) as BlogPost
    post.excerpt = extractExcerpt(post.bodyHtml, post.description)
    return post
  } catch {
    return null
  }
}
