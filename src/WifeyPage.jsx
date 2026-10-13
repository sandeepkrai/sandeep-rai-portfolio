import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Heart, MailOpen, Plus, Minus } from 'lucide-react'
import khushiPortrait from './khushi-rai.jpg'
import './wifey.css'

export default function WifeyPage() {
  const [letterOpen, setLetterOpen] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    const theme = document.querySelector('meta[name="theme-color"]')
    const previousTheme = theme?.content
    const existingRobots = document.querySelector('meta[name="robots"]')
    const robots = existingRobots || document.createElement('meta')
    const previousRobots = robots.content
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    if (!existingRobots) document.head.appendChild(robots)
    document.title = 'Khushi Rai | With love, Sandeep'
    if (description) description.content = 'For Khushi. A little corner of the world, made with love by Sandeep.'
    if (theme) theme.content = '#472632'
    document.documentElement.classList.add('wifey-document')
    return () => {
      document.title = previousTitle
      if (description) description.content = previousDescription
      if (theme) theme.content = previousTheme
      if (existingRobots) robots.content = previousRobots
      else robots.remove()
      document.documentElement.classList.remove('wifey-document')
    }
  }, [])

  return (
    <main className="wifey-page">
      <header className="wifey-header">
        <a href="#khushi" aria-label="Khushi, back to the top" className="wifey-monogram">S <Heart size={14} aria-hidden="true" /> K</a>
        <span>A little world, just for you</span>
        <a href="#love-note" className="wifey-note-link">With love <ArrowDown size={14} aria-hidden="true" /></a>
      </header>

      <section className="wifey-hero" id="khushi" aria-labelledby="khushi-title">
        <img className="wifey-portrait" src={khushiPortrait} alt="Khushi Rai" fetchPriority="high" width="1145" height="1374" />
        <div className="wifey-hero-shade" />
        <div className="wifey-hero-copy">
          <p className="wifey-kicker">My wife. My love.</p>
          <h1 id="khushi-title">Khushi<br /><em>Rai.</em></h1>
          <p className="wifey-hero-message">Of all the things I could make,<br />this little world is for you.</p>
          <a href="#her-world" className="wifey-round-link" aria-label="Discover Khushi's world"><ArrowDown size={22} /></a>
        </div>
        <span className="wifey-hero-caption">You, always.</span>
        <div className="wifey-hero-bottom"><span>Dedicated to my favourite person</span><span>From Sandeep, with love</span></div>
      </section>

      <section className="wifey-world" id="her-world" aria-labelledby="her-world-title">
        <div className="wifey-section-top"><span>01 / Her world</span><Heart size={20} aria-hidden="true" /></div>
        <div className="wifey-world-heading">
          <h2 id="her-world-title">A curious mind.<br /><em>A world of her own.</em></h2>
          <p>There is so much to celebrate about you. The subjects you love, the knowledge you share, and the future you are building.</p>
        </div>
        <div className="wifey-details">
          <article><span>Learning</span><h3>The science of life</h3><p>MSc Zoology student, with Mahatma Gandhi Kashi Vidyapeeth listed on her profile.</p></article>
          <article><span>Teaching</span><h3>Sharing the wonder</h3><p>A biology and zoology teacher, and a science educator passionate about making learning engaging.</p></article>
          <article><span>Her next chapter</span><h3>Room to grow</h3><p>Based in the Greater Bengaluru Area, bringing her love of science to teaching and learning.</p></article>
        </div>
        <a className="wifey-profile-link" href="https://www.linkedin.com/in/khushi-rai-58b16a330/" target="_blank" rel="noopener noreferrer">Khushi's professional world <ArrowUpRight size={17} aria-hidden="true" /></a>
      </section>

      <section className="wifey-letter-section" id="love-note" aria-labelledby="love-note-title">
        <div className="wifey-section-top"><span>02 / Just between us</span><MailOpen size={21} aria-hidden="true" /></div>
        <p className="wifey-letter-eyebrow">A note for my wife</p>
        <h2 id="love-note-title">In a world of so much,<br /><em>it is still you.</em></h2>
        <button className="wifey-letter-toggle" onClick={() => setLetterOpen(!letterOpen)} aria-expanded={letterOpen} aria-controls="wifey-letter">
          {letterOpen ? 'Close your letter' : 'Open your letter'}
          {letterOpen ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
        </button>
        <div className="wifey-letter" id="wifey-letter" hidden={!letterOpen}>
          <p className="wifey-salutation">My dear Khushi,</p>
          <p>This little corner of the internet is for you. Not for an occasion, not for a reason. Just because you are my wife, and I love you.</p>
          <p>I want to celebrate the person you are and the dreams that are yours. There is room here for all of you: the student, the teacher, and the woman I am so happy to call my wife.</p>
          <p>Whatever the next chapter holds, I want you to know this: I am cheering for you. For your dreams, your joy, and all the things you have yet to become.</p>
          <p>Here is to you. Here is to us.</p>
          <p className="wifey-signature">Always yours,<br /><span>Sandeep</span></p>
        </div>
      </section>

      <footer className="wifey-footer">
        <Heart size={25} strokeWidth={1.2} aria-hidden="true" />
        <p>My favourite chapter<br />will always be <em>us.</em></p>
        <div><span>Khushi & Sandeep</span><span>Made with all my love.</span></div>
      </footer>
    </main>
  )
}