import { test } from 'node:test'
import assert from 'node:assert/strict'
import { countdown, directions, eventDate, safeLink, validateRsvp } from './event'

test('unknown date and time never become a fabricated countdown', () => {
  assert.equal(eventDate({ date: '', time: '', timezone: 'Asia/Kolkata' }), null)
  assert.equal(countdown(null, Date.now()).state, 'unconfigured')
  assert.equal(eventDate({ date: '2027-02-30', time: '18:00', timezone: 'Asia/Kolkata' }), null)
  assert.equal(eventDate({ date: '2027-11-25', time: '25:00', timezone: 'Asia/Kolkata' }), null)
  assert.equal(eventDate({ date: '2027-11-25', time: '18:00', timezone: 'invalid' }), null)
})

test('event time uses the configured timezone and completed dates stay at zero', () => {
  const date = eventDate({ date: '2027-11-25', time: '18:30', timezone: 'Asia/Kolkata' })
  assert.equal(date?.toUTC().toISO(), '2027-11-25T13:00:00.000Z')
  assert.deepEqual(countdown(90061000, 0).values, [1, 1, 1, 1])
  assert.equal(countdown(1000, 1000).state, 'complete')
  assert.deepEqual(countdown(1000, 2000).values, [0, 0, 0, 0])
})

test('directions require an address and reject unsafe custom links', () => {
  assert.equal(directions({ name: '', address: '', mapUrl: 'https://maps.google.com', travel: '' }), null)
  const link = directions({ name: 'Venue', address: 'Example address, Varanasi', mapUrl: 'javascript:alert(1)', travel: '' })
  assert.equal(new URL(link!).searchParams.get('query'), 'Example address, Varanasi')
  assert.equal(safeLink('javascript:alert(1)'), null)
})

test('RSVP validates names, guest counts, and message limits', () => {
  assert.deepEqual(validateRsvp({ name: 'Guest Name', attendees: 2, attendance: 'accept', message: '' }), {})
  assert.ok(validateRsvp({ name: '', attendees: 0, attendance: 'accept', message: '' }).name)
  assert.ok(validateRsvp({ name: 'Guest Name', attendees: 1.5, attendance: 'accept', message: '' }).attendees)
  assert.deepEqual(validateRsvp({ name: 'Guest Name', attendees: 0, attendance: 'decline', message: '' }), {})
})