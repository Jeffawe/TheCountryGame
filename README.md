# The Country Game

You're shown a flag from around the world and have to name the country. Three wrong answers and the game is over.

**[Click here to play!](https://thecountrygame.vercel.app)**

## Features

- 194 countries, playable by region (Africa, Americas, Asia, Europe, Oceania) or the whole world
- Easy mode (random wrong answers) and Hard mode (wrong answers are neighbouring countries)
- Streaks, accuracy, per-region high scores, and a share button
- Global leaderboard (top 20 per region and difficulty)
- A "did you know" fact after every flag, with a link to Wikipedia
- Keyboard play: press `1`-`4` to answer, `Enter` for the next flag
- Responsive, with a mobile-first layout and reduced-motion support

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Leaderboard setup

The leaderboard uses [Upstash Redis](https://upstash.com). Without it, everything else still works.

1. In the Vercel dashboard, open the project → **Storage** → **Create Database** → **Upstash for Redis** (free plan is plenty) → connect it to this project.
2. Redeploy. Vercel adds `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` / `KV_REST_API_TOKEN`) automatically; both naming styles work.
3. For local dev, run `vercel env pull .env.local` (see `.env.example`).

Scores are sent by the browser, so the server checks them: each game gets a server-side session, can be
submitted once, must end the way a real game ends (3 wrong answers or every flag answered), can't be faster
than ~0.6s per flag, and submissions are rate-limited per IP. Names are checked with a profanity filter.
To remove an entry, delete its member from the `lb:v1:<region>:<mode>` sorted set in the Upstash console.

## Data

The game has no runtime data API. `npm run build:data` builds two snapshot files:

- `data/countries.json`: names, regions, Wikipedia titles, from [mledoze/countries](https://github.com/mledoze/countries) (ODbL)
- `data/facts.json`: the 6 most interesting facts per country, from the
  [CIA World Factbook](https://github.com/factbook/factbook.json) (public domain) plus mledoze. Loaded only once a game starts.

Re-run it occasionally to pick up Factbook updates. Flag images are served by [flagcdn.com](https://flagcdn.com).

> The game previously called `restcountries.com/v3.1`, which was shut down. That is why the
> deployed site stopped working.
