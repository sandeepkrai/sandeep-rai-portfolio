const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING?.trim()
const productionHostnames = (import.meta.env.VITE_ANALYTICS_HOSTNAMES ?? '')
  .split(',')
  .map((hostname) => hostname.trim().toLowerCase())
  .filter(Boolean)

const trackedSections = new Set()
const visitId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
let analytics = null
let analyticsLoad = null

function sanitizeUrl(value) {
  if (!value) return value

  try {
    const url = new URL(value, window.location.origin)
    return `${url.origin}${url.pathname}`
  } catch {
    return undefined
  }
}

function isProductionAnalyticsEnabled() {
  return Boolean(
    connectionString
    && productionHostnames.includes(window.location.hostname.toLowerCase()),
  )
}

export async function initializeAnalytics() {
  if (!isProductionAnalyticsEnabled()) return false
  if (analytics) return true

  analyticsLoad ??= import('@microsoft/applicationinsights-web').then(({ ApplicationInsights }) => {
    const client = new ApplicationInsights({
      config: {
        connectionString,
        disableCookiesUsage: true,
        isStorageUseDisabled: true,
        enableAutoRouteTracking: false,
        enableUnhandledPromiseRejectionTracking: true,
        disableAjaxTracking: true,
        disableFetchTracking: true,
      },
    })

    client.addTelemetryInitializer((envelope) => {
      const baseData = envelope.baseData
      if (!baseData) return true

      for (const field of ['uri', 'refUri', 'url']) {
        if (baseData[field]) baseData[field] = sanitizeUrl(baseData[field])
      }

      baseData.properties = {
        ...baseData.properties,
        visitId,
        site: 'portfolio',
      }

      return true
    })

    client.loadAppInsights()
    client.trackPageView({
      name: document.title,
      uri: sanitizeUrl(window.location.href),
    })
    client.trackEvent({ name: 'portfolio_visit' }, { visitId })

    return client
  })

  try {
    analytics = await analyticsLoad
    return true
  } catch {
    analyticsLoad = null
    return false
  }
}

export function trackPortfolioEvent(name, properties = {}) {
  const send = (client) => client.trackEvent({ name }, { ...properties, visitId })

  if (analytics) {
    send(analytics)
    return
  }

  void analyticsLoad?.then(send).catch(() => {})
}

export function trackSectionView(section) {
  if (trackedSections.has(section)) return

  const send = (client) => {
    if (trackedSections.has(section)) return

    trackedSections.add(section)
    client.trackEvent({ name: 'section_viewed' }, { section, visitId })
  }

  if (analytics) {
    send(analytics)
    return
  }

  void analyticsLoad?.then(send).catch(() => {})
}