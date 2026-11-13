import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import "../css/chessboard.css";

type ChessboardProps = {
  position: string;
  boardOrientation?: "white" | "black"; // flips the whole board
  rotatePieces?: boolean; // turns piece sprites upside down (fixed board, face-to-face mode)
  onSquareClick?: (square: string) => void;
  customSquareStyles?: Record<string, CSSProperties>;
  // drag and drop: canDrag says which pieces may be picked up
  canDrag?: (square: string) => boolean;
  onPieceDragStart?: (square: string) => void;
  onPieceDrop?: (from: string, to: string, tapped: boolean) => void; // tapped = released without moving
};

const PIECE_MAP: Record<string, string> = {
  P: "wP", N: "wN", B: "wB", R: "wR", Q: "wQ", K: "wK",
  p: "bP", n: "bN", b: "bB", r: "bR", q: "bQ", k: "bK",
};

const DRAG_THRESHOLD = 4; // px the pointer must move before a press counts as a drag, not a tap

type Drag = { from: string; piece: string; size: number; x: number; y: number };

export default function Chessboard({
  position,
  boardOrientation = "white",
  rotatePieces = false,
  onSquareClick,
  customSquareStyles = {},
  canDrag,
  onPieceDragStart,
  onPieceDrop,
}: ChessboardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLImageElement>(null);
  const press = useRef({ x: 0, y: 0, moved: false });
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const squareAt = (x: number, y: number) =>
    document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-square]")?.dataset.square ?? null;

  // while a piece is held: window listeners so it follows the pointer even off the board
  useEffect(() => {
    if (!drag) return;
    document.documentElement.classList.add("piece-grabbing");

    const move = (e: PointerEvent) => {
      const p = press.current;
      if (!p.moved && Math.hypot(e.clientX - p.x, e.clientY - p.y) >= DRAG_THRESHOLD) p.moved = true;
      // move the floating piece directly, no re-render per pixel
      if (ghostRef.current) {
        ghostRef.current.style.left = `${e.clientX - drag.size / 2}px`;
        ghostRef.current.style.top = `${e.clientY - drag.size / 2}px`;
      }
      const sq = squareAt(e.clientX, e.clientY);
      setHover((h) => (h === sq ? h : sq));
    };

    const drop = (to: string | null) => {
      onPieceDrop?.(drag.from, to ?? drag.from, !press.current.moved);
      setDrag(null);
      setHover(null);
    };
    const up = (e: PointerEvent) => drop(squareAt(e.clientX, e.clientY));
    const cancel = () => drop(null);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      document.documentElement.classList.remove("piece-grabbing");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [drag, onPieceDrop]);

  const onPointerDown = (e: ReactPointerEvent, square: string, piece?: string) => {
    if (e.button !== 0 || drag) return;
    if (piece && canDrag?.(square)) {
      // pick the piece up right away: it floats centred under the pointer, like chess.com
      e.preventDefault();
      press.current = { x: e.clientX, y: e.clientY, moved: false };
      const size = (boardRef.current?.offsetWidth ?? 0) / 8;
      onPieceDragStart?.(square);
      setDrag({ from: square, piece, size, x: e.clientX, y: e.clientY });
      setHover(square);
    } else {
      onSquareClick?.(square);
    }
  };

  const rows = position.split(" ")[0].split("/");
  const squares: ReactNode[] = [];

  rows.forEach((row, rank) => {
    let file = 0;
    for (const char of row) {
      const n = Number(char);
      const count = Number.isNaN(n) ? 1 : n;

      for (let i = 0; i < count; i++) {
        const square = `${String.fromCharCode(97 + file)}${8 - rank}`;
        const piece = PIECE_MAP[char];

        squares.push(
          <button
            type="button"
            key={square}
            data-square={square}
            className={`chess-square ${(rank + file) % 2 ? "dark" : "light"}${
              drag && hover === square ? " drag-over" : ""
            }${piece && !drag && canDrag?.(square) ? " can-grab" : ""}`}
            style={customSquareStyles[square]}
            onPointerDown={(e) => onPointerDown(e, square, piece)}
            // pointer presses are handled above; detail 0 = keyboard (Enter / Space)
            onClick={(e) => e.detail === 0 && onSquareClick?.(square)}
            aria-label={piece ? `${square} ${piece}` : square}
          >
            {piece && (
              <img
                className={`chess-piece${rotatePieces ? " piece-rotated" : ""}${
                  drag?.from === square ? " piece-dragging" : ""
                }`}
                src={`/assets/img/${piece}.png`}
                alt=""
                draggable={false}
              />
            )}
          </button>
        );
        file++;
      }
    }
  });

  if (boardOrientation === "black") squares.reverse();

  return (
    <div className="chessboard-wrapper">
      <div className="chessboard" ref={boardRef}>
        {squares}
      </div>
      {drag && (
        <img
          ref={ghostRef}
          className={`chess-ghost${rotatePieces ? " piece-rotated" : ""}`}
          src={`/assets/img/${drag.piece}.png`}
          alt=""
          draggable={false}
          style={{
            width: drag.size,
            height: drag.size,
            left: drag.x - drag.size / 2,
            top: drag.y - drag.size / 2,
          }}
        />
      )}
    </div>
  );
}
