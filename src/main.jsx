import React from 'react'
import ReactDOM from 'react-dom/client'

const isWifeyPage = /^\/wifey(?:\/|\/index\.html)?$/.test(window.location.pathname)
const isInvitationPage = /^\/invitation(?:\/|\/index\.html)?$/.test(window.location.pathname)
const loadPage = isInvitationPage
  ? () => import('./InvitationPage')
  : isWifeyPage ? () => import('./WifeyPage') : () => import('./ImmersiveApp')
const Page = React.lazy(loadPage)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <Page />
    </React.Suspense>
  </React.StrictMode>,
)