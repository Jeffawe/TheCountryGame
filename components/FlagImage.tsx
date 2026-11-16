import { useCallback, useState } from 'react'
import { flagSvgUrl, flagUrl } from '../lib/countries'

/** Flag with a loading skeleton, a PNG fallback if the SVG fails, and a retry if both fail. */
export default function FlagImage({ code }: { code: string }) {
  const [stage, setStage] = useState<'svg' | 'png' | 'failed'>('svg')
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)

  // A cached image can finish loading before React attaches onLoad, so check on mount too
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  if (stage === 'failed') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl bg-white/10 p-4 text-center">
        <p className="text-sm text-white/80">Couldn&apos;t load this flag. Check your connection.</p>
        <button
          type="button"
          onClick={() => {
            setStage('svg')
            setLoaded(false)
            setAttempt((a) => a + 1)
          }}
          className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {!loaded && <div className="absolute h-3/4 w-3/4 animate-pulse rounded-lg bg-white/10" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        key={`${code}-${stage}-${attempt}`}
        src={stage === 'svg' ? `${flagSvgUrl(code)}?r=${attempt}` : flagUrl(code, 1280)}
        alt="The flag of a mystery country"
        width={600}
        height={400}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setStage(stage === 'svg' ? 'png' : 'failed')}
        className={`max-h-full max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/25 transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
