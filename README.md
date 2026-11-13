# uzchess
<img width="500" alt="image" src="https://github.com/user-attachments/assets/896267fc-ba9f-470d-be0d-86eae640cc22" />
<img width="500" alt="image" src="https://github.com/user-attachments/assets/b7b92ea8-df51-463f-93f3-fafd134afce2" />

## mobile view:
<img width="120" alt="image" src="https://github.com/user-attachments/assets/dd137991-416a-4418-8c52-f290de7df740" />

## yes, another chess app

built on my [django-react](https://github.com/jasurlive/django-react) template (front part).

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
