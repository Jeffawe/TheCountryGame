import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DIFFICULTIES, REGIONS, countriesIn, type Difficulty } from '../lib/countries'
import { bestKey, getBestScores } from '../lib/storage'

const MODE_KEY = 'tcg:difficulty'

export default function HomePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [best, setBest] = useState<Record<string, number>>({})

  useEffect(() => {
    setBest(getBestScores())
    try {
      if (localStorage.getItem(MODE_KEY) === 'hard') setDifficulty('hard')
    } catch {
      /* ignore */
    }
  }, [])

  const pickDifficulty = (d: Difficulty) => {
    setDifficulty(d)
    try {
      localStorage.setItem(MODE_KEY, d)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:py-16">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-pink-300 via-white to-rose-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
          The Country Game
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-xl">
          How good is your geography? Name the country behind each flag. Three wrong answers and it&apos;s game over.
        </p>
      </div>

      <section aria-labelledby="mode-heading" className="mt-10 flex flex-col items-center gap-2">
        <h2 id="mode-heading" className="text-xs font-semibold uppercase tracking-widest text-white/60">
          Difficulty
        </h2>
        <div role="radiogroup" aria-label="Difficulty" className="inline-flex rounded-full bg-white/10 p-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={difficulty === d.id}
              onClick={() => pickDifficulty(d.id)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                difficulty === d.id ? 'bg-white text-slate-900 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-white/60">{DIFFICULTIES.find((d) => d.id === difficulty)!.hint}</p>
      </section>

      <section aria-labelledby="region-heading" className="mt-8">
        <h2 id="region-heading" className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-white/60">
          Pick where to play
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {REGIONS.map((r) => {
            const score = best[bestKey(r.id, difficulty)]
            return (
              <li key={r.id}>
                <Link
                  href={{ pathname: '/question', query: { region: r.id, mode: difficulty } }}
                  className="group flex h-full flex-col items-center gap-1 rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur transition hover:-translate-y-1 hover:border-pink-300/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 sm:p-6"
                >
                  <span className="text-4xl transition-transform group-hover:scale-110 sm:text-5xl" aria-hidden="true">
                    {r.emoji}
                  </span>
                  <span className="mt-1 text-base font-bold sm:text-lg">{r.label}</span>
                  <span className="text-xs text-white/70 sm:text-sm">{countriesIn(r.id).length} flags</span>
                  {score ? (
                    <span className="mt-1 rounded-full bg-pink-500/30 px-2.5 py-0.5 text-xs font-semibold text-pink-100">
                      Best: {score}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
