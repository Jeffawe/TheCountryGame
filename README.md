# The Country Game

You're shown a flag from around the world and have to name the country. Three wrong answers and the game is over.

**[Click here to play!](https://thecountrygame.vercel.app)**

## Features

- 194 countries, playable by region (Africa, Americas, Asia, Europe, Oceania) or the whole world
- Easy mode (random wrong answers) and Hard mode (wrong answers are neighbouring countries)
- Streaks, accuracy, per-region high scores, and a share button
- Keyboard play: press `1`-`4` to answer, `Enter` for the next flag
- Responsive, with a mobile-first layout and reduced-motion support

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Data

The game has no runtime API dependency. Country data is bundled in `data/countries.json`
(generated from [mledoze/countries](https://github.com/mledoze/countries) by `npm run build:data`)
and flag images are served by [flagcdn.com](https://flagcdn.com).

> The game previously called `restcountries.com/v3.1`, which was shut down. That is why the
> deployed site stopped working.
