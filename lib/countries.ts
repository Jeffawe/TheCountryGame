import raw from '../data/countries.json'

export type Country = {
  code: string
  name: string
  official: string
  region: string
  subregion: string
  capital: string
  area: number
  languages: string[]
  currency: { name: string; symbol: string | null } | null
  landlocked: boolean
  borders: string[]
  demonym: string | null
  tld: string | null
  calling: string | null
}

export const ALL_COUNTRIES = raw as Country[]

export type RegionId = 'world' | 'africa' | 'americas' | 'asia' | 'europe' | 'oceania'
export type Difficulty = 'easy' | 'hard'

export const REGIONS: { id: RegionId; label: string; emoji: string; match: (c: Country) => boolean }[] = [
  { id: 'world', label: 'The World', emoji: '🌐', match: () => true },
  { id: 'africa', label: 'Africa', emoji: '🌍', match: (c) => c.region === 'Africa' },
  { id: 'americas', label: 'The Americas', emoji: '🌎', match: (c) => c.region === 'Americas' },
  { id: 'asia', label: 'Asia', emoji: '🌏', match: (c) => c.region === 'Asia' },
  { id: 'europe', label: 'Europe', emoji: '🏰', match: (c) => c.region === 'Europe' },
  { id: 'oceania', label: 'Oceania', emoji: '🏝️', match: (c) => c.region === 'Oceania' },
]

export const DIFFICULTIES: { id: Difficulty; label: string; hint: string }[] = [
  { id: 'easy', label: 'Easy', hint: 'Random wrong answers' },
  { id: 'hard', label: 'Hard', hint: 'Look-alike neighbours as wrong answers' },
]

// "america" was the id used by the old version of the site
const REGION_ALIASES: Record<string, RegionId> = { america: 'americas' }

export function parseRegion(value: unknown): RegionId | null {
  const v = Array.isArray(value) ? value[0] : value
  if (typeof v !== 'string') return null
  const id = (REGION_ALIASES[v] ?? v) as RegionId
  return REGIONS.some((r) => r.id === id) ? id : null
}

export function parseDifficulty(value: unknown): Difficulty {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'hard' ? 'hard' : 'easy'
}

export function getRegion(id: RegionId) {
  return REGIONS.find((r) => r.id === id)!
}

export function countriesIn(id: RegionId): Country[] {
  return ALL_COUNTRIES.filter(getRegion(id).match)
}

export function flagUrl(code: string, width: 320 | 640 | 1280 = 640) {
  return `https://flagcdn.com/w${width}/${code}.png`
}
export const flagSrcSet = (code: string) =>
  `${flagUrl(code, 320)} 320w, ${flagUrl(code, 640)} 640w, ${flagUrl(code, 1280)} 1280w`
export const flagSvgUrl = (code: string) => `https://flagcdn.com/${code}.svg`

export function shuffle<T>(input: readonly T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export type Question = {
  answer: Country
  options: Country[] // 4 shuffled options, includes the answer
  fact: string
}

/** Picks 3 wrong answers. On hard, prefers neighbours in the same subregion, then region. */
function pickDistractors(answer: Country, pool: Country[], difficulty: Difficulty): Country[] {
  const others = (list: Country[]) => list.filter((c) => c.code !== answer.code)
  if (difficulty === 'easy') {
    const fromPool = shuffle(others(pool))
    return fromPool.length >= 3 ? fromPool.slice(0, 3) : shuffle(others(ALL_COUNTRIES)).slice(0, 3)
  }
  const tiers = [
    shuffle(others(ALL_COUNTRIES).filter((c) => c.subregion === answer.subregion)),
    shuffle(others(ALL_COUNTRIES).filter((c) => c.region === answer.region && c.subregion !== answer.subregion)),
    shuffle(others(ALL_COUNTRIES).filter((c) => c.region !== answer.region)),
  ]
  return tiers.flat().slice(0, 3)
}

const n = (value: number) => value.toLocaleString('en-US')
const list = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

export function makeFact(c: Country): string {
  const facts: string[] = [`The capital of ${c.name} is ${c.capital}.`]
  if (c.languages.length)
    facts.push(
      c.languages.length === 1
        ? `The official language of ${c.name} is ${c.languages[0]}.`
        : `${c.name} has ${c.languages.length} official languages, including ${list(c.languages.slice(0, 3))}.`,
    )
  if (c.currency)
    facts.push(`${c.name} uses the ${c.currency.name}${c.currency.symbol ? ` (${c.currency.symbol})` : ''}.`)
  if (c.area) facts.push(`${c.name} covers about ${n(c.area)} km².`)
  facts.push(
    c.borders.length
      ? `${c.name} shares a land border with ${list(c.borders.slice(0, 5))}${c.borders.length > 5 ? ' and more' : ''}.`
      : `${c.name} has no land borders.`,
  )
  if (c.landlocked) facts.push(`${c.name} is landlocked, with no coastline.`)
  if (c.calling) facts.push(`Phone numbers in ${c.name} start with ${c.calling}.`)
  if (c.tld) facts.push(`Websites from ${c.name} often end in ${c.tld}.`)
  facts.push(`${c.name} is in ${c.subregion}.`)
  return facts[Math.floor(Math.random() * facts.length)]
}

export function buildQuestion(answer: Country, pool: Country[], difficulty: Difficulty): Question {
  return {
    answer,
    options: shuffle([answer, ...pickDistractors(answer, pool, difficulty)]),
    fact: makeFact(answer),
  }
}

export const MAX_LIVES = 3

export function buildGame(region: RegionId, difficulty: Difficulty): Question[] {
  const pool = countriesIn(region)
  return shuffle(pool).map((c) => buildQuestion(c, pool, difficulty))
}
