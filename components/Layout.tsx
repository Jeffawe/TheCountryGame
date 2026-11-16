import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()
  const playing = pathname === '/question'

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex items-center gap-2 font-bold tracking-tight">
            <span className="text-2xl transition-transform duration-500 group-hover:rotate-[360deg]" aria-hidden="true">
              🌍
            </span>
            <span className="text-base sm:text-lg">The Country Game</span>
          </Link>
          {!playing && (
            <Link
              href="/leaderboard"
              className="rounded-full px-3 py-1 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              🏆 <span className="hidden sm:inline">Leaderboard</span>
              <span className="sr-only sm:hidden">Leaderboard</span>
            </Link>
          )}
          {playing && (
            <Link href="/" className="rounded-full px-3 py-1 text-sm text-white/70 hover:bg-white/10 hover:text-white">
              Quit
            </Link>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      {!playing && (
        <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/60 sm:text-sm">
          <p>
            Designed by Jeffery Ozoekwe-Awagu · Flags by{' '}
            <a className="underline hover:text-white" href="https://flagcdn.com" target="_blank" rel="noreferrer">
              Flagpedia
            </a>{' '}
            · Country data from{' '}
            <a
              className="underline hover:text-white"
              href="https://github.com/mledoze/countries"
              target="_blank"
              rel="noreferrer"
            >
              mledoze/countries
            </a>
          </p>
          <p className="mt-1">
            Background image by{' '}
            <a
              className="underline hover:text-white"
              href="https://www.istockphoto.com/portfolio/Anastasiia_Guseva?mediatype=photography"
              target="_blank"
              rel="noreferrer"
            >
              Anastasiia_Guseva
            </a>
          </p>
        </footer>
      )}
    </div>
  )
}
