import { DateTime } from 'luxon'
import type { WeddingConfig } from '../config/wedding'

export function eventDate(config: Pick<WeddingConfig, 'date' | 'time' | 'timezone'>): DateTime | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.date) || !/^\d{2}:\d{2}$/.test(config.time)) return null
  const date = DateTime.fromISO(`${config.date}T${config.time}`, { zone: config.timezone || 'Asia/Kolkata' })
  return date.isValid && date.toFormat('yyyy-MM-dd HH:mm') === `${config.date} ${config.time}` ? date : null
}

export function countdown(target: number | null, now: number) {
  if (target === null) return { state: 'unconfigured' as const, values: [0, 0, 0, 0] }
  const seconds = Math.max(0, Math.floor((target - now) / 1000))
  return {
    state: target <= now ? 'complete' as const : 'counting' as const,
    values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
  }
}

export function safeLink(value: string): string | null {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch { return null }
}

export function directions(venue: WeddingConfig['venue']): string | null {
  if (!venue.address.trim()) return null
  return safeLink(venue.mapUrl) || `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: venue.address })}`
}

export interface RsvpPayload { name: string; attendees: number; attendance: 'accept' | 'decline'; message: string }

export function validateRsvp(payload: RsvpPayload): Record<string, string> {
  const errors: Record<string, string> = {}
  if (payload.name.trim().length < 2 || payload.name.trim().length > 100) errors.name = 'Please enter your name (2-100 characters).'
  if (!['accept', 'decline'].includes(payload.attendance)) errors.attendance = 'Please choose whether you will attend.'
  if (payload.attendance === 'accept' && (!Number.isInteger(payload.attendees) || payload.attendees < 1 || payload.attendees > 20)) errors.attendees = 'Please enter between 1 and 20 guests.'
  if (payload.message.length > 1000) errors.message = 'Please keep your message under 1,000 characters.'
  return errors
}