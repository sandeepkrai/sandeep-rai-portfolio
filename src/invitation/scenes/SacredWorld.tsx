import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

export type SceneKind = 'cosmic' | 'river' | 'mandap' | 'blessings'
interface WorldProps { kind: SceneKind; moving: boolean; compact: boolean; progress: MutableRefObject<number> }

function Trishul() {
  const forks = useMemo(() => [-1, 1].map(side => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(side * 0.75, 0.9, 0),
    new THREE.Vector3(side * 1.25, 1.65, 0), new THREE.Vector3(side * 1.12, 2.6, 0),
  ])), [])
  return <group position={[0, 1.9, 0]} rotation={[0, -0.12, -0.07]}>
    <mesh position={[0, -1.4, 0]}><cylinderGeometry args={[0.055, 0.09, 6, 20]} /><meshStandardMaterial color="#b88c43" metalness={0.85} roughness={0.28} /></mesh>
    <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.065, 0.11, 2.1, 20]} /><meshStandardMaterial color="#c6a15b" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[0, 2.9, 0]}><coneGeometry args={[0.2, 0.85, 24]} /><meshStandardMaterial color="#e8d5a3" metalness={0.8} roughness={0.25} /></mesh>
    {forks.map((curve, index) => <group key={index}>
      <mesh><tubeGeometry args={[curve, 32, 0.075, 10, false]} /><meshStandardMaterial color="#c6a15b" metalness={0.85} roughness={0.25} /></mesh>
      <mesh position={[(index ? 1 : -1) * 1.1, 2.8, 0]} rotation={[0, 0, index ? 0.16 : -0.16]}><coneGeometry args={[0.16, 0.7, 20]} /><meshStandardMaterial color="#e8d5a3" metalness={0.8} roughness={0.3} /></mesh>
    </group>)}
    {[0, 1, 2, 3, 4].map(band => <mesh key={band} position={[0, 0.35 - band * 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.115, 0.03, 8, 20]} /><meshStandardMaterial color="#e8d5a3" metalness={0.65} roughness={0.35} /></mesh>)}
    <group position={[0, -0.1, 0.2]} rotation={[0.2, 0, -0.4]}>
      {[-1, 1].map(side => <group key={side}>
        <mesh position={[0, side * 0.2, 0]} rotation={[0, 0, side < 0 ? Math.PI : 0]}><cylinderGeometry args={[0.38, 0.12, 0.4, 24]} /><meshStandardMaterial color="#9e2929" roughness={0.6} /></mesh>
        <mesh position={[0, side * 0.42, 0]}><cylinderGeometry args={[0.4, 0.4, 0.04, 24]} /><meshStandardMaterial color="#dfbe78" roughness={0.5} /></mesh>
      </group>)}
    </group>
  </group>
}

