import { useState } from 'react'
import { useSettings } from '../../engine/settings'
import type { FontSize } from '../../engine/settings'

interface ScreenProps {
  children: React.ReactNode
  centered?: boolean
}

const SIZE_LABELS: { value: FontSize; label: string }[] = [
  { value: 'small',  label: 'A' },
  { value: 'medium', label: 'A' },
  { value: 'large',  label: 'A' },
]

const TEXT_SIZES = {
  small:  'text-[11px]',
  medium: 'text-[13px]',
  large:  'text-[16px]',
}

export default function Screen({ children, centered = false }: ScreenProps) {
  const { fontSize, setFontSize } = useSettings()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-[#1c1c1c] text-white px-4 py-3 flex-shrink-0 relative">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Branding */}
          <div className="text-center flex-1">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 leading-none mb-0.5">
              Survive Sunday
            </p>
            <p className="text-[10px] tracking-widest uppercase text-gray-600 leading-none">
              A choose-your-own ministry adventure game.
            </p>
          </div>

          {/* Font size toggle */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setOpen(v => !v)}
              className="text-gray-400 hover:text-gray-200 transition-colors text-sm font-bold tracking-wide px-1 py-1"
              aria-label="Font size"
            >
              Aa
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg p-2 flex gap-1 z-50">
                {SIZE_LABELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { setFontSize(value); setOpen(false) }}
                    className={[
                      'rounded px-3 py-1.5 transition-colors',
                      TEXT_SIZES[value],
                      fontSize === value
                        ? 'bg-white text-[#1c1c1c] font-bold'
                        : 'text-gray-400 hover:text-gray-200',
                    ].join(' ')}
                    aria-label={`Font size ${value}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        className={[
          'flex flex-col flex-1 w-full max-w-lg mx-auto px-4',
          centered ? 'justify-center items-center text-center' : '',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  )
}
