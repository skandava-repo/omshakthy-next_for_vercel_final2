// The four 3D objects of the Kanopus Magha story. Nothing is downloaded: every
// object is assembled from primitives, and the "paper" on the deed is drawn
// with the Canvas 2D API. Each builder returns a group plus an update(a)
// function where `a` is 0..1 progress of that object's own animation.

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

type Disposable = { dispose(): void }

export type Palette = Record<
  'slab' | 'slab2' | 'ivory' | 'ink' | 'accent' | 'accentGlow' | 'gold' | 'water' | 'sage' | 'trunk',
  THREE.MeshStandardMaterial
>

export interface Ctx {
  /** Register a GPU resource so destroy() can release it. */
  own<T extends Disposable>(x: T): T
  mat: Palette
  aniso: number
  /** CSS font-family lists for text drawn on canvas textures */
  fonts: { display: string; sans: string }
}

export interface Built {
  group: THREE.Group
  update(a: number): void
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (t: number) => {
  const c = clamp01(t)
  return c * c * (3 - 2 * c)
}
/** Eased progress of `a` between `from` and `to`. */
const seg = (a: number, from: number, to: number) => smooth((a - from) / (to - from))
/** Deterministic pseudo-random number in 0..1 (same every load). */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function makePalette(own: Ctx['own']): Palette {
  const m = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
    own(new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...o }))
  return {
    slab: m('#E3EEF9', { roughness: 0.55 }),
    slab2: m('#D3E4F5', { roughness: 0.5 }),
    ivory: m('#FFFFFF', { roughness: 0.55 }),
    ink: m('#0B1F3A', { roughness: 0.5 }),
    accent: m('#0D6BB2', { roughness: 0.4, metalness: 0.1 }),
    accentGlow: m('#2C8AD6', { roughness: 0.35, metalness: 0.2, emissive: '#0D6BB2', emissiveIntensity: 0.35 }),
    gold: m('#C9A227', { roughness: 0.3, metalness: 0.85 }),
    water: m('#7DB4EB', { roughness: 0.15, metalness: 0.1 }),
    sage: m('#7FA88F', { roughness: 0.8 }),
    trunk: m('#8A7560', { roughness: 0.9 }),
  }
}

const rbox = (c: Ctx, w: number, h: number, d: number, mat: THREE.Material, r = 0.05) =>
  new THREE.Mesh(c.own(new RoundedBoxGeometry(w, h, d, 3, r)), mat)
const pbox = (c: Ctx, w: number, h: number, d: number, mat: THREE.Material) =>
  new THREE.Mesh(c.own(new THREE.BoxGeometry(w, h, d)), mat)

