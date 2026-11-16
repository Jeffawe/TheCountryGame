import type { Entry } from '../lib/leaderboard'

const MEDALS = ['🥇', '🥈', '🥉']

export default function BoardTable({ entries, highlightRank }: { entries: Entry[]; highlightRank?: number | null }) {
  if (!entries.length) {
    return <p className="rounded-2xl bg-white/5 px-4 py-6 text-center text-sm text-white/70">No scores yet. Be the first!</p>
  }
  return (
    <ol className="divide-y divide-white/10 overflow-hidden rounded-2xl bg-white/10">
      {entries.map((e) => (
        <li
          key={`${e.rank}-${e.at}`}
          className={`flex items-center gap-3 px-4 py-2.5 text-left ${e.rank === highlightRank ? 'bg-pink-500/30' : ''}`}
        >
          <span className="w-7 shrink-0 text-center text-sm font-bold text-white/70">{MEDALS[e.rank - 1] ?? e.rank}</span>
          <span className="min-w-0 flex-1 truncate font-semibold">
            {e.name}
            {e.rank === highlightRank && <span className="ml-2 text-xs font-bold text-pink-200">You</span>}
          </span>
          <span className="shrink-0 tabular-nums text-lg font-bold">{e.score}</span>
        </li>
      ))}
    </ol>
  )
}
