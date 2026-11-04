# Quiz Trivia

A trivia quiz game that runs in the browser and installs as a Progressive Web App.

Play it at [trivia.pxly.fr](https://trivia.pxly.fr).

## Features

- 10 multiple-choice questions per game, pulled from the [Open Trivia Database](https://opentdb.com/)
- 24 themes to choose from, or a random mix
- Three /2 jokers per game, each removing two wrong answers
- Installable on desktop and mobile; the app shell works offline (questions need a connection)

## Run locally

The project is plain HTML, CSS and JavaScript, with no build step. Serve the project root with any static server:

```sh
python -m http.server 8000
```

Then open http://127.0.0.1:8000/. The Service Worker is network-first, so a normal reload shows your latest changes.

## Deploy

The site is served by GitHub Pages from the repository root, on the custom domain set in `CNAME`.

Before each release, bump `CACHE_NAME` in `sw.js` so installed clients drop the old cache.

## Project structure

| Path | Content |
| --- | --- |
| `index.html` | Page markup and Service Worker registration |
| `scripts/quiz.js` | Question fetching and game state |
| `scripts/main.js` | Screens, answers and jokers |
| `styles/main.css` | Styles, including the self-hosted font |
| `sw.js` | Service Worker: precache and offline fallback |
| `manifest.json` | PWA manifest |
| `fonts/`, `images/`, `sounds/` | Static assets |

## Credits

- Questions: [Open Trivia Database](https://opentdb.com/), licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Font: [Inter](https://rsms.me/inter/), licensed under the SIL Open Font License 1.1
