import type { Scores } from '../types/game'

// ─── Ending Resolver ──────────────────────────────────────────────────────────
// Pure function — no side effects, no randomness except the BlippiCoin coin flip.
// The coin flip for BlippiCoin is deferred to this moment (not at Scene 10).

export interface EndingResult {
  endingId: number
  specialVariants: string[]
}

export function resolveEnding(scores: Scores, flags: string[]): EndingResult {
  const { ministry, relational, selfAware } = scores
  const specialVariants: string[] = []

  // ── Determine base ending ─────────────────────────────────────────────────

  let endingId: number

  if (ministry < 40 && relational < 40 && selfAware < 40) {
    endingId = 1
  } else if (ministry < 40 && relational < 40 && selfAware > 60) {
    endingId = 2
  } else if (ministry > 60 && relational < 40 && selfAware < 40) {
    endingId = 3
  } else if (ministry > 60 && relational < 40 && selfAware > 60) {
    endingId = 4
  } else if (ministry > 70 && relational > 70 && selfAware > 70) {
    endingId = 5
  } else if (ministry < 60 && relational > 60 && selfAware > 60) {
    endingId = 6
  } else if (ministry < 40 && relational > 60 && selfAware < 40) {
    endingId = 7
  } else if (ministry > 70 && relational > 70 && selfAware < 40) {
    endingId = 8
  } else {
    // Fallback
    endingId = 6
  }

  // ── BlippiCoin special variant ────────────────────────────────────────────
  // Coin flip happens HERE — not at time of investment.

  if (flags.includes('BLIPPICOIN_INVESTED')) {
    const win = Math.random() < 0.5
    if (win) {
      specialVariants.push('blippicoin_win')
      endingId = 4 // Override ending to 4 on win
    } else {
      specialVariants.push('blippicoin_lose')
    }
  }

  // ── Meme account special variant ─────────────────────────────────────────

  if (flags.includes('MEME_ACCOUNT_POSTED')) {
    specialVariants.push('meme_account')
  }

  return { endingId, specialVariants }
}
