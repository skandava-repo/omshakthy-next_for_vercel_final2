import Link from 'next/link'
import './Breadcrumbs.css'

// Real UI element prod has (residential-land-plots.php etc.: "Home >
// Buy CMDA DTCP Plots For Sale Chennai > Residential Lands", plain text
// trail right under the header) that this rebuild only ever generated
// as invisible JSON-LD (getBreadcrumbSchema) — the schema was real, the
// visible trail wasn't. Adglobe's Nov 2026 audit flagged visible
// breadcrumbs as one of the rebuild's "missing essentials". Takes the
// exact same {name, path}[] each page already builds for its schema
// call, so there's only ever one breadcrumb trail to keep in sync.
//
// Fixed-position overlay (see Breadcrumbs.css) sitting in the ~58px
// gap every hero section already has between the header and its own
// heading — not an in-flow element, so it adds no height anywhere and
// doesn't touch any existing section's own top padding. Plain
// small-caps mono text, the same font/size/color tokens Kicker's own
// eyebrow label already uses sitewide — not a new visual language,
// just prod's own simple "A / B / C" trail dressed in this site's
// existing type system.
//
// `inline` is the one exception: on project landing pages (user
// feedback on Elite Grand specifically) the fixed overlay sat awkwardly
// over the ~88vh hero video/image with nothing to visually anchor it
// to — moved to a plain in-flow strip right between Hero and
// Specifications there instead, dark text on a light band so it reads
// regardless of whichever color each section around it happens to use.
export default function Breadcrumbs({
  items,
  inline = false,
}: {
  items: { name: string; path: string }[]
  inline?: boolean
}) {
  if (items.length < 2) return null
  return (
    <nav aria-label="Breadcrumb" className={inline ? 'px-6 md:px-16 py-3' : 'breadcrumbs px-6 md:px-16'} style={inline ? { backgroundColor: '#F8F8F5' } : undefined}>
      <ol
        className={`max-w-6xl mx-auto flex flex-wrap items-center gap-x-2 gap-y-1 ${inline ? '' : 'pt-3'}`}
        style={{
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.04em',
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const activeColor = inline ? '#0D6BB2' : '#7DB4EB'
          const linkColor = inline ? '#64748B' : 'rgba(248,248,245,0.6)'
          const sepColor = inline ? '#64748B' : 'rgba(248,248,245,0.35)'
          return (
            <li key={item.path} className="flex items-center gap-x-2">
              {isLast ? (
                <span style={{ color: activeColor }} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} style={{ color: linkColor }} className="hover:opacity-80">
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" style={{ color: sepColor }}>
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
