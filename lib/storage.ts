import type { Difficulty, RegionId } from './countries'

export type GameResult = {
  gameId: string | null // leaderboard session, null if the leaderboard is off
  submittedRank?: number // set once the player has put their name on the leaderboard
  region: RegionId
  difficulty: Difficulty
  score: number
  wrong: number
  bestStreak: number
  total: number // number of flags in the region
  cleared: boolean // answered every flag in the region
  isNewBest: boolean
}

const RESULT_KEY = 'tcg:last-result'
const BEST_KEY = 'tcg:best'

// Storage can be missing or throw (private mode, blocked cookies), so the game must work without it.
function read<T>(store: 'localStorage' | 'sessionStorage', key: string, fallback: T): T {
  try {
    const v = window[store].getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
function write(store: 'localStorage' | 'sessionStorage', key: string, value: unknown) {
  try {
    window[store].setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export const bestKey = (region: RegionId, difficulty: Difficulty) => `${region}:${difficulty}`

export function getBestScores(): Record<string, number> {
  return read<Record<string, number>>('localStorage', BEST_KEY, {})
}

/** Saves the result and the high score. Returns the stored result. */
export function saveResult(r: Omit<GameResult, 'isNewBest'>): GameResult {
  const best = getBestScores()
  const key = bestKey(r.region, r.difficulty)
  const isNewBest = r.score > 0 && r.score > (best[key] ?? 0)
  if (isNewBest) write('localStorage', BEST_KEY, { ...best, [key]: r.score })
  const result = { ...r, isNewBest }
  write('sessionStorage', RESULT_KEY, result)
  return result
}

export function updateLastResult(patch: Partial<GameResult>) {
  const r = getLastResult()
  if (r) write('sessionStorage', RESULT_KEY, { ...r, ...patch })
}

const NAME_KEY = 'tcg:name'
export const getSavedName = () => read<string>('localStorage', NAME_KEY, '')
export const saveName = (name: string) => write('localStorage', NAME_KEY, name)

export function getLastResult(): GameResult | null {
  return read<GameResult | null>('sessionStorage', RESULT_KEY, null)
}

const SEEN_KEY = 'tcg:seen-facts'

/** Picks a fact for a country the player hasn't seen yet, cycling once all have been shown. */
export function pickFact(code: string, count: number, seed: number): number {
  const seen = read<Record<string, number[]>>('localStorage', SEEN_KEY, {})
  let used = (seen[code] ?? []).filter((i) => i < count)
  if (used.length >= count) used = []
  const fresh = Array.from({ length: count }, (_, i) => i).filter((i) => !used.includes(i))
  const pick = fresh[Math.floor(seed * fresh.length)]
  write('localStorage', SEEN_KEY, { ...seen, [code]: [...used, pick] })
  return pick
}
