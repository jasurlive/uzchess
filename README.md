# uzchess
## yes, another chess app
built on my [django-react](https://github.com/jasurlive/django-react) template.

<img width="60%" alt="image" src="https://github.com/user-attachments/assets/90cbdef2-1ecd-4824-85bc-cfe31e8fa748" />
<img width="30%" alt="image" src="https://github.com/user-attachments/assets/031f748a-9f76-43c6-b78c-df15b95e093b" />

---

## features

* play chess locally
* two board modes
* click or drag pieces to move
* chess.com-style clocks above/below the board (1, 3, 5, 10 min), captured pieces and material lead
* analysis board (arrow keys to step through moves, `F` to flip)
* check / checkmate / draw detection
* works offline after load
* clean minimalistic ui

---

## stack

* react 19 + typescript
* vite 8, react router
* chess.js for the rules
* [django-react](https://github.com/jasurlive/django-react) template, `front/` only

---

## template

the app shell comes from [jasurlive/django-react](https://github.com/jasurlive/django-react) (`front/` folder) and keeps the same folder layout, so template updates can be brought over file by file (`Menu.tsx`, `Info.tsx` and `page.css` have chess additions, merge those instead of overwriting):

* `src/app/`: entry + routes
* `src/shared/Menu.tsx`, `src/css/menu.css`: glass sidebar on desktop, floating bar on phones, `` ` `` collapses it
* `src/css/theme.css`, `src/lib/themes.ts`, `hooks/LOCAL/useTheme.ts`: 7 themes (light, dark, linen, fjord, matte, charcoal, paper), `Ctrl+J` cycles them
* `src/pages/Settings.tsx`, `src/pages/Info.tsx`: theme picker, fullscreen, shortcuts
* `src/components/Layout.tsx`, `ErrorBoundary.tsx`, `hooks/LOCAL/useFullscreen.ts`, `useShortcuts.ts`, `src/css/reset.css`, `page.css`

the chess parts are this repo's own: board, clocks, PGN, game pages, and the board colors for each theme (`src/css/chessboard.css`, light = chess.com green).

the backend and bot from the template are not used, this app runs fully in the browser.

---

## installation

```bash
git clone https://github.com/jasurlive/chess.git
cd chess
cp .env.example .env # optional: VITE_ENABLE_EXTRA_THEMES=false keeps only light/dark
npm install
npm run dev          # http://localhost:1212
```

needs node 20.19+ or 22.12+. `npm run build` puts the site in `dist/`.

---

## project structure

```
src/
├── app/            entry: main.tsx, App.tsx (routes)
├── pages/          Home, Chess1, Chess2, Analysis, Online, Settings, Info, NotFound
├── components/     Layout, Chessboard, LocalGame, PlayerBar, TimeControl, PGN, GameStatus
├── shared/         Menu (sidebar / mobile bar), theme icons
├── hooks/LOCAL/    click/drag to move, chess clock, fullscreen, theme, shortcuts
├── lib/            game logic (chess.js), material count, sounds, themes
└── css/
public/assets/          piece images and sounds
```

simple, minimal

---

## roadmap

* [ ] online multiplayer
* [ ] better ui
* [ ] adding stockfish
---

## contributing

PRs are welcome. add a single feature at a time, no rush, no AI.

---

## license

MIT

---

## important note

if you lose, it’s not a bug it’s you.
