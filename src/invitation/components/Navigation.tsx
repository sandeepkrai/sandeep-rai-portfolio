import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'
import { wedding } from '../../config/wedding'

const links = [['home', 'Home'], ['our-invitation', 'Our invitation'], ['wedding-details', 'Wedding details'], ['venue', 'Venue'], ['rsvp', 'RSVP']]

export default function Navigation({ paused, onPause, reduced }: { paused: boolean; onPause: () => void; reduced: boolean }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [playing, setPlaying] = useState(false)
  const [audioError, setAudioError] = useState('')
  const audio = useRef<HTMLAudioElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const audioSource = wedding.audio.src.startsWith('/') && !wedding.audio.src.startsWith('//') ? wedding.audio.src : ''
  useEffect(() => {
    const update = () => {
      let current = 'home'
      links.forEach(([id]) => { const section = document.getElementById(id); if (section && section.getBoundingClientRect().top <= innerHeight * 0.4) current = id })
      setActive(current)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() } }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])
  async function toggleAudio() {
    if (!audio.current) return
    try {
      if (playing) audio.current.pause()
      else { audio.current.volume = 0.25; await audio.current.play() }
      setPlaying(!playing)
      setAudioError('')
    } catch { setAudioError('Audio is unavailable. You can enjoy the invitation without sound.'); setPlaying(false) }
  }
  return <>
    <a className="sh-skip-link" href="#wedding-details">Skip to wedding details</a>
    <header className={`sh-nav ${active !== 'home' ? 'sh-nav-solid' : ''}`}>
      <a className="sh-brand" href="#home" aria-label="Shivoham home"><span lang="sa">ॐ</span><span>SHIVOHAM<small>A celebration in Kashi</small></span></a>
      <nav className="sh-desktop-nav" aria-label="Main navigation">{links.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav>
      <div className="flex items-center gap-2">
        {audioSource && <><audio ref={audio} src={audioSource} preload="none" loop onError={() => { setPlaying(false); setAudioError('Audio is unavailable.') }} /><button className="sh-icon-button" onClick={toggleAudio} aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'} title={wedding.audio.title || 'Ambient sound'}>{playing ? <Volume2 size={18} /> : <VolumeX size={18} />}</button></>}
        <button className="sh-icon-button" onClick={onPause} disabled={reduced} aria-label={reduced ? 'Reduced motion enabled' : paused ? 'Play animations' : 'Pause animations'} title={reduced ? 'Reduced motion enabled' : paused ? 'Play animations' : 'Pause animations'} aria-pressed={paused || reduced}>{paused || reduced ? <Play size={17} /> : <Pause size={17} />}</button>
        <button ref={menuButton} className="sh-icon-button sh-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="sh-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </header>
    <AnimatePresence>{open && <motion.nav id="sh-mobile-menu" className="sh-mobile-nav" aria-label="Mobile navigation" initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>{links.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => { setOpen(false); document.getElementById(id)?.focus({ preventScroll: true }) }}>{label}</a>)}</motion.nav>}</AnimatePresence>
    {audioError && <p className="sh-toast" role="status">{audioError}</p>}
  </>
}