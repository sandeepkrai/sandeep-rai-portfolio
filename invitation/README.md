# SHIVOHAM

A cinematic, configurable wedding invitation at `/invitation/`. The portfolio at `/` and the existing `/wifey/` page remain separate lazy-loaded entries. This redesign is not automatically published by local development.

## Setup

Use Node.js 22 LTS (22.13 or newer) and npm. Node 21 is end-of-life and is outside the supported ranges of some development tools.

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run typecheck
npm run test:invitation
npm run lint
npm run build
npm run preview
```

Open the Vite URL followed by `/invitation/`. Production output is `dist/`.

Dependencies: React 18, TypeScript 5, Vite 5, Three.js, React Three Fiber 8, Drei 9, GSAP 3/ScrollTrigger, Framer Motion 12, Tailwind 3, Lucide React, and Luxon 3. The lockfile pins resolved versions. The `three-mesh-bvh` override replaces Drei's deprecated transitive 0.7 utility with compatible 0.8. Tailwind preflight is disabled to avoid changing the existing pages.

## Configure Content

Edit `src/config/wedding.ts`. The confirmed names, date, and venue are configured there. Unconfirmed details remain empty and render readable placeholders instead of fabricated information.

- `partners`: both names; keep names reasonably short for the printed invitation.
- `date`: ISO calendar date, `YYYY-MM-DD`.
- `time`: local 24-hour ceremony time, `HH:mm`.
- `timezone`: IANA timezone, default `Asia/Kolkata`. Both a valid date and time are required for the countdown. Nonexistent local times are rejected. For locations with a daylight-saving overlap, choose an unambiguous ceremony time.
- `venue.name`, `venue.address`: actual venue and complete address. Directions and copy stay disabled until an address exists. No coordinates are invented.
- `venue.mapUrl`: optional HTTPS URL; otherwise Google Maps search is generated from the address.
- `venue.travel`, `dressCode`, `messages.family`, `families`, `contacts`, `rsvpDeadline`: optional; empty items do not create filler sections.
- `schedule`: optional named events with local ISO dates, times, and venues. Uses the same timezone as the main ceremony.
- `messages`: invitation text in English and Hindi.
- `audio.src`: root-relative path to a recording you have permission to use. The supplied recording is converted to MP3 for browser compatibility and bundled at `/audio/wedding-background.mp3`; `audio.title` names it. Playback is attempted on page load at 15% volume and loops. Browsers may block audible autoplay; the sound button starts playback in that case and can pause it at any time. Without a path, no audio control is shown. Missing recordings are handled gracefully. Some mobile browsers control volume through the device rather than JavaScript.

If autoplay is blocked, clicking **Enter Kashi** also starts the music at 15% volume. Entering does not restart playing music or override an explicit mute choice.

Update the generic title/description in `invitation/index.html` if you want personalized link previews. `noindex, nofollow` is intentional; it is not access control.

## RSVP Backend Contract

By default RSVP is **preview-only**. It validates fields but never stores them or claims they were saved. To connect a real service, set `VITE_RSVP_ENDPOINT` in `.env.local` (or hosting environment) to a same-origin path such as `/api/rsvp` or an HTTPS endpoint. Restart Vite/rebuild after changing it. This value is public; never put a service-role key, database password, or private token in a `VITE_` variable.

The form sends:

```http
POST /api/rsvp
Content-Type: application/json
Idempotency-Key: <random UUID, reused for retries of the same payload>
```

```json
{
  "name": "Guest Name",
  "attendees": 2,
  "attendance": "accept",
  "message": "An optional message"
}
```

Declines send `attendance: "decline"` and `attendees: 0`. An accepted request must return a 2xx response with JSON `{ "accepted": true }` **only after durable storage succeeds**. Other responses, network failures, and 15-second timeouts display errors. Pending submissions are locked; repeated successes cannot be submitted again from the same mounted form. Server-side idempotency is still required across reloads/devices.

Implement this endpoint in your chosen server/API or a Supabase Edge Function. Validate all fields again on the server, restrict CORS to your actual origin, support the `Idempotency-Key` header, enforce rate limits and a guest limit, and store the idempotency key with a unique constraint. Store credentials only server-side. Add abuse protection appropriate to a public invitation. Do not allow unrestricted anonymous reads of guest data. Establish retention and deletion rules for RSVP personal information. No backend or database is provisioned by this frontend project.

## Scenes and Accessibility

- `src/invitation/scenes/SacredWorld.tsx`: original procedural trishul, ghats, temples, mandap, water, diyas, and instanced particles. No missing model/texture paths or copyrighted recordings are referenced. The riverfront and mandap are artistic interpretations, not historical reconstructions or depictions of an actual ceremony.
- `Scene.tsx`: deferred scene loading, viewport/document visibility gating, capped pixel ratios, mobile reductions, context-loss handling, and non-WebGL fallback compositions.
- `components/InvitationReveal.tsx`: layered CSS-3D paper doors with Framer Motion; the invitation text remains available to assistive technology.
- GSAP reveals and camera movement are skipped with reduced motion; pause stops continuous WebGL/CSS movement. Text and navigation never depend on completing the cinematic entry.
- Google Fonts supplies Cormorant Garamond, Inter, and Noto Serif Devanagari. System serif/sans fallbacks preserve content if fonts are blocked. Self-host licensed WOFF2 files and adjust the CSS imports for an offline/private-font deployment.

## Static Deployment

Existing production hosting remains unchanged. Do not publish placeholder content until the hosts approve it.

For a Vercel deployment:

1. Import this repository; use the Vite framework preset and Node 22.
2. Install with `npm ci`, build with `npm run build`, and serve `dist`.
3. Set `VITE_RSVP_ENDPOINT` only when a backend exists, then rebuild.
4. Open `/invitation/` directly. The site is a multi-page build; keep `dist/invitation/index.html` and `dist/wifey/index.html`. Do not rewrite all paths to the root portfolio HTML.
5. If deploying only the invitation to a standalone domain root, deliberately change the Vite entry/router base and verify asset paths first; the current configuration intentionally preserves the portfolio at `/`.

For any static host, enable HTTPS, serve the generated assets with their content hashes, avoid long-lived caching on HTML, and check the invitation's direct route after deployment. An RSVP endpoint requires a separately configured backend or serverless function.

## Verification

`npm run test:invitation` covers missing/invalid dates, explicit timezone conversion, future/completed countdowns, safe/disabled map links, and RSVP validation. Browser checks should include the entry transition, paper doors, navigation, mobile overflow, pause/reduced motion, WebGL fallback, audio-off behavior, form errors, preview-only submission, and a configured backend's success/error contract. The latter can be checked with intercepted responses in development; that is not proof of a real backend deployment.

The Three.js chunk is deliberately deferred. Do not add postprocessing or load every scene's detailed assets in the opening bundle. Check ordinary mobile devices as well as desktop screenshots before publication.