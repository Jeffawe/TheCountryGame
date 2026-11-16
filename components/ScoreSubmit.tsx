import { useEffect, useState } from 'react'
import { BOARD_SIZE, NAME_MAX, fetchBoard, nameError, normalizeName, qualifies, submitScore, type Board } from '../lib/leaderboard'
import { getSavedName, saveName, updateLastResult, type GameResult } from '../lib/storage'
import BoardTable from './BoardTable'
import Link from 'next/link'

/** Global leaderboard on the results screen, with a name form if the score made the top list. */
export default function ScoreSubmit({ result }: { result: GameResult }) {
  const [board, setBoard] = useState<Board | null>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [rank, setRank] = useState<number | null>(result.submittedRank ?? null)

  useEffect(() => {
    setName(getSavedName())
    fetchBoard(result.region, result.difficulty).then(setBoard)
  }, [result.region, result.difficulty])

  if (!board || !board.enabled) return null

  const canSubmit = !!result.gameId && rank === null && qualifies(board, result.score)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = normalizeName(name)
    const problem = nameError(clean)
    if (problem) return setError(problem)
    setSending(true)
    setError(null)
    const r = await submitScore({ gameId: result.gameId!, name: clean, score: result.score, wrong: result.wrong })
    setSending(false)
    if (!r.ok) return setError(r.error)
    saveName(clean)
    setBoard(r.board)
    setRank(r.rank ?? -1)
    updateLastResult({ submittedRank: r.rank ?? -1 })
  }

  return (
    <section className="mt-10 w-full text-left" aria-labelledby="global-heading">
      <h2 id="global-heading" className="mb-3 text-center text-lg font-bold">
        🌍 Global top {BOARD_SIZE}
      </h2>

      {canSubmit && (
        <form onSubmit={onSubmit} className="mb-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4">
          <label htmlFor="player-name" className="block text-center font-bold text-amber-100">
            You made the leaderboard! Add your name
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX}
              autoComplete="nickname"
              enterKeyHint="send"
              placeholder="Your name"
              className="min-w-0 flex-1 rounded-full border border-white/25 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-pink-300 focus:outline-none"
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-900 transition hover:bg-amber-200 disabled:opacity-60"
            >
              {sending ? 'Saving…' : 'Submit'}
            </button>
          </div>
          {error && (
            <p id="name-error" role="alert" className="mt-2 text-center text-sm text-rose-200">
              {error}
            </p>
          )}
        </form>
      )}

      {rank !== null && rank > 0 && (
        <p className="mb-3 text-center text-sm font-semibold text-pink-100" role="status">
          You&apos;re #{rank} in the world!
        </p>
      )}

      <BoardTable entries={board.entries} highlightRank={rank} />
      <p className="mt-3 text-center text-sm">
        <Link
          href={{ pathname: '/leaderboard', query: { region: result.region, mode: result.difficulty } }}
          className="text-white/70 underline-offset-2 hover:text-white hover:underline"
        >
          See all leaderboards
        </Link>
      </p>
    </section>
  )
}
