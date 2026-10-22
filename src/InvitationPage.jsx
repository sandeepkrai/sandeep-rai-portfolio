import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, CalendarPlus, Check, Flower2, MapPin, Moon, Pause, Play, Printer, Share2, Sun } from 'lucide-react'
import weddingArtwork from './shiva-parvati-modern.jpg'
import './invitation.css'

const InvitationScene = lazy(() => import('./InvitationScene'))
const InvitationBackdrop = lazy(() => import('./InvitationBackdrop'))

const invitation = {
  names: 'Sandeep & Khusi',
  date: '25 November 2026',
  startDate: '20261125',
  endDate: '20261126',
  venue: 'Haveli Seva Kunj',
  city: 'Varanasi',
}

const calendarUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: 'TEMPLATE',
  text: `${invitation.names} - Wedding`,
  dates: `${invitation.startDate}/${invitation.endDate}`,
  details: 'With the blessings of Shiva and Parvati, please join us to celebrate our wedding. Ceremony time to be confirmed.',
  location: `${invitation.venue}, ${invitation.city}`,
})}`
const directionsUrl = `https://www.google.com/maps/search/?${new URLSearchParams({
  api: '1',
  query: `${invitation.venue}, ${invitation.city}`,
})}`

export default function InvitationPage() {
  const [shareStatus, setShareStatus] = useState('')
  const [sharing, setSharing] = useState(false)
  const [paused, setPaused] = useState(false)
  const [dusk, setDusk] = useState(false)
  const journey = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    journey.current.querySelectorAll('.invitation-reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const previousTitle = document.title
    const previousMetadata = new Map()
    const metadata = {
      description: 'With the blessings of Shiva and Parvati, join Sandeep and Khusi on 25 November 2026 at Haveli Seva Kunj, Varanasi.',
      'theme-color': '#dceee9',
      robots: 'noindex, nofollow',
    }
    Object.entries(metadata).forEach(([name, content]) => {
      const existing = document.querySelector(`meta[name="${name}"]`)
      const element = existing || document.createElement('meta')
      previousMetadata.set(element, existing ? existing.content : null)
      element.name = name
      element.content = content
      if (!existing) document.head.appendChild(element)
    })
    document.title = `${invitation.names} | Wedding Invitation`
    document.documentElement.classList.add('invitation-document')
    return () => {
      document.title = previousTitle
      document.documentElement.classList.remove('invitation-document')
      previousMetadata.forEach((content, element) => {
        if (content === null) element.remove()
        else element.content = content
      })
    }
  }, [])

  async function shareInvitation() {
    setSharing(true)
    setShareStatus('')
    const url = new URL('/invitation', window.location.origin).href
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${invitation.names} | Wedding Invitation`,
          text: `Join us on ${invitation.date} at ${invitation.venue}, ${invitation.city}.`,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setShareStatus('Invitation link copied')
      }
    } catch (error) {
      if (error.name !== 'AbortError') setShareStatus('Unable to share. Please copy the page address from your browser.')
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className={`invitation-page ${dusk ? 'invitation-dusk' : ''} ${paused ? 'invitation-paused' : ''}`}>
      <div className="invitation-toolbar">
        <span className="invitation-monogram">S <span>&</span> K</span>
        <span className="invitation-toolbar-date">25 NOVEMBER 2026</span>
        <div className="invitation-tools">
          <button type="button" onClick={() => window.print()} aria-label="Print invitation" title="Print invitation"><Printer size={18} /></button>
          <button type="button" onClick={shareInvitation} disabled={sharing} aria-label="Share invitation" title="Share invitation"><Share2 size={18} /></button>
        </div>
      </div>

      <main className="invitation-sheet">
        <section className="invitation-hero" aria-labelledby="invitation-names">
          <Suspense fallback={<div className="divine-scene"><img className="divine-scene-fallback" src={weddingArtwork} alt="Contemporary Shiva and Parvati sculptures" width="600" height="450" /></div>}>
            <InvitationScene paused={paused} dusk={dusk} />
          </Suspense>
          <div className="divine-vignette" aria-hidden="true" />
          <div className="invitation-hero-copy">
            <p className="invitation-mantra" lang="sa">&#2384; &#2344;&#2350;&#2307; &#2358;&#2367;&#2357;&#2366;&#2351;</p>
            <p className="invitation-eyebrow">The wedding invitation</p>
            <h1 id="invitation-names"><span>Sandeep</span><em>&</em><span>Khusi</span></h1>
            <p className="invitation-promise">Two souls. One sacred beginning.</p>
            <p className="invitation-hero-date">25 November 2026 <span /> Varanasi</p>
            <a className="invitation-scroll" href="#celebration"><span>Join our celebration</span><ArrowDown size={18} strokeWidth={1.4} aria-hidden="true" /></a>
          </div>
          <div className="invitation-hero-footer"><span>With the blessings of Shiva & Parvati</span><span>A celebration in the heart of Kashi</span></div>
        </section>

        <div className="invitation-journey" ref={journey}>
        <div className="invitation-backdrop-shell">
          <div className="trishul-fallback" aria-hidden="true"><span /></div>
          <Suspense fallback={null}><InvitationBackdrop paused={paused} dusk={dusk} /></Suspense>
        </div>
        <section className="invitation-devotion" aria-labelledby="devotion-title">
          <div className="devotion-art invitation-reveal">
            <span className="devotion-art-border" aria-hidden="true" />
            <img src={weddingArtwork} alt="White Shiva and Parvati sculptures at Kailasagiri, photographed by Billjones94" width="600" height="450" loading="lazy" />
            <Flower2 className="devotion-flower" size={66} strokeWidth={0.7} aria-hidden="true" />
          </div>
          <div className="devotion-copy invitation-reveal">
            <p className="invitation-eyebrow">An eternal blessing</p>
            <h2 id="devotion-title">Where love becomes<br /><em>a sacred promise.</em></h2>
            <div className="invitation-ornament" aria-hidden="true"><span /><Flower2 size={24} strokeWidth={1} /><span /></div>
            <p>With the divine blessings of <strong>Lord Shiva & Goddess Parvati</strong>, and the love of our families, we invite you to witness the beginning of our forever.</p>
            <p>Come celebrate a union of hearts, surrounded by the people who make our world complete.</p>
            <span className="devotion-signature">Sandeep & Khusi</span>
          </div>
        </section>

        <section className="invitation-celebration" id="celebration" aria-labelledby="celebration-title">
          <div className="celebration-heading invitation-reveal"><p className="invitation-eyebrow">Save the date</p><h2 id="celebration-title">A day for <em>forever.</em></h2></div>
          <div className="celebration-layout">
          <div className="celebration-day invitation-reveal">
          <div className="invitation-date" aria-label="Wednesday, 25 November 2026">
            <span>Wednesday</span><strong>25</strong><span>November<br /><small>2026</small></span>
          </div>
          <p className="date-dedication">One beautiful day.<br />A lifetime of togetherness.</p>
          <a className="invitation-calendar" href={calendarUrl} target="_blank" rel="noopener noreferrer"><CalendarPlus size={17} aria-hidden="true" /> Add to calendar</a>
          </div>
          <div className="celebration-venue invitation-reveal">
          <Flower2 size={35} strokeWidth={0.8} aria-hidden="true" />
          <p className="invitation-eyebrow invitation-at">The celebration</p>
          <h3>{invitation.venue}</h3>
          <p className="invitation-city"><MapPin size={15} strokeWidth={1.5} aria-hidden="true" /> {invitation.city}</p>
          <p className="invitation-location-note">In the sacred city of Kashi</p>
          <div className="invitation-actions">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17} aria-hidden="true" /> Get directions <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          </div>
          </div>
        </section>

        <section className="invitation-closing invitation-reveal" aria-label="A note to our guests">
          <Flower2 size={32} strokeWidth={1} aria-hidden="true" />
          <p>Your presence, your love,<br />and your blessings are our greatest gifts.</p>
          <span>We look forward to celebrating with you.</span>
          <strong>With love, Sandeep & Khusi</strong>
          <div className="invitation-ornament" aria-hidden="true"><span /><Flower2 size={20} strokeWidth={1} /><span /></div>
        </section>
        </div>
      </main>

      <div className="invitation-scene-controls">
        <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play all animations' : 'Pause all animations'} title={paused ? 'Play all animations' : 'Pause all animations'} aria-pressed={paused}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
        <button type="button" onClick={() => setDusk(!dusk)} aria-label={dusk ? 'Switch to daylight' : 'Switch to evening light'} title={dusk ? 'Switch to daylight' : 'Switch to evening light'} aria-pressed={dusk}>{dusk ? <Sun size={19} /> : <Moon size={18} />}</button>
      </div>
      <footer className="invitation-footer">
        <span>Sandeep & Khusi <span aria-hidden="true">/</span> 25.11.2026</span>
        <button type="button" onClick={shareInvitation} disabled={sharing}><Share2 size={15} aria-hidden="true" /> Share invitation</button>
        <div className="invitation-art-credit"><a href="https://commons.wikimedia.org/wiki/File:Lord_Shiva_and_Parvati_statue_in_Visakhapatnam.jpg" target="_blank" rel="noopener noreferrer">Photo: Billjones94</a><span> / cropped / </span><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></div>
      </footer>
      <div className="invitation-share-status" role="status" aria-live="polite">{shareStatus && <>{shareStatus === 'Invitation link copied' && <Check size={16} aria-hidden="true" />}{shareStatus}</>}</div>
    </div>
  )
}