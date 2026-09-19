import fs from 'fs'
import path from 'path'

// Real content extracted from each project's own landing page on the
// old mirror site (www.omshakthy.com/<slug>-lp.html) — see
// src/data/projects/*.json. Same pattern as src/lib/blog.ts.

export interface ProjectSpec {
  label: string
  value: string
}

export interface ProjectNarrativeSection {
  heading: string
  paragraphs: string[]
}

export interface ProjectFaqItem {
  q: string
  a: string
}

export interface ProjectData {
  slug: string
  name: string
  type: string | null
  heroImage: string
  specs: ProjectSpec[]
  amenitiesIntro: string
  amenities: string[]
  connectivityIntro: string
  connectivity: string[]
  tagline: string
  narrativeIntro: string[]
  narrativeSections: ProjectNarrativeSection[]
  faq: ProjectFaqItem[]
  mapIframe: string | null
}

const DATA_DIR = path.join(process.cwd(), 'src/data/projects')

export function getAllProjectSlugs(): string[] {
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
}

export function getProjectData(slug: string): ProjectData | null {
  const file = path.join(DATA_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as ProjectData
  } catch {
    return null
  }
}
