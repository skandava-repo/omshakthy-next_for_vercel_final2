import fs from 'fs'
import path from 'path'

// Real content extracted from the live site's own
// /buy-cmda-dtcp-plots-for-sale-chennai/* pages — these are 12
// currently-indexed URLs (per Balaji's Aug 2026 indexed-URL report)
// that the Next.js rebuild had never recreated. Same pattern as
// src/lib/projects.ts and src/lib/blog.ts: one JSON file per page,
// read here, never bundled into client JS as a whole directory.

export interface LocationFaqItem {
  q: string
  a: string
}

export interface LocationPageData {
  slug: string
  locationName: string
  heading: string
  metaTitle: string
  metaDescription: string
  intro: string[]
  connectivity?: string[]
  amenities?: string[]
  featuredProjects: string[]
  faq: LocationFaqItem[]
}

export interface LocationHubData extends LocationPageData {
  amenitiesIntro: string
  purchaseSteps: { title: string; text: string }[]
  mistakesToAvoid: string[]
}

const DATA_DIR = path.join(process.cwd(), 'src/data/locations')

export function getAllLocationSlugs(): string[] {
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json') && f !== '_hub.json')
    .map((f) => f.replace(/\.json$/, ''))
}

export function getLocationData(slug: string): LocationPageData | null {
  const file = path.join(DATA_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as LocationPageData
  } catch {
    return null
  }
}

export function getLocationHubData(): LocationHubData {
  const file = path.join(DATA_DIR, '_hub.json')
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as LocationHubData
}
