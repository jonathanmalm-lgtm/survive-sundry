// ─── Player ───────────────────────────────────────────────────────────────────

export type RoleCode = 'WL' | 'TL' | 'KM' | 'FI' | 'AD' | 'CP' | 'SM'
export type Gender = 'male' | 'female' | 'neutral'
export type MaritalStatus = 'married' | 'single' | 'complicated'

export interface PlayerProfile {
  name: string
  role: RoleCode
  gender: Gender
  maritalStatus: MaritalStatus
}

// ─── Scores ───────────────────────────────────────────────────────────────────

export interface Scores {
  ministry: number    // Ministry Health 🔥
  relational: number  // Relational Capital 🤝
  selfAware: number   // Self-Awareness 🫞
}

export interface ScoreDelta {
  ministry: number
  relational: number
  selfAware: number
}

// ─── Choices ──────────────────────────────────────────────────────────────────

export type ChoiceType = 'compassionate' | 'cowardly' | 'bold' | 'nuclear'

export interface NuclearOutcome {
  split: number       // win percentage (e.g. 60 = 60% chance of win)
  winScores: ScoreDelta
  loseScores: ScoreDelta
}

export interface Choice {
  id: string          // 'A' | 'B' | 'C' | 'D'
  type: ChoiceType
  text: string        // player-facing button text (never labeled as Nuclear)
  scores?: ScoreDelta // for non-nuclear choices
  nuclear?: NuclearOutcome
  flags?: string[]    // flags to set when this choice is made
  skipToScene?: number // hard skip to this scene on catastrophic choice
}

// ─── Scene ────────────────────────────────────────────────────────────────────

export interface Scene {
  sceneNumber: number  // 1–12
  title: string
  time?: string
  location?: string
  image?: string       // image placeholder key, e.g. 'parking-lot'
  narrative: string    // setup text shown before the decision
  decision: string     // prompt shown above choices, e.g. "What do you do?"
  choices: Choice[]
  // outcome text keyed by choice id
  // non-nuclear: 'A', 'B', 'C', 'D'
  // nuclear:     'D:win', 'D:lose'
  outcomes: Record<string, string>
}

export interface IntroContent {
  narrative: string  // role-specific flavor text shown before name input
}

// ─── Endings ──────────────────────────────────────────────────────────────────

export interface Ending {
  id: number
  title: string
  condition: string    // human-readable, for developer reference only
  narrative: string    // month-later meeting narrative text
  shareText: string    // primary text for shareable image
  shareVariants: string[] // 2–3 variants so social feeds aren't identical
}

// ─── Game state ───────────────────────────────────────────────────────────────

export type GamePhase = 'onboarding' | 'playing' | 'meeting' | 'result'

export interface ChoiceRecord {
  sceneNumber: number
  choiceId: string
  variant: 'standard' | 'win' | 'lose'  // only relevant for nuclear choices
  outcomeText: string
}

export interface GameState {
  version: number
  phase: GamePhase
  player: PlayerProfile
  currentScene: number       // 0 = intro, 1–12 = scenes, 13 = month-later meeting
  visitedScenes: number[]    // scenes actually reached (gaps reveal skips in progress bar)
  choices: ChoiceRecord[]
  flags: string[]
  scores: Scores
  endingId?: number          // 1–8 once resolved
  specialVariants?: string[] // e.g. ['blippicoin_win', 'meme_account']
  startedAt: string          // ISO date string
  completedAt?: string
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

export type SegmentStatus = 'completed' | 'active' | 'skipped' | 'future'

export interface ProgressSegment {
  index: number   // 0–13
  label: string   // 'Intro', 'Scene 1' … 'Scene 12', 'Final'
  status: SegmentStatus
}
