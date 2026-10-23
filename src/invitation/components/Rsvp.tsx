import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCircle2, LoaderCircle, Send, X } from 'lucide-react'
import { safeLink, validateRsvp, type RsvpPayload } from '../event'

const configuredEndpoint = (import.meta.env.VITE_RSVP_ENDPOINT || '').trim()
const endpoint = /^\/(?!\/)/.test(configuredEndpoint) ? configuredEndpoint : safeLink(configuredEndpoint)

export default function Rsvp({ reduced }: { reduced: boolean }) {
  const [attendance, setAttendance] = useState<'accept' | 'decline'>('accept')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'demo' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const pending = useRef(false)
  const controller = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  const request = useRef({ payload: '', key: '' })
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; controller.current?.abort() } }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current || status === 'success') return
    const form = event.currentTarget
    const data = new FormData(form)
    const payload: RsvpPayload = {
      name: String(data.get('guestName') || '').trim(), attendance,
      attendees: attendance === 'decline' ? 0 : Number(data.get('attendees')),
      message: String(data.get('message') || '').trim(),
    }
    const issues = validateRsvp(payload)
    setErrors(issues)
    if (Object.keys(issues).length) {
      setStatus('idle')
      const field = issues.name ? 'guestName' : issues.attendees ? 'attendees' : 'message'
      ;(form.elements.namedItem(field) as HTMLElement | null)?.focus()
      return
    }
    if (!endpoint) {
      setStatus('demo')
      setMessage('Preview mode: your details are valid, but nothing has been sent or saved. RSVP collection is not connected yet.')
      return
    }
    pending.current = true
    setStatus('sending')
    const body = JSON.stringify(payload)
    if (request.current.payload !== body) request.current = { payload: body, key: crypto.randomUUID() }
    controller.current = new AbortController()
    const timeout = setTimeout(() => controller.current?.abort(), 15000)
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': request.current.key }, body, signal: controller.current.signal })
      if (!response.ok) throw new Error('The RSVP service could not accept your response. Please try again.')
      const result: unknown = await response.json()
      if (!result || typeof result !== 'object' || !('accepted' in result) || result.accepted !== true) throw new Error('We could not confirm receipt. Please try again or contact the hosts.')
      if (mounted.current) setStatus('success')
    } catch (error) {
      if (mounted.current) {
        setStatus('error')
        setMessage(error instanceof Error && error.name !== 'AbortError' ? error.message : 'The request timed out. Please check your connection and try again.')
      }
    } finally {
      clearTimeout(timeout)
      pending.current = false
      if (mounted.current) setStatus(current => current === 'sending' ? 'idle' : current)
    }
  }

  return <AnimatePresence mode="wait">
    {status === 'success' ? <motion.div key="confirmation" className="sh-rsvp-confirmation" role="status" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }}>
      <CheckCircle2 size={36} strokeWidth={1} /><h3>Your response has been received.</h3><p>{attendance === 'accept' ? 'We look forward to celebrating with you.' : 'Thank you for sending your love and letting us know.'}</p>
    </motion.div> : <motion.form key="form" onSubmit={submit} noValidate className="sh-rsvp-form" initial={false}>
      {!endpoint && <p className="sh-form-note">RSVP preview · Responses are not being collected yet.</p>}
      <fieldset disabled={status === 'sending'}><legend className="sh-small-label">Will you join us?</legend><div className="sh-attendance">
        {(['accept', 'decline'] as const).map(value => <label key={value} className={attendance === value ? 'selected' : ''}><input type="radio" name="attendance" value={value} checked={attendance === value} onChange={() => setAttendance(value)} />{value === 'accept' ? <Check size={16} /> : <X size={16} />}<span>{value === 'accept' ? 'Joyfully accept' : 'Regretfully decline'}</span></label>)}
      </div></fieldset>
      <div className="sh-form-row">
        <div><label htmlFor="guest-name">Guest name <span aria-hidden="true">*</span></label><input id="guest-name" name="guestName" autoComplete="name" required maxLength={100} disabled={status === 'sending'} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <p id="name-error" className="sh-field-error">{errors.name}</p>}</div>
        <div><label htmlFor="attendees">Number of guests <span aria-hidden="true">*</span></label><input id="attendees" name="attendees" type="number" inputMode="numeric" min={1} max={20} step={1} defaultValue={1} required={attendance === 'accept'} disabled={attendance === 'decline' || status === 'sending'} aria-invalid={!!errors.attendees} aria-describedby={errors.attendees ? 'attendees-error' : undefined} />{errors.attendees && <p id="attendees-error" className="sh-field-error">{errors.attendees}</p>}</div>
      </div>
      <label htmlFor="guest-message">A message for the couple <span className="sh-optional">(optional)</span></label><textarea id="guest-message" name="message" rows={3} maxLength={1000} disabled={status === 'sending'} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
      {errors.message && <p id="message-error" className="sh-field-error">{errors.message}</p>}
      <button className="sh-button sh-button-dark" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <LoaderCircle size={16} className="sh-spin" /> : <Send size={16} />} {status === 'sending' ? 'Sending response' : 'Send RSVP'}</button>
      {(status === 'demo' || status === 'error') && <p className="sh-form-feedback" role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
      {Object.keys(errors).length > 0 && <p className="sh-field-error" role="alert">Please check the highlighted fields.</p>}
    </motion.form>}
  </AnimatePresence>
}