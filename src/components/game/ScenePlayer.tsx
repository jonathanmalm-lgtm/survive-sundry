import { useState, useMemo, useEffect } from 'react'
import type { Scene, GameState, ChoiceRecord } from '../../types/game'
import { personalize } from '../../content/parser'
import {
  applyScoreDelta,
  addFlag,
  recordChoice,
} from '../../engine/gameState'
import { analytics } from '../../engine/analytics'
import ChoiceButton from './ChoiceButton'
import ImagePlaceholder from './ImagePlaceholder'
import Button from '../ui/Button'

interface ScenePlayerProps {
  scene: Scene
  state: GameState
  onStateChange: (updater: (prev: GameState) => GameState) => void
  onAdvance: (nextScene: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function ScenePlayer({
  scene,
  state,
  onStateChange,
  onAdvance,
}: ScenePlayerProps) {
  const { player } = state

  // Randomize choice order once on scene mount
  const shuffledChoices = useMemo(() => shuffle(scene.choices), [scene.sceneNumber])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [outcomeText, setOutcomeText] = useState<string | null>(null)

  const p = (text: string) => personalize(text, player.name)

  // Track scene view on mount
  useEffect(() => {
    analytics.sceneViewed(scene.sceneNumber, player.role)
  }, [])

  function handleChoice(choiceId: string) {
    if (selectedId) return
    const choice = scene.choices.find(c => c.id === choiceId)!

    let variant: ChoiceRecord['variant'] = 'standard'
    let outcomeKey = choiceId

    if (choice.nuclear) {
      const win = Math.random() * 100 < choice.nuclear.split
      variant = win ? 'win' : 'lose'
      outcomeKey = win ? `${choiceId}:win` : `${choiceId}:lose`
      analytics.nuclearResolved(scene.sceneNumber, state.player.role, variant)
    }

    analytics.sceneCompleted(scene.sceneNumber, state.player.role, choice.type)

    const outcome = p(scene.outcomes[outcomeKey] ?? '')

    const record: ChoiceRecord = {
      sceneNumber: scene.sceneNumber,
      choiceId,
      variant,
      outcomeText: outcome,
    }

    onStateChange(prev => {
      let next = recordChoice(prev, record)

      // Apply score delta
      const scores = choice.nuclear
        ? (variant === 'win' ? choice.nuclear.winScores : choice.nuclear.loseScores)
        : choice.scores ?? { ministry: 0, relational: 0, selfAware: 0 }
      next = { ...next, scores: applyScoreDelta(next.scores, scores) }

      // Set flags
      for (const flag of choice.flags ?? []) {
        next = { ...next, flags: addFlag(next.flags, flag) }
      }

      return next
    })

    setSelectedId(choiceId)
    setOutcomeText(outcome)
  }

  function handleContinue() {
    const choice = scene.choices.find(c => c.id === selectedId)
    const nextScene = choice?.skipToScene ?? scene.sceneNumber + 1
    onAdvance(nextScene)
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Scene header */}
      <div className="flex items-baseline gap-2">
        {scene.time && (
          <span className="text-xs text-gray-500 tabular-nums">{scene.time}</span>
        )}
        {scene.location && (
          <span className="text-xs text-gray-400">· {scene.location}</span>
        )}
      </div>

      {/* Scene image placeholder */}
      {!outcomeText && <ImagePlaceholder imageKey={scene.image} />}

      {/* Narrative */}
      {!outcomeText && (
        <div className="text-sm leading-relaxed text-[#4b4b4b] space-y-3">
          {p(scene.narrative)
            .split('\n\n')
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </div>
      )}

      {/* Outcome (shown after choice) */}
      {outcomeText && (
        <div className="bg-[#f0efed] border border-[#dddbd8] rounded-lg px-4 py-3 text-sm leading-relaxed text-[#1c1c1c] space-y-2">
          {outcomeText.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* Choices */}
      {!outcomeText && (
        <div className="space-y-2 pt-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            {scene.decision}
          </p>
          {shuffledChoices.map(choice => (
            <ChoiceButton
              key={choice.id}
              text={choice.text}
              onClick={() => handleChoice(choice.id)}
              selected={selectedId === choice.id}
              disabled={!!selectedId}
            />
          ))}
        </div>
      )}

      {/* Continue button (shown after choice) */}
      {outcomeText && (
        <Button onClick={handleContinue} fullWidth className="mt-2">
          Continue →
        </Button>
      )}
    </div>
  )
}
