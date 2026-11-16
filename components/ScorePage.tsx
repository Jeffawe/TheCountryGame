import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getRegion } from '../lib/countries'
import { getLastResult, type GameResult } from '../lib/storage'

function message(r: GameResult) {
  if (r.cleared) return `Flawless run. You named every flag in ${getRegion(r.region).label}!`
  const s = r.score
  if (s < 2) return "Don't give up. Give it another go."
  if (s < 5) return "Nice try. I'm sure you can do better."
  if (s < 10) return "You're getting better. The sky's the limit."
  if (s < 15) return "Wow. Amazing. I'm impressed."
  if (s < 20) return "You're smart. Really smart."
  return 'Are you using Google? Because wow. You are amazing.'
}

export default function ScorePage() {
  const [result, setResult] = useState<GameResult | null | undefined>(undefined)
  const [copied, setCopied] = useState(false)

  useEffect(() => setResult(getLastResult()), [])

  if (result === undefined) return <div className="flex-1" />

  if (result === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg">No game played yet.</p>
        <Link href="/" className="rounded-full bg-white px-6 py-3 font-bold text-slate-900">
          Start playing
        </Link>
      </div>
    )
  }

  const region = getRegion(result.region)
  const answered = result.score + result.wrong
  const accuracy = answered ? Math.round((result.score / answered) * 100) : 0

  const share = async () => {
    const text = `I named ${result.score} flags in ${region.label} (${result.difficulty}) on The Country Game. Can you beat that?`
    const url = window.location.origin
    try {
      if (navigator.share) await navigator.share({ text, url })
      else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* share cancelled or clipboard blocked */
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
        {region.label} · {result.difficulty === 'hard' ? 'Hard' : 'Easy'}
      </p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Your score</h1>
      <p className="mt-1 animate-pop bg-gradient-to-b from-white to-pink-300 bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl">
        {result.score}
      </p>
      {result.isNewBest && (
        <p className="mt-1 rounded-full bg-amber-400/25 px-4 py-1 text-sm font-bold text-amber-200">🏆 New personal best!</p>
      )}
      <p className="mt-4 text-base text-white/85 sm:text-lg">{message(result)}</p>

      <dl className="mt-6 grid w-full grid-cols-3 gap-3">
        {[
          ['Accuracy', `${accuracy}%`],
          ['Best streak', `🔥 ${result.bestStreak}`],
          ['Flags', `${answered}/${result.total}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/10 px-2 py-3">
            <dt className="text-xs text-white/60">{label}</dt>
            <dd className="mt-0.5 text-lg font-bold sm:text-xl">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={{ pathname: '/question', query: { region: result.region, mode: result.difficulty } }}
          className="rounded-full bg-pink-500 px-8 py-3 font-bold transition hover:bg-pink-400"
        >
          Play again
        </Link>
        <Link href="/" className="rounded-full bg-white/15 px-8 py-3 font-bold transition hover:bg-white/25">
          Change region
        </Link>
        <button
          type="button"
          onClick={share}
          className="rounded-full bg-white/15 px-8 py-3 font-bold transition hover:bg-white/25"
        >
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}
