// Regenerates data/countries.json and data/facts.json.
// Run: npm run build:data   (takes a few minutes because Wikipedia lookups are throttled)
//
// Sources:
//  - mledoze/countries (ODbL): names, codes, regions, capitals, languages, currencies, borders
//  - CIA World Factbook via factbook/factbook.json (public domain): name origins, independence,
//    anthems, national symbols, heritage sites, highest points, population, median age, farming
//  - Wikipedia REST API: resolves the right article title for the "Learn more" link
import { writeFileSync } from 'node:fs'

const UA = { 'User-Agent': 'the-country-game-data-build/1.0' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const getJson = async (url, { optional = false } = {}) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: UA })
    if (res.ok) return res.json()
    if (res.status === 404) return null
    const retryAfter = Number(res.headers.get('retry-after'))
    await sleep(retryAfter > 0 ? retryAfter * 1000 : 1500 * 2 ** attempt)
  }
  if (optional) return null
  throw new Error(`Failed: ${url}`)
}
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++
        out[idx] = await fn(items[idx], idx)
      }
    }),
  )
  return out
}

// ---------- text helpers ----------
const ACRONYMS = new Set(['USSR', 'NATO', 'UNESCO', 'OPEC', 'USA', 'UAE'])
const ACCENTS = { acute: '\u0301', grave: '\u0300', circ: '\u0302', uml: '\u0308', tilde: '\u0303', cedil: '\u0327', ring: '\u030A', caron: '\u030C' }
const ENTITIES = { szlig: 'ß', aelig: 'æ', AElig: 'Æ', oslash: 'ø', Oslash: 'Ø', eth: 'ð', thorn: 'þ',  amp: '&', nbsp: ' ', quot: '"', apos: "'", ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–', mdash: '—' }
function clean(s) {
  if (!s) return ''
  let out = String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&([a-zA-Z])(acute|grave|circ|uml|tilde|cedil|ring|caron);/g, (_, l, a) => (l + ACCENTS[a]).normalize('NFC'))
    .replace(/&([a-zA-Z]+);/g, (m, e) => ENTITIES[e] ?? m)
    .replace(/ /g, ' ')
    .replace(/\s*\(\d{4}(?: est\.)?\)/g, '')
    .replace(/(?<!\p{L})\p{Lu}{4,}(?!\p{L})/gu, (w) => (ACRONYMS.has(w) ? w : w[0] + w.slice(1).toLowerCase()))
    .replace(/\s+/g, ' ')
    .trim()
  // Drop curly quotes the source left unbalanced
  if ((out.match(/“/g) ?? []).length !== (out.match(/”/g) ?? []).length) out = out.replace(/[“”]/g, '')
  return out
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const endDot = (s) => (/[.!?…]$/.test(s) ? s : `${s}.`)
const list = (items) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
/** Split on a separator that isn't inside parentheses */
function splitTop(s, sep = ',') {
  const parts = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === sep && depth === 0) {
      parts.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}
/** Trim long text at a clause boundary */
function clip(s, max = 240) {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const at = Math.max(cut.lastIndexOf('; '), cut.lastIndexOf('. '))
  return at > 60 ? cut.slice(0, at) : cut.slice(0, cut.lastIndexOf(' ')) + '…'
}
const fmtPop = (n) =>
  n >= 1e9
    ? `${(n / 1e9).toFixed(2).replace(/\.?0+$/, '')} billion`
    : n >= 1e6
      ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '')} million`
      : n >= 1e4
        ? `${Math.round(n / 1e3).toLocaleString('en-US')},000`
        : n.toLocaleString('en-US')

// Countries whose English name takes "the" mid-sentence
const THE = new Set([
  'United Kingdom', 'United States', 'Netherlands', 'Philippines', 'Bahamas', 'Gambia', 'Maldives',
  'Marshall Islands', 'Solomon Islands', 'Central African Republic', 'Dominican Republic',
  'United Arab Emirates', 'Comoros', 'Czech Republic', 'Vatican City',
])
/** Returns [mid-sentence name, sentence-start name, possessive] */
function names(name) {
  const mid = THE.has(name) ? `the ${name}` : name
  return { N: mid, S: cap(mid), P: `${mid}${mid.endsWith('s') ? "'" : "'s"}`, PS: cap(`${mid}${mid.endsWith('s') ? "'" : "'s"}`) }
}

// ---------- 1. base data ----------
const all = await getJson('https://raw.githubusercontent.com/mledoze/countries/master/countries.json')
const byCca3 = Object.fromEntries(all.map((c) => [c.cca3, c.name.common]))
const base = all
  .filter((c) => c.independent === true && c.region !== 'Antarctic' && c.capital?.length)
  .sort((a, b) => a.name.common.localeCompare(b.name.common))

// ---------- 2. factbook ----------
const tree = await getJson('https://api.github.com/repos/factbook/factbook.json/git/trees/master?recursive=1')
const fbPaths = tree.tree
  .map((t) => t.path)
  .filter((p) => /^[a-z-]+\/[a-z]{2}\.json$/.test(p) && !/^(meta|oceans|world|antarctica)\//.test(p))
const fbDocs = await mapLimit(fbPaths, 16, (p) =>
  getJson(`https://raw.githubusercontent.com/factbook/factbook.json/master/${p}`),
)
const fbByTld = {}
const fbByName = {}
for (const d of fbDocs) {
  if (!d) continue
  const tld = clean(d.Communications?.['Internet country code']?.text).match(/\.[a-z]{2}\b/)?.[0]
  if (tld) fbByTld[tld] = d
  const short = clean(d.Government?.['Country name']?.['conventional short form']?.text)
  if (short) fbByName[short.toLowerCase()] = d
}

