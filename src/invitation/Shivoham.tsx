import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUp, Flower2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DateTime } from 'luxon'
import { wedding } from '../config/wedding'
import Navigation from './components/Navigation'
import InvitationReveal from './components/InvitationReveal'
import { Venue, WeddingDetails } from './components/EventDetails'
import Rsvp from './components/Rsvp'
import { useReducedMotion } from './useExperience'
import './shivoham.css'

const Scene = lazy(() => import('./scenes/Scene'))
gsap.registerPlugin(ScrollTrigger)

export default function Shivoham() {
  const root = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [entering, setEntering] = useState(false)
  const reduced = useReducedMotion()
  const deadline = wedding.rsvpDeadline ? DateTime.fromISO(wedding.rsvpDeadline, { zone: wedding.timezone }) : null
  const names = wedding.partners.map((name, index) => name || `[Partner ${index ? 'two' : 'one'} name]`)
  useEffect(() => {
    const title = document.title
    document.title = 'SHIVOHAM | A Wedding in Kashi'
    document.documentElement.classList.add('shivoham-document')
    return () => { document.title = title; document.documentElement.classList.remove('shivoham-document') }
  }, [])
  useLayoutEffect(() => {
    if (reduced || paused) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.sh-reveal').forEach(element => {
        gsap.fromTo(element, { y: 28, opacity: 0.2 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 93%', once: true } })
      })
      gsap.to('.sh-river-copy', { y: -45, ease: 'none', scrollTrigger: { trigger: '#kashi', start: 'top center', end: 'bottom top', scrub: 1 } })
    }, root)
    return () => context.revert()
  }, [paused, reduced])
  function enterKashi() {
    if (reduced || paused) document.getElementById('kashi')?.scrollIntoView({ behavior: 'instant' })
    else setEntering(true)
  }
  return <MotionConfig reducedMotion={reduced || paused ? 'always' : 'never'}>
    <div ref={root} className={`shivoham ${paused ? 'sh-paused' : ''}`}>
      <Navigation paused={paused} onPause={() => setPaused(!paused)} reduced={reduced} />
      <AnimatePresence>{entering && <motion.div className="sh-entry-veil" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} onAnimationComplete={() => { document.getElementById('kashi')?.scrollIntoView({ behavior: 'instant' }); setEntering(false) }}><span lang="sa">ॐ</span></motion.div>}</AnimatePresence>
      <main>
        <section id="home" tabIndex={-1} className="sh-hero" aria-labelledby="sh-title">
          <Suspense fallback={<div className="sh-initial-scene" aria-hidden="true"><span lang="sa">ॐ</span></div>}><Scene kind="cosmic" paused={paused} reduced={reduced} /></Suspense>
          <div className="sh-hero-shade" />
          <div className="sh-opening-prayer"><p lang="sa">॥ श्री गणेशाय नमः ॥</p><p lang="hi">॥ हर हर महादेव ॥</p></div>
          <div className="sh-hero-content">
            <p className="sh-small-label">An invitation to celebrate love</p>
            <h1 id="sh-title">SHIVOHAM</h1>
            <p className="sh-hero-subtitle">Two souls. One sacred beginning.<br className="sh-mobile-break" /> A celebration in Kashi.</p>
            <button className="sh-button sh-button-gold" onClick={enterKashi} disabled={entering}>Enter Kashi <ArrowRight size={17} /></button>
          </div>
          <div className="sh-hero-foot"><span>THE ETERNAL CITY · AN ETERNAL PROMISE</span><a href="#our-invitation" aria-label="Skip to our invitation"><ArrowDown size={18} /></a><span>VARANASI, INDIA</span></div>
        </section>

        <section id="kashi" className="sh-river-scene" tabIndex={-1} aria-labelledby="kashi-title">
          <Suspense fallback={null}><Scene kind="river" paused={paused} reduced={reduced} /></Suspense>
          <div className="sh-river-shade" />
          <div className="sh-river-copy sh-container"><span className="sh-scene-number">01 / THE JOURNEY</span><p lang="hi" className="sh-hindi sh-kashi-hindi">काशी की पावन धरती पर</p><h2 id="kashi-title">In the eternal<br />city of <em>Kashi.</em></h2><p>Where the sacred Ganga flows and blessings<br className="sh-desktop-break" /> illuminate every new beginning.</p><div className="sh-divider"><span /><Flower2 size={22} strokeWidth={1} /><span /></div></div>
          <a className="sh-river-next" href="#our-invitation">A sacred invitation <ArrowDown size={16} /></a>
        </section>

        <section id="our-invitation" tabIndex={-1} className="sh-invitation-section sh-section-light" aria-labelledby="invitation-title"><div className="sh-container">
          <div className="sh-section-heading sh-reveal"><span className="sh-small-label">02 / A promise, blessed</span><h2 id="invitation-title">Some beginnings<br />are <em>written above.</em></h2><p>A celebration of two hearts, two families, and a lifetime together.</p></div>
          <InvitationReveal reduced={reduced} paused={paused} />
        </div></section>

        <WeddingDetails />

        <section className="sh-mandap-scene" aria-labelledby="mandap-title"><Suspense fallback={null}><Scene kind="mandap" paused={paused} reduced={reduced} /></Suspense><div className="sh-mandap-shade" /><div className="sh-mandap-copy sh-reveal"><span className="sh-small-label">A new chapter begins</span><h2 id="mandap-title">Under a canopy<br />of <em>blessings.</em></h2><p>May this union be blessed with love, harmony,<br className="sh-desktop-break" /> and the grace of Mahadev.</p></div></section>

        <section id="rsvp" tabIndex={-1} className="sh-rsvp sh-section-light" aria-labelledby="rsvp-title"><div className="sh-container sh-rsvp-grid"><div className="sh-reveal"><span className="sh-small-label">Your presence is our greatest gift</span><h2 id="rsvp-title">Come for the vows.<br /><em>Stay for the joy.</em></h2><div className="sh-divider"><span /><Flower2 size={24} strokeWidth={1} /><span /></div><p>Let us know whether we will have the pleasure of celebrating with you.</p>{deadline?.isValid && <p className="sh-rsvp-deadline">Kindly reply by {deadline.toFormat('dd LLLL yyyy')}.</p>}</div><Rsvp reduced={reduced || paused} /></div></section>

        <Venue />

        <section className="sh-blessings" aria-labelledby="blessings-title"><Suspense fallback={null}><Scene kind="blessings" paused={paused} reduced={reduced} /></Suspense><div className="sh-blessings-shade" /><div className="sh-blessings-copy sh-reveal"><Flower2 size={28} strokeWidth={0.8} /><h2 id="blessings-title" lang="hi">हर हर महादेव</h2><p>Thank you for being part<br />of our special beginning.</p><div className="sh-divider"><span /><span className="sh-divider-dot" /><span /></div><span className="sh-small-label">With love</span><h3>{names[0]} <em>&</em> {names[1]}</h3><a className="sh-text-link" href="#wedding-details">Back to wedding details <ArrowUp size={15} /></a></div></section>
      </main>
      <footer className="sh-footer"><a href="#home">SHIVOHAM</a><span>With love. With blessings. In Kashi.</span><span lang="sa">ॐ नमः शिवाय</span></footer>
    </div>
  </MotionConfig>
}