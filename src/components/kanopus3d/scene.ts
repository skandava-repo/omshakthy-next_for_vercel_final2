// One shared WebGL scene for the whole story. The four objects live in it
// together; the scroll timeline decides which one is on screen. This file (and
// three.js with it) is only ever loaded by a dynamic import() from Stage.tsx,
// so visitors who do not get the 3D version never download it.

import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { builders, makePalette, type Ctx } from './objects'
import { phases } from './timeline'

export interface SceneApi {
  /** scrollPx: distance scrolled inside the story block; vh: viewport height */
  update(scrollPx: number, vh: number): void
  resize(): void
  destroy(): void
}

const ENTER_Y = 6.4 // how far below the centre an object starts
const EXIT_Y = 7 // how far above the centre it ends

export async function createScene(canvas: HTMLCanvasElement, host: HTMLElement): Promise<SceneApi> {
  // Canvas text uses the site's own webfonts (Fraunces and Inter, loaded in the root layout).
  const fonts = { display: "Fraunces, Georgia, serif", sans: "Inter, Helvetica, Arial, sans-serif" }
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`600 70px ${fonts.display}`),
        document.fonts.load(`italic 400 32px ${fonts.display}`),
        document.fonts.load(`500 32px ${fonts.sans}`),
      ]),
      new Promise((r) => setTimeout(r, 1500)),
    ])
  } catch {
    /* fall back to system fonts */
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.setClearColor(0x000000, 0)

  const owned: { dispose(): void }[] = []
  const own = <T extends { dispose(): void }>(x: T): T => {
    owned.push(x)
    return x
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60)
  camera.position.set(0, 2.6, 12.5)
  camera.lookAt(0, 0, 0)

  // Reflections come from a small studio room generated in code (no HDRI file).
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envTarget.texture
  scene.environmentIntensity = 1.0
  own(envTarget)
  const sun = new THREE.DirectionalLight(0xffffff, 1.4)
  sun.position.set(4, 8, 6)
  scene.add(sun)
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe0f2, 0.7))

  const ctx: Ctx = {
    own,
    mat: makePalette(own),
    aniso: Math.min(8, renderer.capabilities.getMaxAnisotropy()),
    fonts,
  }

  // A soft contact shadow under each object so it sits on the light page.
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = shadowCanvas.height = 256
  const sg = shadowCanvas.getContext('2d')!
  const grad = sg.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(11,31,58,0.30)')
  grad.addColorStop(0.55, 'rgba(11,31,58,0.10)')
  grad.addColorStop(1, 'rgba(11,31,58,0)')
  sg.fillStyle = grad
  sg.fillRect(0, 0, 256, 256)
  const shadowMat = own(
    new THREE.MeshBasicMaterial({ map: own(new THREE.CanvasTexture(shadowCanvas)), transparent: true, depthWrite: false, toneMapped: false }),
  )
  const shadowGeo = own(new THREE.PlaneGeometry(1, 1))
  // width, depth and height of the shadow, one entry per object
  const SHADOWS = [
    { w: 10.5, d: 7.2, y: -1.75 },
    { w: 5.4, d: 1.7, y: -2.75 },
    { w: 10.5, d: 7.2, y: -1.85 },
    { w: 10, d: 6.8, y: -1.7 },
  ]

  const holder = new THREE.Group()
  scene.add(holder)
  const items = builders.map((build, i) => {
    const built = build(ctx)
    const slot = new THREE.Group()
    const sh = new THREE.Mesh(shadowGeo, shadowMat)
    sh.rotation.x = -Math.PI / 2
    sh.scale.set(SHADOWS[i].w, SHADOWS[i].d, 1)
    sh.position.y = SHADOWS[i].y
    slot.add(sh, built.group)
    slot.visible = false
    holder.add(slot)
    return { built, slot }
  })

  function resize() {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Keep the object inside the right-hand half of the screen (text is on the left).
    const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const visW = visH * camera.aspect
    // Rotated objects measure up to ~10.2 units wide, so size for that.
    holder.scale.setScalar(Math.min(0.7, (visW * 0.4) / 10.2))
    holder.position.set(visW * 0.25, -0.1, 0)
  }
  resize()

  function update(scrollPx: number, vh: number) {
    items.forEach(({ built, slot }, i) => {
      const p = phases(scrollPx, vh, i)
      slot.visible = p.visible
      if (!p.visible) return
      slot.position.y = -(1 - p.enter) * ENTER_Y + p.exit * EXIT_Y
      built.update(p.a)
    })
    renderer.render(scene, camera)
  }

  return {
    update,
    resize,
    destroy() {
      owned.forEach((d) => {
        try {
          d.dispose()
        } catch {
          /* already disposed */
        }
      })
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