function canvasTexture(c: Ctx, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const g = cv.getContext('2d')!
  draw(g)
  const t = c.own(new THREE.CanvasTexture(cv))
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = c.aniso
  return t
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

/* ------------------------------------------------------------------ */
/* 1. LAND: a plotted layout whose plots rise one after another        */
/* ------------------------------------------------------------------ */
export function buildLand(c: Ctx): Built {
  const g = new THREE.Group()
  g.rotation.x = 0.5

  const base = rbox(c, 8.6, 0.3, 6.4, c.mat.slab, 0.1)
  base.position.y = -0.15
  g.add(base)

  const road = (w: number, d: number, x: number, z: number) => {
    const m = pbox(c, w, 0.02, d, c.mat.ink)
    m.position.set(x, 0.011, z)
    g.add(m)
  }
  road(8.2, 0.32, 0, 0)
  for (const x of [-2.2, 0, 2.2]) road(0.28, 6.0, x, 0)

  interface Plot { x: number; z: number; w: number; d: number; h: number; delay: number; feat: boolean }
  const plots: Plot[] = []
  const blocks: [number, number][] = [[-4.0, -2.2], [-2.2, 0], [0, 2.2], [2.2, 4.0]]
  const halves: [number, number][] = [[-2.95, -0.28], [0.28, 2.95]]
  for (const [x0, x1] of blocks) {
    for (const [z0, z1] of halves) {
      const ux0 = x0 + 0.22
      const ux1 = x1 - 0.22
      const uz0 = z0 + 0.05
      const uz1 = z1 - 0.05
      const cw = (ux1 - ux0) / 3
      const cd = (uz1 - uz0) / 3
      for (let ix = 0; ix < 3; ix++) {
        for (let iz = 0; iz < 3; iz++) {
          plots.push({
            x: ux0 + cw * (ix + 0.5),
            z: uz0 + cd * (iz + 0.5),
            w: cw - 0.07,
            d: cd - 0.07,
            h: 0.14 + rnd(plots.length) * 0.05,
            delay: 0,
            feat: false,
          })
        }
      }
    }
  }
  const maxD = Math.max(...plots.map((p) => Math.hypot(p.x, p.z * 1.2)))
  plots.forEach((p) => (p.delay = Math.hypot(p.x, p.z * 1.2) / maxD))

  // Three highlighted plots; the first one lifts at the end ("your plot").
  const nearest = (tx: number, tz: number) =>
    plots.reduce((best, p) => (Math.hypot(p.x - tx, p.z - tz) < Math.hypot(best.x - tx, best.z - tz) ? p : best), plots[0])
  const featured = [nearest(1.1, 1.3), nearest(-1.1, -1.3), nearest(3.0, -1.4)]
  featured.forEach((p) => (p.feat = true))

  const geo = c.own(new THREE.BoxGeometry(1, 1, 1))
  geo.translate(0, 0.5, 0)
  const plotMat = c.own(new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.6 }))
  const mesh = new THREE.InstancedMesh(geo, plotMat, plots.length)
  mesh.frustumCulled = false
  const tint = new THREE.Color()
  plots.forEach((p, i) => {
    if (p.feat) tint.set('#0D6BB2')
    else tint.set('#FFFFFF').lerp(new THREE.Color('#DCE8F5'), rnd(i + 40) * 0.8)
    mesh.setColorAt(i, tint)
  })
  g.add(mesh)

  const dummy = new THREE.Object3D()
  return {
    group: g,
    update(a) {
      plots.forEach((p, i) => {
        const t = smooth((a - 0.04 - p.delay * 0.5) / 0.3)
        let h = Math.max(0.001, p.h * t)
        if (p.feat && p === featured[0]) h += 0.42 * seg(a, 0.78, 0.98) * t
        dummy.position.set(p.x, 0, p.z)
        dummy.scale.set(p.w, h, p.d)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      g.rotation.y = lerp(-0.6, 0.3, smooth(a))
    },
  }
}

/* ------------------------------------------------------------------ */
/* 2. TITLE: a title deed with approvals, sealed at the end            */
/* ------------------------------------------------------------------ */
export function buildDeed(c: Ctx): Built {
  const g = new THREE.Group()
  g.rotation.x = 0.12

  const W = 3.5
  const H = 4.6

  // Two loose sheets behind, so it reads as a document, not a card.
  const back1 = rbox(c, W, H, 0.05, c.mat.ivory, 0.05)
  back1.position.set(0.12, -0.05, -0.1)
  const back2 = rbox(c, W, H, 0.05, c.mat.slab2, 0.05)
  back2.position.set(-0.1, 0.06, -0.2)
  g.add(back2, back1)

  const sheet = rbox(c, W, H, 0.05, c.mat.ivory, 0.05)
  g.add(sheet)

  const face = canvasTexture(c, 720, 960, (x) => {
    x.fillStyle = '#FFFFFF'
    x.fillRect(0, 0, 720, 960)
    x.fillStyle = '#004385'
    x.fillRect(0, 0, 720, 150)
    x.fillStyle = '#FFFFFF'
    x.font = `600 34px ${c.fonts.sans}, sans-serif`
    x.textBaseline = 'middle'
    x.fillStyle = '#FFFFFF'
    x.fillText('OMSHAKTHY', 48, 62)
    x.font = `500 24px ${c.fonts.sans}, sans-serif`
    x.fillStyle = '#9CCBF7'
    x.fillText('TITLE DEED', 48, 102)

    x.fillStyle = '#0B1F3A'
    x.font = `600 70px ${c.fonts.display}, Georgia, serif`
    x.fillText('Kanopus Magha', 48, 250)
    x.fillStyle = '#64748B'
    x.font = `400 30px ${c.fonts.sans}, sans-serif`
    x.fillText('Residential plot · Avadi, Chennai', 48, 315)
    x.fillStyle = 'rgba(13,107,178,0.22)'
    x.fillRect(48, 360, 624, 3)

    const rows = ['CMDA approved', 'DTCP approved', 'Litigation-free, clear title']
    rows.forEach((label, i) => {
      const y = 450 + i * 92
      x.strokeStyle = '#0D6BB2'
      x.lineWidth = 4
      x.beginPath()
      x.arc(78, y, 26, 0, Math.PI * 2)
      x.stroke()
      x.beginPath()
      x.moveTo(66, y + 1)
      x.lineTo(75, y + 11)
      x.lineTo(92, y - 10)
      x.stroke()
      x.fillStyle = '#0B1F3A'
      x.font = `500 36px ${c.fonts.sans}, sans-serif`
      x.fillText(label, 130, y + 2)
    })

    x.fillStyle = '#E9F1F9'
    for (let i = 0; i < 3; i++) {
      roundRect(x, 48, 740 + i * 34, i === 2 ? 340 : 624, 12, 6)
      x.fill()
    }
    x.fillStyle = '#64748B'
    x.font = `italic 400 32px ${c.fonts.display}, Georgia, serif`
    x.fillText('Paper first, promise second.', 48, 890)
  })
  const facePlane = new THREE.Mesh(
    c.own(new THREE.PlaneGeometry(W - 0.2, H - 0.2)),
    c.own(new THREE.MeshBasicMaterial({ map: face, toneMapped: false })),
  )
  facePlane.position.z = 0.027
  g.add(facePlane)

  // The seal: a gold ring and disc with a check mark on top.
  const seal = new THREE.Group()
  const ring = new THREE.Mesh(c.own(new THREE.TorusGeometry(0.42, 0.07, 16, 48)), c.mat.gold)
  const disc = new THREE.Mesh(c.own(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 40)), c.mat.gold)
  disc.rotation.x = Math.PI / 2
  const barA = pbox(c, 0.2, 0.075, 0.03, c.mat.ink)
  barA.position.set(-0.11, -0.04, 0.05)
  barA.rotation.z = 0.8
  const barB = pbox(c, 0.42, 0.075, 0.03, c.mat.ink)
  barB.position.set(0.07, 0.03, 0.05)
  barB.rotation.z = -0.75
  seal.add(ring, disc, barA, barB)
  seal.position.set(1.05, -1.7, 1.1)
  seal.visible = false
  g.add(seal)

  return {
    group: g,
    update(a) {
      const t1 = seg(a, 0, 0.55)
      g.rotation.y = lerp(-0.75, 0.15, t1)
      g.rotation.z = lerp(0.1, -0.03, t1)
      back1.rotation.z = lerp(0, 0.06, t1)
      back2.rotation.z = lerp(0, -0.05, t1)
      const t2 = seg(a, 0.5, 0.8)
      seal.visible = a > 0.48
      seal.position.z = lerp(1.1, 0.09, t2)
      seal.scale.setScalar(lerp(1.8, 1, t2))
    },
  }
}

