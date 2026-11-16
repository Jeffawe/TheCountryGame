# The Country Game 🌍

How good is your geography? You get a flag and four choices: name the country before you run out of lives.

**[Play now →](https://thecountrygame.vercel.app)**

- **194 countries.** Play the whole world or one region at a time.
- **Easy or Hard.** Hard mode fills the wrong answers with look-alike neighbours.
- **Learn as you play.** Every flag reveals a fact, from name origins and anthem stories to national symbols and UNESCO sites.
- **Global leaderboard.** Make the top 20 and get your name on the board.
- **Plays anywhere.** Works on phones, tablets and desktops, with keyboard shortcuts on desktop.

## Built with

Next.js · React · TypeScript · Tailwind CSS · Upstash Redis · Vercel

Country data from [mledoze/countries](https://github.com/mledoze/countries) and the [CIA World Factbook](https://github.com/factbook/factbook.json). Flags by [Flagpedia](https://flagcdn.com).

## Run locally

```bash
npm install
npm run dev
```

The leaderboard needs Upstash Redis credentials in `.env.local` (see `.env.example`). Everything else works without setup.

---

Designed by Jeffery Ozoekwe-Awagu
