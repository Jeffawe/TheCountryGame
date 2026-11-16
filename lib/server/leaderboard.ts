import type { NextApiRequest } from 'next'
import { Redis } from '@upstash/redis'
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity'
import { BOARD_SIZE, type Entry } from '../leaderboard'
import type { Difficulty, RegionId } from '../countries'

// Works with both the Upstash integration's variable names and the older Vercel KV names
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

export const redis = url && token ? new Redis({ url, token, automaticDeserialization: false }) : null

export const KEEP = 100 // entries stored per board
export const GAME_TTL = 60 * 60 * 3 // a game must be submitted within 3 hours
export const MIN_MS_PER_ANSWER = 600 // nobody reads a flag and taps an answer faster than this

export const boardKey = (r: RegionId, d: Difficulty) => `lb:v1:${r}:${d}`
export const gameKey = (id: string) => `game:${id}`

// Higher score first; for equal scores the earlier entry ranks higher
const SCALE = 1e13
export const toZ = (score: number, at: number) => score * SCALE + (SCALE - at)
const fromZ = (z: number) => Math.floor(z / SCALE)

export type StoredGame = { region: RegionId; difficulty: Difficulty; startedAt: number }

export async function readBoard(r: RegionId, d: Difficulty, n = BOARD_SIZE): Promise<Entry[]> {
  if (!redis) return []
  const raw = (await redis.zrange(boardKey(r, d), 0, n - 1, { rev: true, withScores: true })) as (string | number)[]
  const entries: Entry[] = []
  for (let i = 0; i < raw.length; i += 2) {
    try {
      const m = JSON.parse(String(raw[i])) as { name: string; at: number }
      entries.push({ rank: entries.length + 1, name: m.name, at: m.at, score: fromZ(Number(raw[i + 1])) })
    } catch {
      /* skip malformed rows */
    }
  }
  return entries
}

export function clientIp(req: NextApiRequest) {
  const fwd = req.headers['x-forwarded-for']
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim()
  return first || (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || 'unknown'
}

/** Fixed-window rate limit. Returns true if the request is allowed. */
export async function rateLimit(req: NextApiRequest, bucket: string, limit: number, windowSec = 60) {
  if (!redis) return true
  const key = `rl:${bucket}:${clientIp(req)}:${Math.floor(Date.now() / 1000 / windowSec)}`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, windowSec)
  return count <= limit
}

const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers })
export const isOffensive = (name: string) => matcher.hasMatch(name)
