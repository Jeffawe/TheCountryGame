import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BoardTable from '../components/BoardTable'
import { DIFFICULTIES, REGIONS, parseDifficulty, parseRegion } from '../lib/countries'
import { BOARD_SIZE, fetchBoard, type Board } from '../lib/leaderboard'

const LeaderboardPage: NextPage = () => {
  const router = useRouter()
  const region = parseRegion(router.query.region) ?? 'world'
  const difficulty = parseDifficulty(router.query.mode)
  const [board, setBoard] = useState<Board | null>(null)

  useEffect(() => {
    if (!router.isReady) return
    let live = true
    setBoard(null)
    fetchBoard(region, difficulty).then((b) => live && setBoard(b))
    return () => {
      live = false
    }
  }, [router.isReady, region, difficulty])

  const go = (q: { region?: string; mode?: string }) =>
    router.replace({ pathname: '/leaderboard', query: { region, mode: difficulty, ...q } }, undefined, { shallow: true, scroll: false })

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12">
      <Head>
        <title>Leaderboard · The Country Game</title>
      </Head>
      <h1 className="text-center text-3xl font-extrabold sm:text-4xl">🏆 Leaderboard</h1>
      <p className="mt-2 text-center text-white/70">The top {BOARD_SIZE} players for each region and difficulty.</p>

      <div className="mt-6 flex justify-center">
        <div role="radiogroup" aria-label="Difficulty" className="inline-flex rounded-full bg-white/10 p-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={difficulty === d.id}
              onClick={() => go({ mode: d.id })}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                difficulty === d.id ? 'bg-white text-slate-900 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1">
        <div role="tablist" aria-label="Region" className="flex w-max gap-2 sm:mx-auto sm:w-auto sm:flex-wrap sm:justify-center">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={region === r.id}
              onClick={() => go({ region: r.id })}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                region === r.id ? 'border-pink-300 bg-pink-500/30' : 'border-white/15 bg-white/5 hover:bg-white/10'
              }`}
            >
              {r.emoji} {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {!board && (
          <div className="space-y-2" aria-label="Loading">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-white/10" />
            ))}
          </div>
        )}
        {board && !board.enabled && (
          <p className="rounded-2xl bg-white/5 px-4 py-6 text-center text-sm text-white/70">
            The leaderboard isn&apos;t available right now.
          </p>
        )}
        {board?.enabled && <BoardTable entries={board.entries} />}
      </div>
    </div>
  )
}

export default LeaderboardPage
