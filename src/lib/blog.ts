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
}

export interface BlogTocEntry {
  id: string
  label: string
}

export interface BlogPost extends BlogPostSummary {
  toc: BlogTocEntry[]
  bodyHtml: string
}

const POSTS_DIR = path.join(process.cwd(), 'src/data/blog/posts')

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
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as BlogPost
  } catch {
    return null
  }
}
