import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'node:crypto'
import { parseDifficulty, parseRegion } from '../../../lib/countries'
import { GAME_TTL, gameKey, rateLimit, redis, type StoredGame } from '../../../lib/server/leaderboard'

/** Starts a leaderboard session so the server knows when a game began. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!redis) return res.status(200).json({ enabled: false, gameId: null })

  const region = parseRegion(req.body?.region)
  if (!region) return res.status(400).json({ error: 'Unknown region' })

  try {
    if (!(await rateLimit(req, 'start', 40))) return res.status(429).json({ error: 'Too many games. Slow down a bit.' })
    const gameId = randomUUID()
    const game: StoredGame = { region, difficulty: parseDifficulty(req.body?.difficulty), startedAt: Date.now() }
    await redis.set(gameKey(gameId), JSON.stringify(game), { ex: GAME_TTL })
    return res.status(200).json({ gameId })
  } catch (e) {
    console.error('game/start failed', e)
    return res.status(500).json({ error: 'Leaderboard unavailable' })
  }
}