/* ------------------------------------------------------------------ */
/* 3. CONNECT: routes from the site to the railway, metro and bus depot */
/* ------------------------------------------------------------------ */
export function buildRoutes(c: Ctx): Built {
  const g = new THREE.Group()
  g.rotation.x = 0.6

  const ground = rbox(c, 8.4, 0.24, 6.2, c.mat.slab2, 0.1)
  ground.position.y = -0.12
  g.add(ground)
  const grid = new THREE.GridHelper(6, 15, 0x7db4eb, 0x7db4eb)
  grid.scale.x = 1.33
  grid.position.y = 0.006
  const gridMat = grid.material as THREE.LineBasicMaterial
  gridMat.transparent = true
  gridMat.opacity = 0.55
  c.own(grid.geometry)
  c.own(gridMat)
  g.add(grid)

  const site = new THREE.Vector3(-1.9, 0, 0.5)
  const pin = new THREE.Group()
  const stem = new THREE.Mesh(c.own(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12)), c.mat.ivory)
  stem.position.y = 0.45
  const head = new THREE.Mesh(c.own(new THREE.SphereGeometry(0.26, 24, 16)), c.mat.accent)
  head.position.y = 1.05
  const foot = new THREE.Mesh(c.own(new THREE.TorusGeometry(0.36, 0.035, 12, 40)), c.mat.accent)
  foot.rotation.x = Math.PI / 2
  foot.position.y = 0.02
  pin.add(stem, head, foot)
  pin.position.copy(site)
  pin.visible = false
  g.add(pin)

  const dests = [
    { name: 'Avadi Railway Station', sub: '5 min', p: new THREE.Vector3(2.7, 0, -1.7) },
    { name: 'Avadi Metro (proposed)', sub: '5 min', p: new THREE.Vector3(2.5, 0, 1.9) },
    { name: 'Avadi Bus Depot', sub: '5 min', p: new THREE.Vector3(0.3, 0, -2.3) },
  ]

  const routes = dests.map((d) => {
    const start = new THREE.Vector3(site.x, 0.06, site.z)
    const end = new THREE.Vector3(d.p.x, 0.06, d.p.z)
    const ctrl = start.clone().add(end).multiplyScalar(0.5)
    ctrl.y = 0.9
    const curve = new THREE.QuadraticBezierCurve3(start, ctrl, end)
    const geo = c.own(new THREE.TubeGeometry(curve, 56, 0.045, 6, false))
    const tube = new THREE.Mesh(geo, c.mat.accentGlow)
    tube.visible = false
    g.add(tube)

    const marker = new THREE.Group()
    const post = new THREE.Mesh(c.own(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 20)), c.mat.ivory)
    post.position.y = 0.25
    const cap = new THREE.Mesh(c.own(new THREE.SphereGeometry(0.13, 16, 12)), c.mat.accent)
    cap.position.y = 0.56
    marker.add(post, cap)
    marker.position.copy(d.p)
    marker.scale.setScalar(0.001)
    g.add(marker)

    const tex = canvasTexture(c, 512, 128, (x) => {
      x.fillStyle = '#FFFFFF'
      roundRect(x, 4, 4, 504, 120, 60)
      x.fill()
      x.strokeStyle = 'rgba(13,107,178,0.4)'
      x.lineWidth = 3
      x.stroke()
      x.textBaseline = 'middle'
      x.fillStyle = '#0B1F3A'
      x.font = `600 32px ${c.fonts.sans}, sans-serif`
      x.fillText(d.name, 40, 50)
      x.fillStyle = '#0D6BB2'
      x.font = `500 28px ${c.fonts.sans}, sans-serif`
      x.fillText(d.sub + ' drive', 40, 92)
    })
    const spriteMat = c.own(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, toneMapped: false }))
    const label = new THREE.Sprite(spriteMat)
    label.scale.set(2.5, 0.625, 1)
    label.position.set(d.p.x, 1.25, d.p.z)
    label.renderOrder = 5
    spriteMat.opacity = 0
    g.add(label)

    return { geo, tube, marker, spriteMat }
  })

  return {
    group: g,
    update(a) {
      const drop = seg(a, 0, 0.16)
      pin.visible = a > 0.01
      pin.position.y = lerp(1.6, 0, drop)
      routes.forEach((r, k) => {
        const t = seg(a, 0.12 + 0.2 * k, 0.5 + 0.2 * k)
        const count = r.geo.index ? r.geo.index.count : 0
        r.geo.setDrawRange(0, Math.floor((t * count) / 3) * 3)
        r.tube.visible = t > 0
        const m = seg(a, 0.4 + 0.2 * k, 0.55 + 0.2 * k)
        r.marker.scale.setScalar(Math.max(0.001, m))
        r.spriteMat.opacity = m
      })
      g.rotation.y = lerp(-0.35, 0.22, smooth(a))
    },
  }
}

