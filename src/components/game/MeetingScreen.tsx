import { useState, useEffect } from 'react'
import type { GameState } from '../../types/game'
import { resolveEnding } from '../../engine/endingResolver'
import { getEndings, getEndingVariants, getMeetingSetup, personalize } from '../../content/parser'
import Button from '../ui/Button'

interface MeetingScreenProps {
  state: GameState
  onStateChange: (updater: (prev: GameState) => GameState) => void
  onComplete: () => void
}

export default function MeetingScreen({ state, onStateChange, onComplete }: MeetingScreenProps) {
  const { player, scores, flags } = state

  // Resolve ending on mount if not already resolved
  const [resolved] = useState(() => {
    if (state.endingId != null) {
      return {
        endingId: state.endingId,
        specialVariants: state.specialVariants ?? [],
      }
    }
    return resolveEnding(scores, flags)
  })

  // Persist the resolved ending into state (once, on mount)
  useEffect(() => {
    if (state.endingId == null) {
      onStateChange(prev => ({
        ...prev,
        endingId: resolved.endingId,
        specialVariants: resolved.specialVariants,
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const endings = getEndings(player.role)
  const ending = endings.find(e => e.id === resolved.endingId)
  const variants = getEndingVariants(player.role)

  const setup = getMeetingSetup()

  // Determine which narrative to show
  const isBlippiWin = resolved.specialVariants.includes('blippicoin_win')
  const isBlippiLose = resolved.specialVariants.includes('blippicoin_lose')
  const isMemeAccount = resolved.specialVariants.includes('meme_account')

  function p(text: string): string {
    return personalize(text, player.name)
  }

  const mainNarrative = ending?.narrative ?? ''
  const blippiVariant = isBlippiWin
    ? (variants['blippicoin win'] ?? '')
    : isBlippiLose
      ? (variants['blippicoin lose'] ?? '')
      : ''

  return (
    <div className="py-8 px-4 space-y-6 text-sm leading-relaxed max-w-lg mx-auto w-full">
      {/* Setup — dark/moody */}
      <div
        className="rounded-lg px-5 py-5 space-y-1"
        style={{ background: '#1c1c1c' }}
      >
        <p
          className="text-xs uppercase tracking-[0.18em] mb-3"
          style={{ color: '#9ca3af' }}
        >
          One month later
        </p>
        <p style={{ color: '#e5e7eb', lineHeight: '1.7' }}>
          {p(setup)}
        </p>
      </div>

      {/* BlippiCoin variant — shown before the ending */}
      {blippiVariant && (
        <div
          className="border-l-2 pl-4 space-y-2"
          style={{ borderColor: '#dddbd8', color: '#4b4b4b' }}
        >
          {blippiVariant.split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: '1.75' }}>
              {p(para)}
            </p>
          ))}
        </div>
      )}

      {/* Ending title */}
      {ending && (
        <div className="pt-2">
          <p
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: '#9ca3af' }}
          >
            Your ending
          </p>
          <h2
            className="text-lg font-semibold leading-snug"
            style={{ color: '#1c1c1c' }}
          >
            {ending.title}
          </h2>
        </div>
      )}

      {/* Main ending narrative */}
      {mainNarrative && (
        <div className="space-y-3" style={{ color: '#1c1c1c' }}>
          {mainNarrative.split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: '1.75' }}>
              {p(para)}
            </p>
          ))}
        </div>
      )}

      {/* Meme account variant — shown after main narrative */}
      {isMemeAccount && variants['meme account'] && (
        <div
          className="border-l-2 pl-4 space-y-2"
          style={{ borderColor: '#dddbd8', color: '#4b4b4b' }}
        >
          {variants['meme account'].split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: '1.75' }}>
              {p(para)}
            </p>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="pt-4 pb-8">
        <Button variant="primary" fullWidth onClick={onComplete}>
          See your result →
        </Button>
      </div>
    </div>
  )
}
