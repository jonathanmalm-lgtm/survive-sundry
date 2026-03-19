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
  // Uses total score to place player in one of four tiers, then uses
  // relative score strength/weakness (normalized by expected means) to
  // distinguish endings within each middle tier. This produces approximately
  // equal probability (~12.5%) for each ending under random play.
  //
  // Expected score means: ministry ≈ 60, relational ≈ 70, selfAware ≈ 50
  // Normalization subtracts these so each score is compared on equal footing.

  let endingId: number

  const total = ministry + relational + selfAware

  // Normalize each score relative to its expected mean
  const nm = ministry - 60
  const nr = relational - 70
  const ns = selfAware - 50

  if (total < 75) {
    // Very rough Sunday across the board
    endingId = 1
  } else if (total < 175) {
    // Below average — one area kept you afloat (relative strength)
    if (nm >= nr && nm >= ns) {
      endingId = 3  // Ministry was your best relative area → Tanner takes over
    } else if (nr >= nm && nr >= ns) {
      endingId = 7  // Relational was your best relative area → lateral pay raise
    } else {
      endingId = 2  // Self-awareness was your best relative area → reassigned
    }
  } else if (total < 275) {
    // Above average — one area held you back (relative weakness)
    if (nm <= nr && nm <= ns) {
      endingId = 6  // Ministry was your relative weak spot → "we'll do better"
    } else if (nr <= nm && nr <= ns) {
      endingId = 8  // Relational was your relative weak spot → promoted, no raise
    } else {
      endingId = 4  // Self-awareness was your relative weak spot → Redemption City calls
    }
  } else {
    // Excellent Sunday
    endingId = 5
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
