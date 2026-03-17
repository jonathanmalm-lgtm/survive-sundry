import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'
import { TTSProvider } from './engine/tts'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: 'https://us.i.posthog.com',
    capture_pageview: false,
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TTSProvider>
      <App />
    </TTSProvider>
  </StrictMode>,
)
