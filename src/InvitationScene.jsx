import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Reflector } from 'three/addons/objects/Reflector.js'
import weddingArtwork from './shiva-parvati-modern.jpg'

export default function InvitationScene({ paused, dusk }) {
  const host = useRef(null)
  const settings = useRef({ paused, dusk })
  const [ready, setReady] = useState(false)

  useEffect(() => { settings.current = { paused, dusk } }, [paused, dusk])

  useEffect(() => {
    const container = host.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true })
    } catch {
      return undefined
    }
    let disposed = false
    let loaded = false
    let animationFrame
    let elapsed = 0
    let lastTime = 0
    let visible = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scene = new THREE.Scene()
    const daylight = new THREE.Color('#dceee9')
    const evening = new THREE.Color('#536779')
    scene.background = daylight.clone()
    scene.fog = new THREE.Fog(daylight, 30, 78)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100)
    const ambient = new THREE.HemisphereLight('#ffefe0', '#497775', 2.5)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight('#ffe3b4', 3.8)
    sun.position.set(-4, 12, 9)
    scene.add(sun)
    const rim = new THREE.DirectionalLight('#ef9cae', 2)
    rim.position.set(10, 7, -4)
    scene.add(rim)

    const garden = new THREE.Group()
    scene.add(garden)
    const gold = new THREE.MeshStandardMaterial({ color: '#caa15c', roughness: 0.3, metalness: 0.65 })
    const stone = new THREE.MeshStandardMaterial({ color: '#dce3d4', roughness: 0.7 })
    const jade = new THREE.MeshStandardMaterial({ color: '#3e8279', roughness: 0.45, metalness: 0.25 })
    const rose = new THREE.MeshStandardMaterial({ color: '#d96d8b', roughness: 0.55, side: THREE.DoubleSide })
    const blush = new THREE.MeshStandardMaterial({ color: '#f4c4cf', roughness: 0.6, side: THREE.DoubleSide })
    const leaf = new THREE.MeshStandardMaterial({ color: '#437f6c', roughness: 0.7 })
    const bark = new THREE.MeshStandardMaterial({ color: '#776b57', roughness: 1 })
    const makeMesh = (geometry, material, parent, position = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...position)
      parent.add(mesh)
      return mesh
    }
    const cylinder = (radius, height, material, parent, position) => makeMesh(new THREE.CylinderGeometry(radius, radius, height, 40), material, parent, position)

    const mountainMaterials = ['#aac8c5', '#83aaa9', '#718f9d'].map(color => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 1 }))
    for (let row = 0; row < 3; row += 1) {
      for (let peak = 0; peak < 9; peak += 1) {
        const height = 9 + Math.sin(peak * 7.3 + row) * 3 + row * 1.6
        const mountain = makeMesh(new THREE.ConeGeometry(5.4, height, 7), mountainMaterials[row], scene, [(peak - 4) * 7.5 + row * 2, height / 2 - 0.9, -12 - row * 7])
        mountain.rotation.y = peak * 0.7
        const snow = makeMesh(new THREE.ConeGeometry(1.63, height * 0.3, 7), stone, mountain, [0, height * 0.35, 0])
        snow.rotation.y = 0.04
      }
    }

    const water = new Reflector(new THREE.PlaneGeometry(100, 100), { color: '#b0d5d0', textureWidth: 768, textureHeight: 768, clipBias: 0.003 })
    water.rotation.x = -Math.PI / 2
    water.position.y = -0.3
    scene.add(water)

    const shrine = new THREE.Group()
    garden.add(shrine)
    for (let step = 0; step < 4; step += 1) {
      cylinder(3.3 - step * 0.22, 0.18, step % 2 ? gold : stone, shrine, [0, step * 0.18 - 0.1, 0])
    }
    const archShape = new THREE.Shape()
    archShape.moveTo(-2.35, 0.5)
    archShape.lineTo(-2.35, 5.6)
    archShape.bezierCurveTo(-2.35, 7, -1, 7.35, 0, 8)
    archShape.bezierCurveTo(1, 7.35, 2.35, 7, 2.35, 5.6)
    archShape.lineTo(2.35, 0.5)
    archShape.closePath()
    const arch = makeMesh(new THREE.ExtrudeGeometry(archShape, { depth: 0.38, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3, steps: 1 }), jade, shrine, [0, 0, -0.45])
    const innerArch = makeMesh(new THREE.ShapeGeometry(archShape), gold, shrine, [0, 0.17, 0.02])
    innerArch.scale.set(0.93, 0.95, 1)
    const texture = new THREE.TextureLoader().load(weddingArtwork, () => { if (!disposed) loaded = true }, undefined, () => { if (!disposed) setReady(false) })
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)
    makeMesh(new THREE.PlaneGeometry(4.05, 3.0375), new THREE.MeshBasicMaterial({ map: texture }), shrine, [0, 4.2, 0.08])
    const halo = makeMesh(new THREE.TorusGeometry(0.5, 0.025, 8, 64), gold, shrine, [0, 6.55, 0.15])
    halo.scale.y = 0.7

    for (const side of [-1, 1]) {
      const column = cylinder(0.2, 5.8, stone, shrine, [side * 2.45, 3.55, 0.25])
      for (let band = 0; band < 7; band += 1) cylinder(band % 2 ? 0.23 : 0.3, 0.1, gold, column, [0, band * 0.88 - 2.65, 0])
      for (let flute = 0; flute < 10; flute += 1) {
        const angle = flute * Math.PI / 5
        makeMesh(new THREE.CylinderGeometry(0.025, 0.025, 5.3, 6), gold, column, [Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2])
      }
      cylinder(0.5, 0.16, gold, shrine, [side * 2.45, 6.5, 0.25])
    }
    const canopy = makeMesh(new THREE.SphereGeometry(2.9, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2), stone, shrine, [0, 7.1, -0.5])
    canopy.scale.set(1, 0.45, 0.65)
    const eave = cylinder(3, 0.15, gold, shrine, [0, 7.12, -0.5])
    eave.scale.z = 0.65
    cylinder(0.12, 0.65, gold, shrine, [0, 8.65, -0.5])
    makeMesh(new THREE.ConeGeometry(0.25, 0.7, 16), gold, shrine, [0, 9.2, -0.5])

    const petalShape = new THREE.Shape()
    petalShape.moveTo(0, 0)
    petalShape.bezierCurveTo(0.52, 0.3, 0.48, 0.9, 0, 1.25)
    petalShape.bezierCurveTo(-0.48, 0.9, -0.52, 0.3, 0, 0)
    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.07, bevelSegments: 2, steps: 1 })
    const blooms = []
    const createLotus = (position, scale, parent = garden) => {
      const bloom = new THREE.Group()
      bloom.position.set(...position)
      bloom.scale.setScalar(scale)
      parent.add(bloom)
      for (let ring = 0; ring < 2; ring += 1) {
        for (let petal = 0; petal < 8; petal += 1) {
          const pivot = new THREE.Group()
          pivot.rotation.y = petal * Math.PI / 4 + ring * Math.PI / 8
          bloom.add(pivot)
          const mesh = makeMesh(petalGeometry, ring ? blush : rose, pivot, [0, 0.05, 0.06])
          mesh.rotation.x = ring ? 0.55 : 1.1
          mesh.scale.setScalar(ring ? 0.7 : 1)
        }
      }
      cylinder(0.16, 0.15, gold, bloom, [0, 0.16, 0])
      const pad = makeMesh(new THREE.CircleGeometry(1.05, 32), leaf, bloom, [0, -0.05, 0])
      pad.rotation.x = -Math.PI / 2
      blooms.push(bloom)
      return bloom
    }
    ;[[-4, 0, 3.3, 1.1], [3.7, 0, 3.7, 0.85], [-5.4, 0, -0.2, 0.65], [5.3, 0, -0.7, 0.8], [-1.9, 0, 5.5, 0.6], [1.7, 0, 6, 0.55]].forEach(([positionX, positionY, positionZ, scale]) => createLotus([positionX, positionY, positionZ], scale))

    const bells = []
    for (const side of [-1, 1]) {
      const tree = new THREE.Group()
      tree.position.set(side * 5, 0, -1)
      garden.add(tree)
      const trunkCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 0.25, 3, 0), new THREE.Vector3(-side * 0.3, 6, 0), new THREE.Vector3(-side, 8.6, 0)])
      makeMesh(new THREE.TubeGeometry(trunkCurve, 20, 0.1, 8, false), bark, tree)
      const blossoms = new THREE.InstancedMesh(petalGeometry, side < 0 ? rose : blush, 192)
      const blossomTransform = new THREE.Object3D()
      tree.add(blossoms)
      let blossomIndex = 0
      for (let branch = 0; branch < 6; branch += 1) {
        const branchCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-side * 0.2, 5 + branch * 0.45, 0),
          new THREE.Vector3(-side * (1 + branch * 0.25), 6 + branch * 0.5, Math.sin(branch * 2) * 0.8),
          new THREE.Vector3(-side * (1.9 + branch * 0.25), 6.3 + branch * 0.5, Math.sin(branch * 2) * 1.2),
        ])
        makeMesh(new THREE.TubeGeometry(branchCurve, 12, 0.035, 6, false), bark, tree)
        for (let cluster = 0; cluster < 4; cluster += 1) {
          const center = branchCurve.getPoint(0.5 + cluster * 0.16)
          for (let petal = 0; petal < 8; petal += 1) {
            const angle = petal * Math.PI / 4
            blossomTransform.position.copy(center).add(new THREE.Vector3(Math.sin(angle) * 0.1, Math.cos(angle) * 0.1, 0))
            blossomTransform.rotation.set(0.4, angle, angle)
            blossomTransform.scale.setScalar(0.28)
            blossomTransform.updateMatrix()
            blossoms.setMatrixAt(blossomIndex, blossomTransform.matrix)
            blossomIndex += 1
          }
        }
      }
      const hanger = new THREE.Group()
      hanger.position.set(side * 2.1, 7.05, 0.5)
      shrine.add(hanger)
      cylinder(0.02, 1.15, gold, hanger, [0, -0.6, 0])
      const bell = makeMesh(new THREE.ConeGeometry(0.21, 0.32, 20, 1, true), gold, hanger, [0, -1.3, 0])
      makeMesh(new THREE.SphereGeometry(0.04, 8, 8), gold, bell, [0, -0.18, 0])
      bells.push(hanger)
    }

    const ripples = []
    for (let ripple = 0; ripple < 6; ripple += 1) {
      const radius = 3.8 + ripple * 0.65
      const ring = makeMesh(new THREE.RingGeometry(radius, radius + 0.013, 100), new THREE.MeshBasicMaterial({ color: '#e6f2e6', transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false }), garden, [0, -0.27 + ripple * 0.001, 0])
      ring.rotation.x = -Math.PI / 2
      ripples.push(ring)
    }
    const fallingPetals = new THREE.InstancedMesh(petalGeometry, blush, 28)
    fallingPetals.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    garden.add(fallingPetals)
    const transform = new THREE.Object3D()
    const pointer = new THREE.Vector2()
    const viewTarget = new THREE.Vector3()
    let compact = false
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) return
      compact = width < 760
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.position.set(0, compact ? 5.5 : 6.3, compact ? 21.5 : 23)
      viewTarget.set(0, compact ? 4 : 3.8, 0)
      garden.position.x = compact ? 0 : 4.6
      camera.lookAt(viewTarget)
      camera.updateProjectionMatrix()
    }
    const onPointer = event => {
      const bounds = container.getBoundingClientRect()
      pointer.set((event.clientX - bounds.left) / bounds.width - 0.5, (event.clientY - bounds.top) / bounds.height - 0.5)
    }
    const resetPointer = () => pointer.set(0, 0)
    const contextLost = event => { event.preventDefault(); setReady(false); loaded = false }
    container.addEventListener('pointermove', onPointer)
    container.addEventListener('pointerleave', resetPointer)
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const visibilityObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting }, { rootMargin: '100px' })
    visibilityObserver.observe(container)
    resize()

    let announced = false
    const render = time => {
      if (disposed) return
      animationFrame = requestAnimationFrame(render)
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05)
      lastTime = time
      if (!visible || document.hidden) return
      const moving = !settings.current.paused && !reducedMotion.matches
      if (moving) elapsed += delta
      const background = settings.current.dusk ? evening : daylight
      scene.background.lerp(background, 0.045)
      scene.fog.color.copy(scene.background)
      ambient.intensity += ((settings.current.dusk ? 1.2 : 2.5) - ambient.intensity) * 0.045
      renderer.toneMappingExposure += ((settings.current.dusk ? 0.9 : 1.25) - renderer.toneMappingExposure) * 0.045
      if (moving) {
        garden.rotation.y += (pointer.x * 0.14 - garden.rotation.y) * 0.025
        garden.rotation.x += (pointer.y * 0.025 - garden.rotation.x) * 0.025
      }
      bells.forEach((bell, index) => { bell.rotation.z = Math.sin(elapsed * 0.85 + index) * 0.06 })
      blooms.forEach((bloom, index) => { if (bloom.parent === garden) bloom.position.y = Math.sin(elapsed * 0.7 + index) * 0.04 })
      ripples.forEach((ripple, index) => { ripple.scale.setScalar(1 + Math.sin(elapsed * 0.6 + index) * 0.03) })
      for (let petal = 0; petal < 28; petal += 1) {
        transform.position.set(Math.sin(petal * 12.3 + elapsed * 0.12) * 5, 10 - ((petal * 1.73 + elapsed * 0.28) % 10), Math.cos(petal * 4.2) * 2 + 1)
        transform.rotation.set(petal + elapsed * 0.4, petal * 2 + elapsed * 0.2, petal * 0.7)
        transform.scale.setScalar(0.12)
        transform.updateMatrix()
        fallingPetals.setMatrixAt(petal, transform.matrix)
      }
      fallingPetals.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      if (loaded && !announced) { announced = true; setReady(true) }
    }
    animationFrame = requestAnimationFrame(render)
    return () => {
      disposed = true
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      container.removeEventListener('pointermove', onPointer)
      container.removeEventListener('pointerleave', resetPointer)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      const geometries = new Set()
      const materials = new Set()
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry)
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material))
        if (object.isInstancedMesh) object.dispose()
      })
      geometries.forEach(geometry => geometry.dispose())
      materials.forEach(material => material.dispose())
      texture.dispose()
      water.getRenderTarget().dispose()
      renderer.dispose()
      renderer.domElement.remove()
      arch.clear()
    }
  }, [])

  return (
    <div className={`divine-scene ${ready ? 'scene-ready' : ''}`} ref={host} role="img" aria-label="A three-dimensional lotus garden with reflective water, Himalayan mountains, and a temple displaying contemporary Shiva and Parvati sculptures">
      <img className="divine-scene-fallback" src={weddingArtwork} alt="" width="600" height="450" />
    </div>
  )
}