import React from 'react'
import ReactDOM from 'react-dom/client'

const isInvitationPage = /^\/invitation(?:\/|\/index\.html)?$/.test(window.location.pathname)

if (!isInvitationPage) {
  window.location.replace(`/invitation/${window.location.search}`)
} else {
  const Page = React.lazy(() => import('./invitation/Shivoham'))

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <React.Suspense fallback={null}>
        <Page />
      </React.Suspense>
    </React.StrictMode>,
  )
}