// Regenerates data/countries.json from the open mledoze/countries dataset
// (the same source REST Countries was built on). Run: npm run build:data
import { writeFileSync } from 'node:fs'

const SRC = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
const res = await fetch(SRC)
if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`)
const all = await res.json()

const byCode = Object.fromEntries(all.map((c) => [c.cca3, c.name.common]))

const slim = all
  .filter((c) => c.independent === true && c.region !== 'Antarctic' && c.capital?.length)
  .map((c) => {
    const currency = Object.values(c.currencies ?? {})[0]
    const calling = c.idd?.root ? `${c.idd.root}${c.idd.suffixes?.length === 1 ? c.idd.suffixes[0] : ''}` : null
    return {
      code: c.cca2.toLowerCase(),
      name: c.name.common,
      official: c.name.official,
      region: c.region,
      subregion: c.subregion ?? c.region,
      capital: c.capital[0],
      area: Math.round(c.area),
      languages: Object.values(c.languages ?? {}),
      currency: currency ? { name: currency.name, symbol: currency.symbol ?? null } : null,
      landlocked: !!c.landlocked,
      borders: (c.borders ?? []).map((b) => byCode[b]).filter(Boolean),
      demonym: c.demonyms?.eng?.m ?? null,
      tld: c.tld?.[0] ?? null,
      calling,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

writeFileSync(new URL('../data/countries.json', import.meta.url), JSON.stringify(slim))
console.log(`Wrote ${slim.length} countries`)
