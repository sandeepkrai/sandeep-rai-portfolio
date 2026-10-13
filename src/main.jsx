import React from 'react'
import ReactDOM from 'react-dom/client'

const isWifeyPage = /^\/wifey(?:\/|\/index\.html)?$/.test(window.location.pathname)
const Page = React.lazy(isWifeyPage ? () => import('./WifeyPage') : () => import('./ImmersiveApp'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <Page />
    </React.Suspense>
  </React.StrictMode>,
)