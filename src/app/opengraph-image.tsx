import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Sitewide default social-share preview — every page inherits this
// unless it colocates its own opengraph-image, since none of the
// per-page metadata blocks set an explicit openGraph.images. Statically
// generated once at build time (no per-request data), so it costs
// nothing at runtime.
export const alt = 'OmShakthy Homes — Generating Real Assets Since 1991'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/decor/logo-og.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #004385 0%, #0D6BB2 100%)',
          position: 'relative',
        }}
      >
        {/* Faint gold glow, same radial device the real hero sections
            use, rather than a flat rectangle. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'radial-gradient(120% 90% at 50% 100%, rgba(201,162,39,0.22) 0%, rgba(201,162,39,0) 60%)',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={150} height={150} style={{ objectFit: 'contain' }} />
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          OmShakthy Homes
        </div>
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ width: 34, height: 3, background: '#C9A227', borderRadius: 999, display: 'flex' }} />
          <div
            style={{
              fontSize: 26,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#C9A227',
              fontWeight: 700,
            }}
          >
            Generating Real Assets Since 1991
          </div>
          <div style={{ width: 34, height: 3, background: '#C9A227', borderRadius: 999, display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
