import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flower2, MailOpen } from 'lucide-react'
import { wedding } from '../../config/wedding'

export default function InvitationReveal({ reduced, paused }: { reduced: boolean; paused: boolean }) {
  const [open, setOpen] = useState(false)
  const immediate = reduced || paused
  return <div className={`sh-paper-stage ${open ? 'is-open' : ''}`}>
    <article className="sh-invitation-paper" aria-label="Wedding invitation">
      <Flower2 className="sh-paper-flower" size={32} strokeWidth={0.8} aria-hidden="true" />
      <p className="sh-small-label">Together with our families</p>
      <h3>{wedding.partners[0] || '[Partner one name]'}<em>&</em>{wedding.partners[1] || '[Partner two name]'}</h3>
      <div className="sh-divider"><span /><Flower2 size={20} strokeWidth={1} /><span /></div>
      <p>{wedding.messages.english}</p>
      <p lang="hi" className="sh-hindi">{wedding.messages.hindi}</p>
      {wedding.families.length > 0 && <p className="sh-paper-families">{wedding.families.join(' · ')}</p>}
    </article>
    <motion.div className="sh-paper-door sh-paper-left" aria-hidden="true" animate={{ rotateY: open ? -165 : 0 }} transition={{ duration: immediate ? 0 : 1.6, ease: [0.22, 0.61, 0.36, 1] }}><span className="sh-door-border" /><Flower2 size={76} strokeWidth={0.45} /></motion.div>
    <motion.div className="sh-paper-door sh-paper-right" aria-hidden="true" animate={{ rotateY: open ? 165 : 0 }} transition={{ duration: immediate ? 0 : 1.6, ease: [0.22, 0.61, 0.36, 1] }}><span className="sh-door-border" /><Flower2 size={76} strokeWidth={0.45} /></motion.div>
    {!open && <button className="sh-seal" type="button" aria-label="Open wedding invitation" onClick={() => setOpen(true)}><span lang="sa">ॐ</span><small>OPEN INVITATION</small><MailOpen size={16} aria-hidden="true" /></button>}
    {open && <button className="sh-paper-close" type="button" onClick={() => setOpen(false)}>Close invitation</button>}
  </div>
}