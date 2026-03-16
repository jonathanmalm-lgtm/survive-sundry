import { useState, useEffect } from 'react'

export type FontSize = 'small' | 'medium' | 'large'

const SETTINGS_KEY = 'survive-sunday-settings'
const FONT_SIZES: Record<FontSize, number> = {
  small:  16,
  medium: 18,
  large:  21,
}

function loadFontSize(): FontSize {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.fontSize in FONT_SIZES) return parsed.fontSize
    }
  } catch {}
  return 'small'
}

function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = `${FONT_SIZES[size]}px`
}

export function useSettings() {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const size = loadFontSize()
    applyFontSize(size)
    return size
  })

  useEffect(() => {
    applyFontSize(fontSize)
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ fontSize }))
    } catch {}
  }, [fontSize])

  return { fontSize, setFontSize: setFontSizeState }
}
