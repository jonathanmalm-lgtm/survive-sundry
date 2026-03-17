import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface TTSContextValue {
  enabled: boolean
  toggle: () => void
  speak: (text: string) => void
  stop: () => void
}

const TTSContext = createContext<TTSContextValue>({
  enabled: false,
  toggle: () => {},
  speak: () => {},
  stop: () => {},
})

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem('tts-enabled') === 'true'
  })

  // Keep a ref so speak() always sees the latest value without needing re-registration
  const enabledRef = useRef(enabled)
  useEffect(() => { enabledRef.current = enabled }, [enabled])

  function speak(text: string) {
    if (!enabledRef.current) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    window.speechSynthesis.cancel()
  }

  function toggle() {
    setEnabled(prev => {
      const next = !prev
      localStorage.setItem('tts-enabled', String(next))
      if (!next) window.speechSynthesis.cancel()
      return next
    })
  }

  return (
    <TTSContext.Provider value={{ enabled, toggle, speak, stop }}>
      {children}
    </TTSContext.Provider>
  )
}

export function useTTS() {
  return useContext(TTSContext)
}