/* ------------------------------------------------------------------ */
/* 4. COMMUNITY: gateway arch, clubhouse, pond, trees and street lights */
/* ------------------------------------------------------------------ */
export function buildCommunity(c: Ctx): Built {
  const g = new THREE.Group()
  g.rotation.x = 0.5

  const base = rbox(c, 8.0, 0.26, 6.0, c.mat.slab, 0.1)
  base.position.y = -0.13
  g.add(base)

  const pond = new THREE.Mesh(c.own(new THREE.CylinderGeometry(1.25, 1.25, 0.05, 48)), c.mat.water)
  pond.position.set(-0.2, 0.03, 0.5)
  g.add(pond)
  const path = new THREE.Mesh(c.own(new THREE.RingGeometry(1.45, 1.75, 64)), c.mat.slab2)
  path.rotation.x = -Math.PI / 2
  path.position.set(-0.2, 0.014, 0.5)
  g.add(path)

  // Trees: a spiral around the pond, kept clear of the clubhouse and the gate.
  const spots: { x: number; z: number; s: number }[] = []
  for (let k = 0; k < 40; k++) {
    const ang = k * 2.399
    const rad = 2.1 + (k % 5) * 0.28 + rnd(k) * 0.2
    const x = -0.2 + Math.cos(ang) * rad * 1.25
    const z = 0.5 + Math.sin(ang) * rad * 0.85
    if (Math.abs(x) > 3.5 || Math.abs(z) > 2.6) continue
    if (z < -1.1 && Math.abs(x - 0.4) < 1.5) continue
    if (z > 1.9 && Math.abs(x) < 1.5) continue
    spots.push({ x, z, s: 0.8 + rnd(k + 9) * 0.45 })
  }
  const foliageGeo = c.own(new THREE.ConeGeometry(0.32, 0.7, 8))
  foliageGeo.translate(0, 0.65, 0)
  const trunkGeo = c.own(new THREE.CylinderGeometry(0.05, 0.07, 0.32, 6))
  trunkGeo.translate(0, 0.16, 0)
  const foliage = new THREE.InstancedMesh(foliageGeo, c.mat.sage, spots.length)
  const trunks = new THREE.InstancedMesh(trunkGeo, c.mat.trunk, spots.length)
  foliage.frustumCulled = false
  trunks.frustumCulled = false
  g.add(trunks, foliage)

  const club = new THREE.Group()
  const body = pbox(c, 1.7, 0.6, 1.0, c.mat.ivory)
  body.position.y = 0.3
  const roof = pbox(c, 1.86, 0.12, 1.16, c.mat.accent)
  roof.position.y = 0.66
  const door = pbox(c, 0.3, 0.36, 0.02, c.mat.ink)
  door.position.set(0, 0.18, 0.51)
  club.add(body, roof, door)
  club.position.set(0.4, 0, -1.9)
  g.add(club)

  // Entrance archway on the front edge.
  const arch = new THREE.Group()
  for (const sx of [-0.85, 0.85]) {
    const p = pbox(c, 0.24, 1.3, 0.24, c.mat.ivory)
    p.position.set(sx, 0.65, 0)
    const cap = pbox(c, 0.32, 0.08, 0.32, c.mat.gold)
    cap.position.set(sx, 1.34, 0)
    arch.add(p, cap)
  }
  const beam = pbox(c, 2.1, 0.22, 0.34, c.mat.accent)
  beam.position.y = 1.5
  arch.add(beam)
  arch.position.set(0, 0, 2.55)
  g.add(arch)

  // Solar street lights along the left edge.
  const lampMat = c.own(new THREE.MeshStandardMaterial({ color: '#FFF3CF', emissive: '#FFE7A3', emissiveIntensity: 1.2 }))
  const lamps = [-2, -1, 0, 1, 2].map((z) => {
    const l = new THREE.Group()
    const pole = new THREE.Mesh(c.own(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8)), c.mat.ivory)
    pole.position.y = 0.45
    const bulb = new THREE.Mesh(c.own(new THREE.SphereGeometry(0.09, 12, 10)), lampMat)
    bulb.position.y = 0.95
    l.add(pole, bulb)
    l.position.set(-3.55, 0, z)
    g.add(l)
    return l
  })

  const dummy = new THREE.Object3D()
  return {
    group: g,
    update(a) {
      pond.scale.set(Math.max(0.01, seg(a, 0.05, 0.4)), 1, Math.max(0.01, seg(a, 0.05, 0.4)))
      club.scale.y = Math.max(0.001, seg(a, 0.1, 0.4))
      arch.scale.y = Math.max(0.001, seg(a, 0.4, 0.72))
      lamps.forEach((l, i) => (l.scale.y = Math.max(0.001, seg(a, 0.6 + i * 0.05, 0.75 + i * 0.05))))
      spots.forEach((s, i) => {
        const t = Math.max(0.001, seg(a, 0.15 + (i / spots.length) * 0.55, 0.37 + (i / spots.length) * 0.55))
        dummy.position.set(s.x, 0, s.z)
        dummy.scale.setScalar(s.s * t)
        dummy.updateMatrix()
        foliage.setMatrixAt(i, dummy.matrix)
        trunks.setMatrixAt(i, dummy.matrix)
      })
      foliage.instanceMatrix.needsUpdate = true
      trunks.instanceMatrix.needsUpdate = true
      g.rotation.y = lerp(-0.5, 0.3, smooth(a))
    },
  }
}

export const builders = [buildLand, buildDeed, buildRoutes, buildCommunity]
