import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { LoaderCircle } from 'lucide-react'
import type { SceneKind } from './SacredWorld'

const SacredWorld = lazy(() => import('./SacredWorld'))

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function Fallback({ kind }: { kind: SceneKind }) {
  return <div className={`sh-scene-fallback sh-fallback-${kind}`} aria-hidden="true">
    <div className="sh-fallback-moon" />
    {kind === 'cosmic' ? <div className="sh-fallback-trishul"><span /></div> : <div className="sh-fallback-ghats">{Array.from({ length: 15 }, (_, index) => <span key={index} style={{ height: `${40 + index % 4 * 14}%` }} />)}</div>}
    <div className="sh-fallback-river" />
  </div>
}

export default function Scene({ kind, paused, reduced }: { kind: SceneKind; paused: boolean; reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [near, setNear] = useState(kind === 'cosmic')
  const [visible, setVisible] = useState(kind === 'cosmic')
  const [documentVisible, setDocumentVisible] = useState(!document.hidden)
  const [compact, setCompact] = useState(innerWidth < 760)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const container = host.current!
    const nearby = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true) }, { rootMargin: '350px' })
    const active = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    const resize = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 760))
    const visibility = () => setDocumentVisible(!document.hidden)
    const scroll = () => {
      const bounds = container.getBoundingClientRect()
      progress.current = Math.max(0, Math.min(1, -bounds.top / Math.max(bounds.height * 0.75, 1)))
    }
    nearby.observe(container)
    active.observe(container)
    resize.observe(container)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('scroll', scroll, { passive: true })
    return () => { nearby.disconnect(); active.disconnect(); resize.disconnect(); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('scroll', scroll) }
  }, [])
  const moving = visible && documentVisible && !paused && !reduced
  const fallback = <Fallback kind={kind} />
  return <div ref={host} className={`sh-scene ${ready ? 'is-ready' : ''}`} role="img" aria-label={kind === 'cosmic' ? 'An antique gold trishul under a midnight sky' : kind === 'mandap' ? 'A flower-adorned mandap overlooking the Ganga' : 'A stylized Kashi riverfront with temple spires, stepped ghats, and floating diyas'}>
    {fallback}
    {near && !failed && <SceneBoundary fallback={fallback}>
      <Suspense fallback={<div className="sh-scene-loading" role="status"><LoaderCircle size={15} className="sh-spin" /><span>Preparing the scene</span></div>}>
        <Canvas dpr={[1, compact ? 1.25 : 1.5]} frameloop={moving ? 'always' : 'demand'} camera={{ position: [0, kind === 'cosmic' ? 1.5 : 4, compact ? 20 : 16], fov: 42 }} gl={{ antialias: !compact, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: true }} fallback={fallback} onCreated={({ gl }) => { setReady(true); gl.domElement.addEventListener('webglcontextlost', () => setFailed(true), { once: true }) }}>
          <SacredWorld kind={kind} moving={moving} compact={compact} progress={progress} />
        </Canvas>
      </Suspense>
    </SceneBoundary>}
  </div>
}