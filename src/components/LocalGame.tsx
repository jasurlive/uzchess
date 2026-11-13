import { useEffect, useState } from "react";
import Chessboard from "./Chessboard";
import PGN from "./PGN";
import GameStatus from "./GameStatus";
import PlayerBar from "./PlayerBar";
import TimeControl from "./TimeControl";
import { TIME_CONTROLS } from "../lib/timeControls";
import GameLogic from "../lib/logic";
import { material } from "../lib/material";
import { playGameStartSound } from "../lib/sound";
import { useClickMove } from "../hooks/LOCAL/useClickMove";
import { useClock } from "../hooks/LOCAL/useClock";
import "../css/game.css";
import "../css/time.css";

type Mode = "flip" | "face"; // flip: board turns every move; face: board fixed, players sit opposite

const TC_KEY = "time-control";
const savedTimeControl = () => {
  try {
    const ms = Number(localStorage.getItem(TC_KEY));
    if (TIME_CONTROLS.some((tc) => tc.ms === ms) && localStorage.getItem(TC_KEY) !== null) return ms;
  } catch {}
  return TIME_CONTROLS[1].ms;
};

// two players on one device; `key` on <Game> restarts everything for a new game
export default function LocalGame({ mode }: { mode: Mode }) {
  const [game, setGame] = useState(0);
  const [timeControl, setTimeControl] = useState(savedTimeControl);

  const pickTimeControl = (ms: number) => {
    setTimeControl(ms);
    try {
      localStorage.setItem(TC_KEY, String(ms));
    } catch {}
  };

  return (
    <Game
      key={`${game}-${timeControl}`}
      mode={mode}
      timeControl={timeControl}
      onTimeControl={pickTimeControl}
      onNewGame={() => setGame((g) => g + 1)}
    />
  );
}

function Game({
  mode,
  timeControl,
  onTimeControl,
  onNewGame,
}: {
  mode: Mode;
  timeControl: number;
  onTimeControl: (ms: number) => void;
  onNewGame: () => void;
}) {
  const [gameLogic, setGameLogic] = useState(() => new GameLogic());
  const [fen, setFen] = useState(gameLogic.getFen());
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => playGameStartSound(), []);

  const turn = gameLogic.getTurn() === "b" ? "black" : "white";
  const over = gameLogic.getInstance().isGameOver();
  // clock starts with the first move, like chess.com
  const { times, flagged, ticking } = useClock(timeControl, turn, moves.length > 0 && !over);

  const { onSquareClick, canDrag, onPieceDragStart, onPieceDrop, customSquareStyles, status } = useClickMove({
    gameLogic,
    setGameLogic,
    setFen,
    locked: !!flagged,
    onMove: (move) => setMoves((m) => [...m, move.san]),
  });

  const result = flagged ? `${flagged === "white" ? "Black" : "White"} wins on time` : status;

  // flip mode: side to move sits at the bottom; face mode: white bottom, black top (turned around)
  const bottom = mode === "flip" ? turn : "white";
  const top = bottom === "white" ? "black" : "white";
  const mat = material(fen);

  const bar = (side: "white" | "black", rotated = false) => (
    <PlayerBar
      side={side}
      ms={timeControl ? times[side] : null}
      toMove={turn === side && !over && !flagged}
      ticking={ticking && turn === side}
      flagged={flagged === side}
      material={mat[side]}
      rotated={rotated}
    />
  );

  return (
    <div className="game-page">
      <div className="game-board-area">
        <div className="board-stack has-bars">
          {bar(top, mode === "face")}
          <Chessboard
            position={fen}
            boardOrientation={bottom}
            rotatePieces={mode === "face" && turn === "black"}
            onSquareClick={onSquareClick}
            canDrag={canDrag}
            onPieceDragStart={onPieceDragStart}
            onPieceDrop={onPieceDrop}
            customSquareStyles={customSquareStyles}
          />
          {bar(bottom)}
        </div>
      </div>
      <aside className="game-sidebar">
        <GameStatus turn={turn} status={result} onNewGame={onNewGame} />
        <TimeControl value={timeControl} onChange={onTimeControl} disabled={moves.length > 0} />
        <PGN moves={moves} />
      </aside>
    </div>
  );
}