function factbookFacts(name, d) {
  const { N, S, P, PS } = names(name)
  const facts = []
  const g = d.Government ?? {}
  const add = (label, text) => text && facts.push({ label, text: endDot(clip(text)) })

  // Where the name comes from
  const ety = clean(g['Country name']?.etymology?.text)
  if (ety && !/^(none|unknown|no )/i.test(ety)) add('Name origin', cap(ety))

  // Independence (only the simple, unambiguous form)
  const ind = clean(g.Independence?.text)
  const m = ind.match(/^(\d{1,2} [A-Z][a-z]+ \d{4}) \(from ([^)]+)\)$/)
  if (m) add('Independence', `${S} became independent from ${m[2]} on ${m[1]}`)

  // National symbols (skip complex multi-part ones like the UK's)
  const sym = clean(g['National symbol(s)']?.text)
  if (sym && !sym.includes(';')) {
    const parts = splitTop(sym).filter((p) => !/^national colors?/i.test(p))
    if (parts.length === 1) add('National symbol', `${PS} national symbol is the ${parts[0]}`)
    else if (parts.length > 1) add('National symbol', `${PS} national symbols are the ${list(parts)}`)
  }

  // Anthem + its story
  const anthem = g['National anthem(s)'] ?? g['National anthem']
  const title = clean(anthem?.title?.text ?? anthem?.name?.text)
  if (/^["“]/.test(title)) {
    const history = clean(anthem?.history?.text ?? anthem?.note?.text)
    const story = history.split('; ').filter((p) => !/^(adopted|restored|lyrics|music)\b/i.test(p))[0]
    add('National anthem', `The national anthem of ${N} is ${title}.${story ? ` ${cap(endDot(story))}` : ''}`)
  }

  // UNESCO sites
  const her = g['National heritage']
  const total = parseInt(clean(her?.['total World Heritage Sites']?.text), 10)
  if (total > 0) {
    const sites = clean(her?.['selected World Heritage Site locales']?.text)
      .replace(/\s*\((?:c|n|m|mixed)\)/g, '')
      .split(/;\s*/)
      .filter(Boolean)
      .slice(0, 2)
    add(
      'World Heritage',
      total === 1
        ? `${S} has one UNESCO World Heritage Site${sites[0] ? `: ${sites[0]}` : ''}`
        : `${S} has ${total} UNESCO World Heritage Sites${sites.length ? `, including ${list(sites)}` : ''}`,
    )
  }

  // Highest point
  const hi = clean(d.Geography?.Elevation?.['highest point']?.text).match(/^(.+?) (-?[\d,]+) m$/)
  if (hi) add('Highest point', `The highest point in ${N} is ${hi[1]}, at ${hi[2]} m`)

  // Population
  const pop = parseInt(clean(d['People and Society']?.Population?.total?.text).replace(/,/g, ''), 10)
  if (pop > 0) add('Population', `About ${fmtPop(pop)} people live in ${N}`)

  // Median age
  const age = clean(d['People and Society']?.['Median age']?.total?.text).match(/^([\d.]+) years/)
  if (age) add('Median age', `Half of all people in ${N} are younger than ${age[1]} years old`)

  // Main farm products
  const crops = splitTop(clean(d.Economy?.['Agricultural products']?.text)).filter((c) => c && c.length < 40)
  if (crops.length >= 3)
    add('Farming', `${PS} biggest farm product by weight is ${crops[0]}, followed by ${crops[1]} and ${crops[2]}`)

  return facts
}

