import './App.css'
import { useGameState, advanceScene, getProgressSegments } from './engine/gameState'
import type { PlayerProfile } from './types/game'
import { getScene } from './content/parser'
import Screen from './components/ui/Screen'
import ProgressBar from './components/ui/ProgressBar'
import Onboarding from './components/onboarding/Onboarding'
import ScenePlayer from './components/game/ScenePlayer'
import MeetingScreen from './components/game/MeetingScreen'
import ResultScreen from './components/game/ResultScreen'

export default function App() {
  const { state, startGame, updateState, resetGame } = useGameState()

  // ── No active game → onboarding ──────────────────────────────────────────

  if (!state) {
    return (
      <Screen>
        <Onboarding onComplete={(player: PlayerProfile) => startGame(player)} />
      </Screen>
    )
  }

  const segments = getProgressSegments(state)

  // ── Playing ───────────────────────────────────────────────────────────────

  if (state.phase === 'playing') {
    const sceneNum = state.currentScene
    const scene = getScene(state.player.role, sceneNum)

    if (!scene) {
      updateState(prev => ({ ...prev, phase: 'meeting', currentScene: 13 }))
      return null
    }

    return (
      <Screen>
        <ProgressBar segments={segments} />
        <ScenePlayer
          key={scene.sceneNumber}
          scene={scene}
          state={state}
          onStateChange={updateState}
          onAdvance={nextScene => {
            if (nextScene > 12) {
              updateState(prev => ({ ...advanceScene(prev, 13), phase: 'meeting' }))
            } else {
              updateState(prev => advanceScene(prev, nextScene))
            }
          }}
        />
      </Screen>
    )
  }

  // ── Month-Later Meeting ───────────────────────────────────────────────────

  if (state.phase === 'meeting') {
    return (
      <Screen>
        <ProgressBar segments={segments} />
        <MeetingScreen
          state={state}
          onStateChange={updateState}
          onComplete={() => updateState(prev => ({ ...prev, phase: 'result' }))}
        />
      </Screen>
    )
  }

  // ── Result ────────────────────────────────────────────────────────────────

  if (state.phase === 'result') {
    return (
      <Screen>
        <ResultScreen state={state} onRestart={resetGame} />
      </Screen>
    )
  }

  return null
}
