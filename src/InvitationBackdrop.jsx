import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function InvitationBackdrop({ paused, dusk }) {
  const host = useRef(null)
  const settings = useRef({ paused, dusk })
  useEffect(() => { settings.current = { paused, dusk } }, [paused, dusk])

  useEffect(() => {
    const container = host.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true })
    } catch {
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80)
    camera.position.set(0, 0, 18)
    const light = new THREE.DirectionalLight('#fff0c6', 5)
    light.position.set(-4, 6, 8)
    scene.add(light, new THREE.HemisphereLight('#e9faff', '#7a414f', 3))
    const rim = new THREE.PointLight('#e886a4', 50)
    rim.position.set(4, -2, 5)
    scene.add(rim)
    const gold = new THREE.MeshStandardMaterial({ color: '#bc934d', metalness: 0.78, roughness: 0.27 })
    const cord = new THREE.MeshStandardMaterial({ color: '#e3bd75', roughness: 0.8 })
    const red = new THREE.MeshStandardMaterial({ color: '#a54862', roughness: 0.6, side: THREE.DoubleSide })
    const trishul = new THREE.Group()
    scene.add(trishul)
    const mesh = (geometry, material, position, parent = trishul) => {
      const object = new THREE.Mesh(geometry, material)
      object.position.set(...position)
      parent.add(object)
      return object
    }
    mesh(new THREE.CylinderGeometry(0.075, 0.105, 8, 24), gold, [0, -1.3, 0])
    mesh(new THREE.ConeGeometry(0.22, 1.15, 24), gold, [0, 4.6, 0])
    mesh(new THREE.CylinderGeometry(0.08, 0.13, 1.65, 24), gold, [0, 3.25, 0])
    for (const side of [-1, 1]) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.65, 0), new THREE.Vector3(side * 0.9, 2, 0),
        new THREE.Vector3(side * 1.5, 2.8, 0), new THREE.Vector3(side * 1.4, 3.9, 0),
      ])
      mesh(new THREE.TubeGeometry(curve, 40, 0.105, 12, false), gold, [0, 0, 0])
      const tip = mesh(new THREE.ConeGeometry(0.21, 0.9, 24), gold, [side * 1.35, 4.2, 0])
      tip.rotation.z = side * 0.13
    }
    for (let band = 0; band < 9; band += 1) {
      mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 24), gold, [0, 1.5 - band * 0.13, 0]).rotation.x = Math.PI / 2
    }
    const drum = new THREE.Group()
    drum.position.set(0, 0.7, 0.35)
    drum.rotation.z = -0.4
    trishul.add(drum)
    for (const side of [-1, 1]) {
      const half = mesh(new THREE.CylinderGeometry(0.5, 0.17, 0.55, 32), red, [0, side * 0.275, 0], drum)
      if (side < 0) half.rotation.z = Math.PI
      mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.06, 32), cord, [0, side * 0.56, 0], drum)
    }
    for (let lace = 0; lace < 12; lace += 1) {
      const angle = lace * Math.PI / 6
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 0.5, -0.55, Math.sin(angle) * 0.5),
        new THREE.Vector3(Math.cos(angle + 0.2) * 0.19, 0, Math.sin(angle + 0.2) * 0.19),
        new THREE.Vector3(Math.cos(angle + 0.4) * 0.5, 0.55, Math.sin(angle + 0.4) * 0.5),
      ])
      mesh(new THREE.TubeGeometry(curve, 12, 0.012, 5, false), cord, [0, 0, 0], drum)
    }
    const ribbonGeometry = new THREE.PlaneGeometry(0.28, 2.2, 1, 20)
    const ribbonPositions = ribbonGeometry.attributes.position
    for (let vertex = 0; vertex < ribbonPositions.count; vertex += 1) {
      ribbonPositions.setZ(vertex, Math.sin(ribbonPositions.getY(vertex) * 5) * 0.18)
    }
    ribbonGeometry.computeVertexNormals()
    const ribbons = [-1, 1].map(side => {
      const ribbon = mesh(ribbonGeometry, red, [side * 0.32, -0.65, 0.35])
      ribbon.rotation.z = side * 0.25
      return ribbon
    })
    const petalShape = new THREE.Shape()
    petalShape.moveTo(0, 0)
    petalShape.bezierCurveTo(0.4, 0.15, 0.4, 0.6, 0, 0.85)
    petalShape.bezierCurveTo(-0.4, 0.6, -0.4, 0.15, 0, 0)
    const petals = new THREE.InstancedMesh(new THREE.ShapeGeometry(petalShape), red, 48)
    petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    petals.frustumCulled = false
    scene.add(petals)
    const transform = new THREE.Object3D()
    let visible = true
    let elapsed = 0
    let lastTime = 0
    let frame
    let ready = false
    let contextAvailable = true
    const contextLost = event => {
      event.preventDefault()
      contextAvailable = false
      container.parentElement.classList.remove('backdrop-ready')
    }
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      trishul.position.x = width < 760 ? 1.6 : 4.3
      trishul.scale.setScalar(width < 760 ? 0.86 : 1)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting })
    visibility.observe(container.parentElement)
    resize()
    const render = time => {
      frame = requestAnimationFrame(render)
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05)
      lastTime = time
      if (!visible || document.hidden || !contextAvailable) return
      const moving = !settings.current.paused && !reducedMotion.matches
      if (moving) elapsed += delta
      trishul.rotation.y = Math.sin(elapsed * 0.25) * 0.28
      trishul.rotation.z = -0.12 + Math.sin(elapsed * 0.2) * 0.04
      trishul.position.y = Math.sin(elapsed * 0.45) * 0.16
      ribbons.forEach((ribbon, index) => { ribbon.rotation.x = Math.sin(elapsed * 1.3 + index) * 0.2 })
      light.position.x = Math.sin(elapsed * 0.35) * 6
      light.intensity = settings.current.dusk ? 3.5 : 5
      for (let petal = 0; petal < 48; petal += 1) {
        transform.position.set(Math.sin(petal * 13.7) * 12 + Math.sin(elapsed * 0.4 + petal) * 0.8, 8 - (petal * 1.7 + elapsed * 0.55) % 16, Math.cos(petal * 2.7) * 3)
        transform.rotation.set(elapsed * 0.4 + petal, elapsed * 0.6 + petal, petal)
        transform.scale.setScalar(0.16 + (petal % 4) * 0.05)
        transform.updateMatrix()
        petals.setMatrixAt(petal, transform.matrix)
      }
      petals.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      if (!ready) {
        ready = true
        container.parentElement.classList.add('backdrop-ready')
      }
    }
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibility.disconnect()
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      container.parentElement.classList.remove('backdrop-ready')
      const geometries = new Set()
      const materials = new Set()
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry)
        if (object.material) materials.add(object.material)
      })
      geometries.forEach(geometry => geometry.dispose())
      materials.forEach(material => material.dispose())
      petals.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className="invitation-backdrop" aria-hidden="true" />
}