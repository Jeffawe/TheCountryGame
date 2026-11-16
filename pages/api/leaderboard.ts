import type { NextApiRequest, NextApiResponse } from 'next'
import { MAX_LIVES, countriesIn, parseDifficulty, parseRegion } from '../../lib/countries'
import { nameError, normalizeName } from '../../lib/leaderboard'
import {
  KEEP,
  MIN_MS_PER_ANSWER,
  boardKey,
  gameKey,
  isOffensive,
  rateLimit,
  readBoard,
  redis,
  toZ,
  type StoredGame,
} from '../../lib/server/leaderboard'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!redis) return res.status(200).json({ enabled: false, entries: [] })
  try {
    if (req.method === 'GET') return await getBoard(req, res)
    if (req.method === 'POST') return await submit(req, res)
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('leaderboard failed', e)
    return res.status(500).json({ error: 'Leaderboard unavailable right now.' })
  }
}

async function getBoard(req: NextApiRequest, res: NextApiResponse) {
  const region = parseRegion(req.query.region)
  if (!region) return res.status(400).json({ error: 'Unknown region' })
  const entries = await readBoard(region, parseDifficulty(req.query.mode))
  // Browsers must never show a stale board (e.g. right after you submit); Vercel's CDN may briefly cache it
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Vercel-CDN-Cache-Control', 'max-age=5, stale-while-revalidate=30')
  return res.status(200).json({ enabled: true, entries })
}

async function submit(req: NextApiRequest, res: NextApiResponse) {
  if (!(await rateLimit(req, 'submit', 10))) return res.status(429).json({ error: 'Too many tries. Wait a minute.' })

  const { gameId, score, wrong } = req.body ?? {}
  if (typeof gameId !== 'string' || !/^[0-9a-f-]{36}$/.test(gameId)) return res.status(400).json({ error: 'Invalid game.' })
  if (!Number.isInteger(score) || !Number.isInteger(wrong)) return res.status(400).json({ error: 'Invalid score.' })

  const name = normalizeName(String(req.body?.name ?? ''))
  const bad = nameError(name)
  if (bad) return res.status(400).json({ error: bad })
  if (isOffensive(name)) return res.status(400).json({ error: 'Please pick a different name.' })

  // Each game can be submitted once
  const raw = await redis!.getdel<string>(gameKey(gameId))
  if (!raw) return res.status(400).json({ error: 'This game has expired or was already submitted.' })
  const game = JSON.parse(raw) as StoredGame

  // Plausibility checks: the game must have ended legitimately and taken a human amount of time
  const total = countriesIn(game.region).length
  const answered = score + wrong
  const elapsed = Date.now() - game.startedAt
  const legit =
    score > 0 &&
    score <= total &&
    wrong >= 0 &&
    wrong <= MAX_LIVES &&
    (wrong === MAX_LIVES || answered === total) && // game ends only on losing all lives or finishing the region
    elapsed >= answered * MIN_MS_PER_ANSWER
  if (!legit) return res.status(400).json({ error: "That score couldn't be verified." })

  const key = boardKey(game.region, game.difficulty)
  const at = Date.now()
  const member = JSON.stringify({ id: gameId, name, at })
  await redis!.zadd(key, { score: toZ(score, at), member })
  await redis!.zremrangebyrank(key, 0, -(KEEP + 1))
  const rank = await redis!.zrevrank(key, member)

  return res.status(200).json({ rank: rank === null ? null : rank + 1, entries: await readBoard(game.region, game.difficulty) })
}
