import { useState, useCallback } from 'react'
import type {
  GameState,
  PlayerProfile,
  Scores,
  ScoreDelta,
  ChoiceRecord,
  ProgressSegment,
} from '../types/game'

// ─── Constants ────────────────────────────────────────────────────────────────

const SAVE_KEY = 'survive-sunday-v1'
const CURRENT_VERSION = 1
const STARTING_SCORE = 50  // meters start neutral; thresholds are 40/60/70

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createInitialState(player: PlayerProfile): GameState {
  return {
    version: CURRENT_VERSION,
    phase: 'playing',
    player,
    currentScene: 0,
    visitedScenes: [0],
    choices: [],
    flags: [],
    scores: {
      ministry: STARTING_SCORE,
      relational: STARTING_SCORE,
      selfAware: STARTING_SCORE,
    },
    startedAt: new Date().toISOString(),
  }
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // Silently fail: private browsing, storage quota, etc.
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw) as GameState
    if (state.version !== CURRENT_VERSION) return null
    return state
  } catch {
    return null
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {}
}

// ─── State mutations (pure — return new state, do not mutate) ─────────────────

export function applyScoreDelta(scores: Scores, delta: ScoreDelta): Scores {
  return {
    ministry: scores.ministry + delta.ministry,
    relational: scores.relational + delta.relational,
    selfAware: scores.selfAware + delta.selfAware,
  }
}

export function addFlag(flags: string[], flag: string): string[] {
  return flags.includes(flag) ? flags : [...flags, flag]
}

export function hasFlag(flags: string[], flag: string): boolean {
  return flags.includes(flag)
}

export function recordChoice(state: GameState, record: ChoiceRecord): GameState {
  return { ...state, choices: [...state.choices, record] }
}

export function advanceScene(state: GameState, nextScene: number): GameState {
  return {
    ...state,
    currentScene: nextScene,
    visitedScenes: state.visitedScenes.includes(nextScene)
      ? state.visitedScenes
      : [...state.visitedScenes, nextScene],
  }
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

// 14 segments: 0 = Intro, 1–12 = Scene 1–12, 13 = Final
export function getProgressSegments(state: GameState): ProgressSegment[] {
  return Array.from({ length: 14 }, (_, i) => {
    const label = i === 0 ? 'Intro' : i === 13 ? 'Final' : `Scene ${i}`

    let status: ProgressSegment['status']
    if (i === state.currentScene) {
      status = 'active'
    } else if (i < state.currentScene) {
      status = state.visitedScenes.includes(i) ? 'completed' : 'skipped'
    } else {
      status = 'future'
    }

    return { index: i, label, status }
  })
}

// ─── React hook ───────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, setState] = useState<GameState | null>(() => loadGame())

  const startGame = useCallback((player: PlayerProfile) => {
    const initial = createInitialState(player)
    saveGame(initial)
    setState(initial)
  }, [])

  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setState(prev => {
      if (!prev) return prev
      const next = updater(prev)
      saveGame(next)
      return next
    })
  }, [])

  const resetGame = useCallback(() => {
    clearGame()
    setState(null)
  }, [])

  return { state, startGame, updateState, resetGame }
}
