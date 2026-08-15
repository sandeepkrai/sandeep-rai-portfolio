import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown, ArrowUpRight, Award, ExternalLink, FileText, Github, Linkedin, Mail, MapPin,
  Menu, Phone, Sparkles, X,
} from 'lucide-react'
import {
  achievements, education, experiences, impactMetrics, profile, project, skills,
} from './immersiveData'
import './immersive.css'

const chapters = [
  { id: 'intro', label: 'Index' }, { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' }, { id: 'project', label: 'Project' },
  { id: 'recognition', label: 'Recognition' }, { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
]

function AmbientField({ activeTheme, pointer }) {
  return (
    <div className={`ambient-field theme-${activeTheme}`} aria-hidden="true">
      <div className="ambient-sun" style={{ transform: `translate(${pointer.x * 18}px, ${pointer.y * 18}px)` }} />
      <div className="ambient-orbit orbit-one" /><div className="ambient-orbit orbit-two" />
      <div className="ambient-grid" />
      <div className="signal-map" style={{ transform: `translate(${pointer.x * -10}px, ${pointer.y * -8}px)` }}>
        {Array.from({ length: 18 }, (_, index) => <span key={index} style={{ '--i': index }} />)}
      </div>
      <div className="ambient-noise" />
    </div>
  )
}

function SectionLabel({ number, children }) {
  return <div className="section-label"><span>{number}</span><p>{children}</p></div>
}

function ExperienceChapter({ experience, onActive }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onActive(experience),
      { rootMargin: '-30% 0px -45% 0px', threshold: 0.05 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [experience, onActive])

  return (
    <article className="experience-chapter" id={experience.id} ref={sectionRef} style={{ '--chapter-accent': experience.accent }}>
      <div className="chapter-index"><span>{experience.index}</span><div /><p>{experience.period}</p></div>
      <div className="chapter-content">
        <div className="chapter-heading">
          <p>{experience.role}</p><h3>{experience.organization}</h3>
          {experience.context && <span>{experience.context}</span>}
        </div>
        <p className="chapter-lead">{experience.lead}</p>
        <div className="chapter-location"><MapPin size={14} /> {experience.location}</div>
        <div className="chapter-points">
          {experience.points.map((point, index) => (
            <div className="chapter-point" key={point}><span>0{index + 1}</span><p>{point}</p></div>
          ))}
        </div>
        <div className="tag-list">{experience.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {experience.certificate && (
          <a className="text-link" href={experience.certificate} target="_blank" rel="noreferrer">
            View certificate <ExternalLink size={15} />
          </a>
        )}
      </div>
    </article>
  )
}

export default function ImmersiveApp() {
  const [activeSection, setActiveSection] = useState('intro')
  const [activeExperience, setActiveExperience] = useState(experiences[0])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(available > 0 ? (window.scrollY / available) * 100 : 0)
    }
    const updatePointer = (event) => setPointer({
      x: (event.clientX / window.innerWidth - 0.5) * 2,
      y: (event.clientY / window.innerHeight - 0.5) * 2,
    })
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })
    updateScroll()
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', updatePointer)
    }
  }, [])

  useEffect(() => {
    const observers = chapters.map(({ id }) => {
      const section = document.getElementById(id)
      if (!section) return null
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveSection(id),
        { rootMargin: '-38% 0px -50% 0px', threshold: 0 },
      )
      observer.observe(section)
      return observer
    })
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [])

  const navigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main className="experience-shell">
      <AmbientField activeTheme={activeExperience.theme} pointer={pointer} />
      <div className="scroll-progress"><span style={{ height: `${scrollProgress}%` }} /></div>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => navigate('intro')} aria-label="Return to introduction">
          <span>SR</span><div><strong>{profile.name}</strong><small>{profile.role}</small></div>
        </button>
        <nav className="desktop-nav" aria-label="Portfolio sections">
          {chapters.slice(1).map((chapter) => (
            <button className={activeSection === chapter.id ? 'active' : ''} type="button" key={chapter.id} onClick={() => navigate(chapter.id)}>{chapter.label}</button>
          ))}
        </nav>
        <div className="header-actions">
          <a className="resume-link" href="https://drive.google.com/file/d/18Z7c-kTwEUR5Zel1bmq2FtLyd-s9L9J_/view?usp=sharing" target="_blank" rel="noreferrer" aria-label="View Sandeep Kumar Rai's resume" title="View resume">
            <FileText size={16} /><span>Resume</span><ExternalLink size={13} />
          </a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" title="Menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile portfolio sections">
          {chapters.map((chapter, index) => <button type="button" key={chapter.id} onClick={() => navigate(chapter.id)}><span>0{index + 1}</span>{chapter.label}</button>)}
        </nav>
      )}

      <aside className="chapter-rail" aria-label="Page progress">
        {chapters.map((chapter, index) => (
          <button className={activeSection === chapter.id ? 'active' : ''} type="button" key={chapter.id} onClick={() => navigate(chapter.id)} aria-label={`Go to ${chapter.label}`} title={chapter.label}>
            <span>0{index + 1}</span><i />
          </button>
        ))}
      </aside>

      <section className="intro-section" id="intro">
        <div className="intro-coordinate"><MapPin size={13} /> {profile.location}</div>
        <div className="intro-copy">
          <p className="eyebrow">ENGINEER · SYSTEMS THINKER · BUILDER</p>
          <h1><span>Sandeep</span><span>Kumar Rai</span></h1>
          <p className="intro-statement">{profile.statement}</p>
          <button className="explore-button" type="button" onClick={() => navigate('experience')}>Explore the work <ArrowDown size={18} /></button>
        </div>
        <div className="impact-strip">
          {impactMetrics.map((metric) => <div className="impact-metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        </div>
        <div className="intro-monogram" aria-hidden="true">SR</div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-intro">
          <SectionLabel number="01">Experience</SectionLabel>
          <h2>A career shaped by <em>measurable impact.</em></h2>
          <p>Move through the chapters. The environment shifts with the kind of problem being solved.</p>
        </div>
        <div className="experience-layout">
          <aside className="experience-visual" style={{ '--visual-accent': activeExperience.accent }}>
            <p>NOW VIEWING</p><strong>{activeExperience.organization}</strong><span>{activeExperience.role}</span>
            <div className={`visual-instrument instrument-${activeExperience.theme}`}>
              <div className="instrument-core"><span>{activeExperience.index}</span></div><i /><i /><i /><i /><i /><i />
            </div>
            <small>{activeExperience.period}</small>
          </aside>
          <div className="experience-list">
            {experiences.map((experience) => <ExperienceChapter key={experience.id} experience={experience} onActive={setActiveExperience} />)}
          </div>
        </div>
      </section>

      <section className="education-section" id="education">
        <SectionLabel number="02">Education</SectionLabel>
        <div className="education-layout">
          <div><p className="eyebrow">THE FOUNDATION</p><h2>{education.institution}</h2><p className="education-degree">{education.degree}</p><div className="education-meta"><span>{education.period}</span><span>{education.location}</span></div></div>
          <div className="cgpa-figure"><span>CGPA</span><strong>{education.cgpa}</strong><small>/ 10</small></div>
          <div className="education-highlights">
            {education.highlights.map((highlight, index) => <div key={highlight}><span>0{index + 1}</span><p>{highlight}</p></div>)}
          </div>
        </div>
      </section>

      <section className="project-section" id="project">
        <SectionLabel number="03">Selected project</SectionLabel>
        <div className="project-layout">
          <div className="project-title"><p>{project.period}</p><h2>{project.name}</h2><span>{project.subtitle}</span></div>
          <div className="mobility-map" aria-hidden="true">
            <div className="route route-a" /><div className="route route-b" /><span className="map-node node-a" /><span className="map-node node-b" /><span className="map-node node-c" /><strong>LESS CARBON</strong><strong>MORE ACCESS</strong>
          </div>
          <div className="project-copy">
            <p>{project.description}</p>
            {project.details.map((detail) => <div className="project-detail" key={detail}><Sparkles size={15} /><span>{detail}</span></div>)}
            <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <a className="primary-link" href={project.link} target="_blank" rel="noreferrer">Explore on GitHub <Github size={18} /></a>
          </div>
        </div>
      </section>

      <section className="recognition-section" id="recognition">
        <SectionLabel number="04">Recognition</SectionLabel>
        <div className="recognition-heading"><Award size={28} /><h2>Built with teams.<br />Recognized in the arena.</h2></div>
        <div className="achievement-list">
          {achievements.map((achievement, index) => (
            <article key={achievement.title}><span className="achievement-number">{achievement.place}</span><div><small>0{index + 1}</small><h3>{achievement.title}</h3></div><p>{achievement.result}</p><strong>{achievement.prize}</strong></article>
          ))}
        </div>
      </section>

      <section className="capabilities-section" id="capabilities">
        <SectionLabel number="05">Capabilities</SectionLabel>
        <div className="capabilities-layout"><div><p className="eyebrow">THE TOOLKIT</p><h2>From architecture<br />to implementation.</h2></div><div className="skill-cloud">{skills.map((skill, index) => <span key={skill} style={{ '--skill-index': index }}>{skill}</span>)}</div></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy"><p className="eyebrow">OPEN CHANNEL</p><h2>Let’s build systems<br />that <em>hold up.</em></h2><p>Based in Bengaluru and working across distributed systems, cloud infrastructure, and intelligent automation.</p></div>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}><Mail size={20} /><span><small>EMAIL</small>{profile.email}</span><ArrowUpRight size={21} /></a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`}><Phone size={20} /><span><small>PHONE</small>{profile.phone}</span><ArrowUpRight size={21} /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /><span><small>LINKEDIN</small>rai-sandeep</span><ArrowUpRight size={21} /></a>
        </div>
        <footer><span>© {new Date().getFullYear()} {profile.name}</span><button type="button" onClick={() => navigate('intro')}>Back to index <ArrowDown size={14} /></button></footer>
      </section>
    </main>
  )
}