function River({ moving }: { moving: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ time: { value: 0 } }), [])
  useFrame((_, delta) => { if (moving && material.current) material.current.uniforms.time.value += Math.min(delta, 0.05) })
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
    <planeGeometry args={[150, 150, 1, 1]} />
    <shaderMaterial ref={material} uniforms={uniforms} transparent={false}
      vertexShader={`varying vec2 waterUv; void main(){waterUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
      fragmentShader={`uniform float time;varying vec2 waterUv;void main(){vec2 point=(waterUv-.5)*150.;float ripple=sin(point.y*9.+sin(point.x*2.+time)*.8+time*.8);float fine=sin(point.y*24.-time*1.3+point.x*3.);float shimmer=pow(max(0.,ripple*.65+fine*.35),7.);float columns=pow(max(0.,cos(point.x*1.6+sin(point.y*.4)*.25)),12.);float reflection=shimmer*columns*.38;vec3 water=mix(vec3(.025,.047,.09),vec3(.09,.16,.24),.4+.12*ripple);gl_FragColor=vec4(water+vec3(.88,.51,.18)*reflection,1.);}`}
    />
  </mesh>
}

function Diyas({ moving, compact }: { moving: boolean; compact: boolean }) {
  const bowls = useRef<THREE.InstancedMesh>(null)
  const flames = useRef<THREE.InstancedMesh>(null)
  const elapsed = useRef(0)
  const transform = useMemo(() => new THREE.Object3D(), [])
  const count = compact ? 22 : 48
  useFrame((_, delta) => {
    if (!bowls.current || !flames.current) return
    if (moving) elapsed.current += Math.min(delta, 0.05)
    for (let index = 0; index < count; index++) {
      const positionX = Math.sin(index * 19.7) * 17
      const positionZ = 5 - (index * 2.87) % 26
      const bob = Math.sin(elapsed.current + index) * 0.035
      transform.position.set(positionX, -0.15 + bob, positionZ)
      transform.rotation.set(0, index, 0)
      transform.scale.set(0.3, 0.1, 0.23)
      transform.updateMatrix()
      bowls.current.setMatrixAt(index, transform.matrix)
      transform.position.y += 0.22
      transform.scale.set(0.055, 0.16 + Math.sin(elapsed.current * 3 + index) * 0.025, 0.055)
      transform.updateMatrix()
      flames.current.setMatrixAt(index, transform.matrix)
    }
    bowls.current.instanceMatrix.needsUpdate = true
    flames.current.instanceMatrix.needsUpdate = true
  })
  return <group>
    <instancedMesh ref={bowls} args={[undefined, undefined, count]} frustumCulled={false}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#a96c36" metalness={0.5} roughness={0.4} /></instancedMesh>
    <instancedMesh ref={flames} args={[undefined, undefined, count]} frustumCulled={false}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffcf74" toneMapped={false} /></instancedMesh>
  </group>
}

function GhatBuildings() {
  const buildings = useMemo(() => Array.from({ length: 23 }, (_, index) => ({
    position: (index - 11) * 2.35, height: 1.5 + (Math.sin(index * 8.4) + 1) * 1.5, temple: index % 4 === 1,
  })), [])
  return <group position={[0, 0, -15]}>
    {Array.from({ length: 9 }, (_, index) => <mesh key={index} position={[0, index * 0.16, -index * 0.38]}><boxGeometry args={[68, 0.18, 1.2]} /><meshStandardMaterial color={index % 2 ? '#735643' : '#9d7655'} roughness={0.95} /></mesh>)}
    {buildings.map((building, index) => <group key={index} position={[building.position, 1.4, -5 - (index % 3) * 0.7]}>
      <mesh position={[0, building.height / 2, 0]}><boxGeometry args={[2.15, building.height, 2]} /><meshStandardMaterial color={['#9b7152', '#745443', '#b3936c', '#675951'][index % 4]} roughness={0.9} /></mesh>
      <mesh position={[0, building.height + 0.12, 0]}><boxGeometry args={[2.35, 0.25, 2.2]} /><meshStandardMaterial color="#ad8d63" /></mesh>
      {building.temple && <group position={[0, building.height, 0]}>
        {[0, 1, 2, 3, 4].map(level => <mesh key={level} position={[0, level * 0.45 + 0.2, 0]}><cylinderGeometry args={[0.8 - level * 0.14, 0.95 - level * 0.14, 0.6, 8]} /><meshStandardMaterial color="#c29a6a" roughness={0.75} /></mesh>)}
        <mesh position={[0, 2.8, 0]}><coneGeometry args={[0.2, 0.9, 12]} /><meshStandardMaterial color="#dfb868" metalness={0.65} roughness={0.4} /></mesh>
      </group>}
      {[-0.65, 0, 0.65].map(positionX => <group key={positionX}>
        {[0.55, 1.5].filter(height => height < building.height).map(height => <mesh key={height} position={[positionX, height, 1.01]}><planeGeometry args={[0.22, 0.42]} /><meshBasicMaterial color="#eeb35a" toneMapped={false} /></mesh>)}
      </group>)}
    </group>)}
  </group>
}

function Mandap() {
  return <group position={[0, 0, -1]}>
    {[0, 1, 2].map(step => <mesh key={step} position={[0, step * 0.15, 0]}><boxGeometry args={[8 - step * 0.45, 0.18, 6 - step * 0.4]} /><meshStandardMaterial color="#a38a6d" roughness={0.7} /></mesh>)}
    <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5, 4]} /><meshStandardMaterial color="#84272a" roughness={0.9} /></mesh>
    {[-1, 1].flatMap(side => [-1, 1].map(depth => <group key={`${side}-${depth}`} position={[side * 2.9, 0.5, depth * 1.9]}>
      <mesh position={[0, 2.1, 0]}><cylinderGeometry args={[0.18, 0.24, 4.2, 16]} /><meshStandardMaterial color="#d3ae68" metalness={0.6} roughness={0.35} /></mesh>
      {[0, 1, 2, 3, 4].map(band => <mesh key={band} position={[0, band + 0.1, 0]}><cylinderGeometry args={[0.29, 0.29, 0.12, 16]} /><meshStandardMaterial color="#efcf8c" metalness={0.55} roughness={0.3} /></mesh>)}
      <mesh position={[side * 0.25, 2, 0]} rotation={[0, 0, side * 0.08]}><cylinderGeometry args={[0.18, 0.35, 4, 12]} /><meshStandardMaterial color={depth > 0 ? '#f1e1c4' : '#8c2529'} roughness={0.95} /></mesh>
    </group>))}
    <mesh position={[0, 4.9, 0]}><boxGeometry args={[6.5, 0.3, 4.7]} /><meshStandardMaterial color="#bb914d" metalness={0.6} roughness={0.4} /></mesh>
    <mesh position={[0, 5.35, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[4.5, 0.8, 4]} /><meshStandardMaterial color="#81272e" roughness={0.85} /></mesh>
    {Array.from({ length: 37 }, (_, index) => <mesh key={index} position={[-3 + index / 6, 4.5 - Math.sin(index / 36 * Math.PI) * 0.7, 2.15]}><sphereGeometry args={[0.11, 8, 6]} /><meshStandardMaterial color={index % 3 ? '#eeb04a' : '#f4d087'} roughness={1} /></mesh>)}
    {[-1, 1].map(side => <group key={side} position={[side * 3.8, 0, 2.8]}>
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.045, 0.14, 1.6, 16]} /><meshStandardMaterial color="#d1a34f" metalness={0.75} roughness={0.3} /></mesh>
      <mesh position={[0, 1.7, 0]}><sphereGeometry args={[0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#cca15a" metalness={0.75} roughness={0.3} /></mesh>
      <mesh position={[0, 1.94, 0]} scale={[0.07, 0.24, 0.07]}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffca69" toneMapped={false} /></mesh>
      <pointLight position={[0, 2, 0]} color="#ffb34b" intensity={5} distance={7} />
    </group>)}
  </group>
}

function Particles({ moving, compact }: { moving: boolean; compact: boolean }) {
  const particles = useRef<THREE.InstancedMesh>(null)
  const elapsed = useRef(0)
  const transform = useMemo(() => new THREE.Object3D(), [])
  const positions = useMemo(() => {
    let seed = 8429
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    return Array.from({ length: compact ? 30 : 75 }, () => [random() * 30 - 15, random() * 14, random() * 20 - 8])
  }, [compact])
  useFrame((_, delta) => {
    if (!particles.current) return
    if (moving) elapsed.current += Math.min(delta, 0.05)
    positions.forEach(([positionX, positionY, positionZ], index) => {
      transform.position.set(positionX + Math.sin(elapsed.current * 0.1 + index) * 0.3, (positionY + elapsed.current * 0.12) % 14 - 3, positionZ)
      transform.scale.setScalar(0.012 + index % 3 * 0.008)
      transform.updateMatrix()
      particles.current!.setMatrixAt(index, transform.matrix)
    })
    particles.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={particles} args={[undefined, undefined, positions.length]} frustumCulled={false}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#d4b273" transparent opacity={0.65} /></instancedMesh>
}

function CameraRig({ kind, moving, compact, progress }: WorldProps) {
  const elapsed = useRef(0)
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, pointer }, delta) => {
    if (moving) elapsed.current += Math.min(delta, 0.05)
    const cosmic = kind === 'cosmic'
    const distant = kind === 'river'
    const targetZ = cosmic ? (compact ? 19 : 15) : distant ? (compact ? 21 : 16) : (compact ? 28 : 15)
    const targetY = cosmic ? 1.5 : distant ? 4 : 3.5
    target.set(moving && !compact ? pointer.x * 0.65 : 0, targetY, targetZ - (moving ? Math.sin(elapsed.current * 0.12) * 0.65 + progress.current * 2 : 0))
    if (moving) camera.position.lerp(target, 0.035)
    else camera.position.copy(target)
    camera.lookAt(0, cosmic ? 1.4 : distant ? 1.4 : 2, distant ? -12 : 0)
  })
  return null
}

export default function SacredWorld({ kind, moving, compact, progress }: WorldProps) {
  const cosmic = kind === 'cosmic'
  const crescent = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0.45, 0.9)
    shape.bezierCurveTo(-1.1, 0.95, -1.1, -0.95, 0.45, -0.9)
    shape.bezierCurveTo(-0.35, -0.55, -0.35, 0.55, 0.45, 0.9)
    return shape
  }, [])
  return <>
    <color attach="background" args={['#080d1b']} />
    <fog attach="fog" args={['#111a35', 18, 65]} />
    <ambientLight intensity={cosmic ? 0.45 : 0.85} color="#8298c0" />
    <directionalLight position={[-5, 10, 7]} intensity={cosmic ? 4 : 2} color="#ffe0a0" />
    <directionalLight position={[5, 3, -4]} intensity={2} color="#668ac3" />
    <Stars radius={65} depth={25} count={compact ? 350 : 850} factor={2} saturation={0} fade speed={moving ? 0.2 : 0} />
    <Particles moving={moving} compact={compact} />
    <mesh position={[cosmic ? 3.7 : -10, cosmic ? 6 : 9, -16]} rotation={[0, 0, -0.25]}><shapeGeometry args={[crescent]} /><meshBasicMaterial color="#e8d5a3" /></mesh>
    {cosmic ? <Float speed={moving ? 0.8 : 0} rotationIntensity={moving ? 0.1 : 0} floatIntensity={moving ? 0.2 : 0}><Trishul /></Float> : <>
      <River moving={moving} />
      <GhatBuildings />
      <Diyas moving={moving} compact={compact} />
      {kind === 'mandap' && <Mandap />}
    </>}
    <CameraRig kind={kind} moving={moving} compact={compact} progress={progress} />
  </>
}