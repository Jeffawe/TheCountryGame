import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MAX_LIVES,
  buildGame,
  flagSvgUrl,
  getRegion,
  loadFacts,
  wikiUrl,
  type Difficulty,
  type Fact,
  type RegionId,
} from '../lib/countries'
import { startOnlineGame } from '../lib/leaderboard'
import { saveResult } from '../lib/storage'
import FlagImage from './FlagImage'
import Hearts from './Hearts'

type Props = { region: RegionId; difficulty: Difficulty }

export default function QuestionPage({ region, difficulty }: Props) {
  const router = useRouter()
  const [questions] = useState(() => buildGame(region, difficulty))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [facts, setFacts] = useState<Record<string, Fact[]> | null>(null)
  const gameId = useRef<Promise<string | null> | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    loadFacts().then(setFacts, () => setFacts({}))
    // Registers the game with the leaderboard server (null if the leaderboard is off)
    gameId.current = startOnlineGame(region, difficulty)
  }, [region, difficulty])

  const q = questions[index]
  const revealed = picked !== null
  const isCorrect = revealed && picked === q.answer.name
  const finished = lives === 0 || index === questions.length - 1
  const factList = facts?.[q.answer.code]
  const fact: Fact | null = factList?.length ? factList[Math.floor(q.factSeed * factList.length)] : null

  const pick = useCallback(
    (name: string) => {
      if (picked !== null) return
      setPicked(name)
      if (name === q.answer.name) {
        setScore((s) => s + 1)
        setStreak((s) => {
          setBestStreak((b) => Math.max(b, s + 1))
          return s + 1
        })
      } else {
        setLives((l) => l - 1)
        setWrong((w) => w + 1)
        setStreak(0)
      }
    },
    [picked, q],
  )

  const next = async () => {
    if (finished) {
      const id = await (gameId.current ?? Promise.resolve(null))
      saveResult({
        gameId: id,
        region,
        difficulty,
        score,
        wrong,
        bestStreak,
        total: questions.length,
        cleared: lives > 0,
      })
      router.push('/scores')
    } else {
      setIndex((i) => i + 1)
      setPicked(null)
    }
  }

  // Keys 1-4 pick an answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const i = Number(e.key) - 1
      if (i >= 0 && i < q.options.length) pick(q.options[i].name)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [q, pick])

  // Move focus to "Next" so Enter continues, and so screen readers hear the result
  useEffect(() => {
    if (revealed) nextRef.current?.focus({ preventScroll: true })
  }, [revealed])

  // Warm the cache for the next flag so it shows instantly
  useEffect(() => {
    const upcoming = questions[index + 1]
    if (upcoming) new Image().src = flagSvgUrl(upcoming.answer.code)
  }, [index, questions])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-52 pt-4 sm:pt-6">
      {/* Status bar */}
      <div className="flex items-center justify-between gap-3">
        <Hearts lives={lives} justLost={revealed && !isCorrect} />
        <div className="flex items-center gap-2 text-sm font-semibold">
          {streak >= 2 && (
            <span className="rounded-full bg-orange-500/25 px-3 py-1 text-orange-200" title="Current streak">
              🔥 {streak}
            </span>
          )}
          <span className="rounded-full bg-white/15 px-3 py-1" aria-label={`Score ${score}`}>
            Score {score}
          </span>
        </div>
      </div>

      <div className="mt-3" aria-hidden="true">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500"
            style={{ width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-white/60">
          {getRegion(region).label} · {index + 1} / {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="mt-2 grid flex-1 items-center gap-6 md:grid-cols-2 md:gap-10">
        <div className="h-[28dvh] min-h-[150px] md:h-[46dvh]">
          <FlagImage key={q.answer.code} code={q.answer.code} />
        </div>

        <div>
          <h1 className="mb-4 text-center text-lg font-bold md:text-left md:text-2xl">Which country has this flag?</h1>
          <ul className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isAnswer = opt.name === q.answer.name
              const isPicked = opt.name === picked
              let state = 'border-white/25 bg-white/10 hover:border-pink-300 hover:bg-white/20 active:scale-[.99]'
              if (revealed) {
                if (isAnswer) state = 'border-emerald-300 bg-emerald-500 text-white'
                else if (isPicked) state = 'border-rose-300 bg-rose-600 text-white animate-shake'
                else state = 'border-white/10 bg-white/5 opacity-50'
              }
              return (
                <li key={opt.code}>
                  <button
                    type="button"
                    onClick={() => pick(opt.name)}
                    aria-disabled={revealed}
                    className={`flex min-h-[3.25rem] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 sm:text-lg ${state}`}
                  >
                    <span
                      className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/25 text-xs font-bold md:flex"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1">{opt.name}</span>
                    {revealed && isAnswer && <span aria-label="Correct answer">✓</span>}
                    {revealed && isPicked && !isAnswer && <span aria-label="Your answer, incorrect">✕</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Feedback sheet */}
      {revealed && (
        <div className="fixed inset-x-0 bottom-0 z-30 animate-fade-up px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div
            className={`mx-auto max-w-2xl rounded-2xl border p-4 shadow-2xl backdrop-blur-md sm:p-5 ${
              isCorrect ? 'border-emerald-300/50 bg-emerald-950/90' : 'border-rose-300/50 bg-rose-950/90'
            }`}
            role="status"
            aria-live="polite"
          >
            <p className="text-lg font-bold sm:text-xl">
              {isCorrect ? 'Correct! 🎉' : `Not quite. That was ${q.answer.name}.`}
            </p>
            {fact && (
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                <span className="mr-1.5 rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white/80">
                  {fact.label}
                </span>
                {fact.text}
              </p>
            )}
            <a
              href={wikiUrl(q.answer)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
            >
              More about {q.answer.name} on Wikipedia ↗
            </a>
            <button
              ref={nextRef}
              type="button"
              onClick={next}
              className="mt-4 w-full rounded-full bg-white px-6 py-3 text-base font-bold text-slate-900 transition hover:bg-pink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              {finished ? 'See results' : 'Next flag →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