// ---------- 3. wikipedia titles ----------
async function wikiTitle(c) {
  const candidates = [c.name.common, `${c.name.common} (country)`, c.name.official]
  for (const t of candidates) {
    const s = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`, { optional: true })
    await sleep(150)
    if (s && s.type === 'standard' && /country|state|nation|kingdom|republic|island|archipelago/i.test(s.description ?? ''))
      return s.titles.canonical
  }
  return c.name.common.replace(/ /g, '_')
}
const wiki = await mapLimit(base, 2, wikiTitle)

// ---------- 4. assemble ----------
// Only keep the most interesting few per country
const PRIORITY = ['Name origin', 'National anthem', 'National symbol', 'Independence', 'World Heritage', 'Highest point', 'Population', 'Capital', 'Median age', 'Neighbours']
const MAX_FACTS = 6
const curate = (f) =>
  PRIORITY.map((label) => f.find((x) => x.label === label))
    .filter(Boolean)
    .slice(0, MAX_FACTS)

const countries = []
const facts = {}
const unmatched = []
base.forEach((c, i) => {
  const code = c.cca2.toLowerCase()
  const name = c.name.common
  const { N, S } = names(name)
  const currency = Object.values(c.currencies ?? {})[0]
  const languages = Object.values(c.languages ?? {})
  const borders = (c.borders ?? []).map((b) => byCca3[b]).filter(Boolean)

  countries.push({ code, name, official: c.name.official, region: c.region, subregion: c.subregion ?? c.region, wiki: wiki[i] })

  const f = [{ label: 'Capital', text: `The capital of ${N} is ${c.capital[0]}.` }]
  if (languages.length)
    f.push({
      label: 'Languages',
      text:
        languages.length === 1
          ? `The official language of ${N} is ${languages[0]}.`
          : `${S} has ${languages.length} official languages, including ${list(languages.slice(0, 3))}.`,
    })
  if (currency) f.push({ label: 'Currency', text: `${S} uses the ${currency.name}${currency.symbol ? ` (${currency.symbol})` : ''}.` })
  const shown = borders.slice(0, 5)
  f.push({
    label: 'Neighbours',
    text: borders.length
      ? `${S} shares a land border with ${borders.length > 5 ? `${shown.join(', ')} and ${borders.length - 5} more` : list(shown)}.`
      : `${S} has no land borders with any other country.`,
  })
  if (c.landlocked) f.push({ label: 'Geography', text: `${S} is landlocked, with no coastline at all.` })

  const fb = fbByTld[c.tld?.[0]] ?? fbByName[name.toLowerCase()]
  if (fb) f.push(...factbookFacts(name, fb))
  else unmatched.push(name)
  facts[code] = curate(f)
})

writeFileSync(new URL('../data/countries.json', import.meta.url), JSON.stringify(countries))
writeFileSync(new URL('../data/facts.json', import.meta.url), JSON.stringify(facts))
const total = Object.values(facts).reduce((n, f) => n + f.length, 0)
console.log(`Wrote ${countries.length} countries, ${total} facts`)
if (unmatched.length) console.log(`No Factbook match: ${unmatched.join(', ')}`)
