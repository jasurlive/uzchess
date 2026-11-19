# uzchess

## you have only one device but you wanna play chess with your friend/wife/kids...? no problem, we turn the chessboard for you after each move ^^

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

* react + typescript
* vite 8, react router
* chess.js for the rules
* built on [django-react](https://github.com/jasurlive/django-react) template, `front/` only

---

## installation

```bash
git clone https://github.com/jasurlive/chess.git
cd chess
cp .env.example .env # optional: VITE_ENABLE_EXTRA_THEMES=false keeps only light/dark
npm install
npm run dev          # http://localhost:1212
```

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
