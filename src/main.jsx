import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n'
import './styles/shared-loading.css'
import { HelmetProvider } from 'react-helmet-async'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
)

if (typeof document !== 'undefined') {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.dispatchEvent(new Event('app-rendered'))
    })
  })
}
