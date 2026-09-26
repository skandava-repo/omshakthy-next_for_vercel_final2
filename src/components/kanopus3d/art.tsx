// Flat illustrations shown in place of the 3D objects on phones, with reduced
// motion, or when WebGL is unavailable. Server components, plain SVG, no JS.
// Same white and blue as the 3D scenes and the About page.

const INK = '#0B1F3A'
const BLUE = '#0D6BB2'
const DEEP = '#004385'
const MIST = '#7DB4EB'
const PANEL = '#E9F1F9'
const SLAB = '#E3EEF9'
const SAGE = '#7FA88F'
const LINE = 'rgba(13,107,178,0.18)'

export function ArtLand() {
  const blocks: [number, number][] = [[22, 105], [115, 205], [215, 305], [315, 398]]
  const halves: [number, number][] = [[22, 152], [172, 300]]
  const rects: { x: number; y: number; w: number; h: number; hi: boolean }[] = []
  blocks.forEach(([x0, x1], bi) =>
    halves.forEach(([y0, y1], hi) => {
      const w = (x1 - x0) / 3
      const h = (y1 - y0) / 3
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
          rects.push({ x: x0 + i * w + 2, y: y0 + j * h + 2, w: w - 4, h: h - 4, hi: bi === 2 && hi === 1 && i === 1 && j === 1 })
    }),
  )
  return (
    <svg viewBox="0 0 420 320" role="img" aria-label="Plan of the plotted layout with roads and plots" width="100%">
      <rect x="6" y="6" width="408" height="308" rx="22" fill={SLAB} stroke={LINE} />
      <rect x="10" y="160" width="400" height="10" fill={INK} />
      {[110, 210, 310].map((x) => (
        <rect key={x} x={x} y="14" width="8" height="292" fill={INK} />
      ))}
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="2" fill={r.hi ? BLUE : '#fff'} />
      ))}
    </svg>
  )
}

export function ArtDeed() {
  return (
    <svg viewBox="0 0 320 400" role="img" aria-label="A title deed showing CMDA and DTCP approval and a gold seal" width="100%" style={{ maxWidth: 360 }}>
      <rect x="22" y="22" width="276" height="360" rx="16" fill={PANEL} />
      <rect x="12" y="12" width="276" height="360" rx="16" fill="#fff" stroke={LINE} />
      <path d="M12 28a16 16 0 0 1 16-16h244a16 16 0 0 1 16 16v50H12z" fill={DEEP} />
      <text x="34" y="46" fill="#fff" fontSize="15" fontWeight="600">OMSHAKTHY</text>
      <text x="34" y="66" fill="#9CCBF7" fontSize="11">TITLE DEED</text>
      <text x="34" y="122" fill={INK} fontSize="28" fontFamily="Georgia, serif">Kanopus Magha</text>
      {['CMDA approved', 'DTCP approved', 'Litigation-free, clear title'].map((t, i) => (
        <g key={t} transform={`translate(34 ${170 + i * 44})`}>
          <circle cx="12" cy="0" r="11" fill="none" stroke={BLUE} strokeWidth="2" />
          <path d="M6 1l4 4 8-9" fill="none" stroke={BLUE} strokeWidth="2" />
          <text x="34" y="5" fill={INK} fontSize="15">{t}</text>
        </g>
      ))}
      <circle cx="238" cy="330" r="30" fill="#C9A227" />
      <circle cx="238" cy="330" r="23" fill="none" stroke="#fff" strokeOpacity=".6" />
      <path d="M226 331l9 9 17-19" fill="none" stroke={INK} strokeWidth="4" />
    </svg>
  )
}

export function ArtRoutes() {
  const site = { x: 110, y: 190 }
  const dests = [
    { x: 330, y: 80, t: 'Railway Station · 5 min' },
    { x: 320, y: 240, t: 'Metro (proposed) · 5 min' },
    { x: 210, y: 40, t: 'Bus Depot · 5 min' },
  ]
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label="Routes from the site to Avadi railway station, metro and bus depot, about five minutes each" width="100%">
      <rect x="6" y="6" width="408" height="288" rx="22" fill={SLAB} stroke={LINE} />
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1="14" x2="406" y1={y} y2={y} stroke={MIST} strokeOpacity=".5" />
      ))}
      {dests.map((d) => (
        <g key={d.t}>
          <path d={`M${site.x} ${site.y} Q ${(site.x + d.x) / 2} ${Math.min(site.y, d.y) - 30} ${d.x} ${d.y}`} fill="none" stroke={BLUE} strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx={d.x} cy={d.y} r="9" fill={INK} />
          <text x={d.x} y={d.y - 16} textAnchor="middle" fontSize="12" fill={INK}>{d.t}</text>
        </g>
      ))}
      <circle cx={site.x} cy={site.y} r="14" fill={BLUE} />
      <circle cx={site.x} cy={site.y} r="26" fill="none" stroke={BLUE} strokeOpacity=".4" />
    </svg>
  )
}

export function ArtCommunity() {
  const trees = [[70, 70], [110, 250], [200, 60], [330, 230], [360, 120], [60, 180], [280, 70], [150, 230], [385, 220]]
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label="Community layout with a pond, trees, clubhouse and entrance arch" width="100%">
      <rect x="6" y="6" width="408" height="288" rx="22" fill={SLAB} stroke={LINE} />
      <ellipse cx="200" cy="150" rx="70" ry="45" fill={MIST} />
      {trees.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="14" fill={SAGE} />
      ))}
      <rect x="240" y="30" width="90" height="46" rx="4" fill="#fff" />
      <rect x="236" y="26" width="98" height="8" rx="2" fill={DEEP} />
      <rect x="176" y="262" width="10" height="26" fill="#fff" stroke={LINE} />
      <rect x="234" y="262" width="10" height="26" fill="#fff" stroke={LINE} />
      <rect x="172" y="256" width="76" height="8" rx="2" fill={BLUE} />
    </svg>
  )
}
