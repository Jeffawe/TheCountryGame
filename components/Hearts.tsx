import { MAX_LIVES } from '../lib/countries'

export default function Hearts({ lives, justLost }: { lives: number; justLost: boolean }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${lives} of ${MAX_LIVES} lives left`}>
      {Array.from({ length: MAX_LIVES }, (_, i) => {
        const alive = i < lives
        const breaking = justLost && i === lives
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`h-7 w-7 transition-all duration-300 sm:h-8 sm:w-8 ${
              alive ? 'text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,.6)]' : 'text-white/20'
            } ${breaking ? 'animate-shake' : ''}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        )
      })}
    </div>
  )
}
