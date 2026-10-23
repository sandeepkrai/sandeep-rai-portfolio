import { useState } from 'react'
import { DateTime } from 'luxon'
import { ArrowUpRight, CalendarDays, Check, Copy, Flower2, MapPin } from 'lucide-react'
import { wedding } from '../../config/wedding'
import { directions, eventDate } from '../event'
import Countdown from './Countdown'

export function WeddingDetails() {
  const date = eventDate(wedding)
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(wedding.date) ? DateTime.fromISO(wedding.date, { zone: wedding.timezone }) : null
  const knownDate = dateOnly?.isValid ? dateOnly : null
  return <section id="wedding-details" className="sh-details sh-section-light" tabIndex={-1} aria-labelledby="details-title">
    <div className="sh-container"><div className="sh-section-heading sh-reveal"><span className="sh-small-label">The beginning of forever</span><h2 id="details-title">A day written<br /><em>in the stars.</em></h2></div>
      <div className="sh-event-grid sh-reveal">
        <div className="sh-date-block"><CalendarDays size={23} strokeWidth={1} /><span>{knownDate ? knownDate.toFormat('cccc') : '[Day of the week]'}</span><strong>{knownDate ? knownDate.toFormat('dd') : '—'}</strong><p>{knownDate ? knownDate.toFormat('LLLL yyyy') : '[Wedding date]'}</p><small>{date ? date.toFormat('h:mm a') : '[Ceremony time]'} · {wedding.timezone || 'Asia/Kolkata'}</small></div>
        <div className="sh-detail-copy"><Flower2 size={34} strokeWidth={0.8} /><span className="sh-small-label">The wedding celebration</span><h3>{wedding.venue.name || '[Venue name]'}</h3><p>{wedding.venue.address || '[Venue address, Varanasi]'}</p>{wedding.dressCode && <p><strong>Dress code:</strong> {wedding.dressCode}</p>}{wedding.messages.family && <p>{wedding.messages.family}</p>}<a className="sh-text-link" href="#venue">Venue & travel <ArrowUpRight size={16} /></a></div>
      </div>
      <Countdown target={date?.toMillis() ?? null} />
      {wedding.schedule.length > 0 && <div className="sh-schedule">{wedding.schedule.filter(event => event.name.trim()).map((event, index) => <article key={`${event.name}-${index}`}><span className="sh-small-label">{String(index + 1).padStart(2, '0')}</span><h3>{event.name}</h3><p>{eventDate({ ...event, timezone: wedding.timezone })?.toFormat('dd LLLL · h:mm a') || 'Date and time to be confirmed'}</p>{event.venue && <p>{event.venue}</p>}</article>)}</div>}
    </div>
  </section>
}

export function Venue() {
  const link = directions(wedding.venue)
  const [copyStatus, setCopyStatus] = useState('')
  async function copyAddress() {
    try { await navigator.clipboard.writeText(wedding.venue.address); setCopyStatus('Address copied') }
    catch { setCopyStatus('Copy unavailable. Please select the address above and copy it.') }
  }
  return <section id="venue" className="sh-venue sh-section-light" tabIndex={-1} aria-labelledby="venue-title"><div className="sh-container sh-venue-grid">
    <div className="sh-reveal"><span className="sh-small-label">Meet us in the eternal city</span><h2 id="venue-title">All roads lead<br /><em>to Kashi.</em></h2><h3>{wedding.venue.name || '[Venue name]'}</h3><p>{wedding.venue.address || '[Venue address, Varanasi]'}</p>{wedding.venue.travel && <p>{wedding.venue.travel}</p>}<div className="sh-venue-actions">{link ? <a className="sh-button sh-button-dark" href={link} target="_blank" rel="noopener noreferrer"><MapPin size={16} /> Get directions <ArrowUpRight size={16} /></a> : <button className="sh-button sh-button-dark" disabled><MapPin size={16} /> Directions pending</button>}<button className="sh-icon-button sh-light-icon" onClick={copyAddress} disabled={!wedding.venue.address.trim()} aria-label="Copy venue address" title="Copy venue address">{copyStatus === 'Address copied' ? <Check size={18} /> : <Copy size={18} />}</button></div><p className="sh-copy-status" role="status">{copyStatus || (!link ? 'Directions will be available once the venue address is confirmed.' : '')}</p></div>
    <div className="sh-venue-engraving sh-reveal" aria-hidden="true"><span className="sh-engraving-moon" /><div className="sh-engraving-temples">{[0, 1, 2, 3, 4, 5, 6].map(index => <span key={index} style={{ height: `${45 + index % 3 * 20}%` }} />)}</div><div className="sh-engraving-water" /><span className="sh-engraving-word" lang="hi">काशी</span><small>THE ETERNAL CITY</small></div>
    {wedding.contacts.length > 0 && <div className="sh-contacts"><h3>For any assistance</h3>{wedding.contacts.filter(contact => /^\+?[\d ()-]{6,20}$/.test(contact.phone)).map(contact => <a key={contact.phone} href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.name}: {contact.phone}</a>)}</div>}
  </div></section>
}