// Client-side helpers for the global leaderboard. Everything degrades gracefully:
// if the server has no database configured, the leaderboard simply doesn't show.
import type { Difficulty, RegionId } from './countries'

export type Entry = { rank: number; name: string; score: number; at: number }
export type Board = { enabled: boolean; entries: Entry[] }

export const BOARD_SIZE = 20
export const NAME_MAX = 16

export const normalizeName = (s: string) => s.normalize('NFC').replace(/\s+/g, ' ').trim()

export function nameError(name: string): string | null {
  if (name.length < 2) return 'Use at least 2 characters.'
  if (name.length > NAME_MAX) return `Keep it to ${NAME_MAX} characters.`
  if (!/^[\p{L}\p{N} ._'-]+$/u.test(name)) return "Use letters, numbers, spaces and . _ ' - only."
  return null
}

const json = { 'Content-Type': 'application/json' }

export async function startOnlineGame(region: RegionId, difficulty: Difficulty): Promise<string | null> {
  try {
    const res = await fetch('/api/game/start', { method: 'POST', headers: json, body: JSON.stringify({ region, difficulty }) })
    if (!res.ok) return null
    return ((await res.json()).gameId as string) ?? null
  } catch {
    return null
  }
}

export async function fetchBoard(region: RegionId, difficulty: Difficulty): Promise<Board> {
  try {
    const res = await fetch(`/api/leaderboard?region=${region}&mode=${difficulty}`, { cache: 'no-store' })
    if (!res.ok) return { enabled: false, entries: [] }
    return (await res.json()) as Board
  } catch {
    return { enabled: false, entries: [] }
  }
}

export function qualifies(board: Board, score: number) {
  if (!board.enabled || score <= 0) return false
  return board.entries.length < BOARD_SIZE || score > board.entries[BOARD_SIZE - 1].score
}

export async function submitScore(body: {
  gameId: string
  name: string
  score: number
  wrong: number
}): Promise<{ ok: true; rank: number | null; board: Board } | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/leaderboard', { method: 'POST', headers: json, body: JSON.stringify(body) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: data.error ?? 'Something went wrong. Try again.' }
    return { ok: true, rank: data.rank ?? null, board: { enabled: true, entries: data.entries ?? [] } }
  } catch {
    return { ok: false, error: "Couldn't reach the server. Check your connection." }
  }
}
