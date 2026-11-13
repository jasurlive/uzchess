import { FiClock } from "react-icons/fi";
import { formatClock } from "../hooks/LOCAL/useClock";
import type { Material } from "../lib/material";

type PlayerBarProps = {
  side: "white" | "black";
  ms: number | null; // null = no clock
  toMove: boolean;
  ticking: boolean; // this side's clock is running right now
  flagged: boolean;
  material: Material;
  rotated?: boolean; // turned to face the player across the table (2 sides mode)
};

// name + captured pieces on the left, clock on the right, like chess.com
export default function PlayerBar({ side, ms, toMove, ticking, flagged, material, rotated }: PlayerBarProps) {
  const low = ms !== null && ms < 20_000;
  const prefix = side === "white" ? "w" : "b";

  return (
    <div className={`player-bar${rotated ? " player-rotated" : ""}`}>
      <img className="player-avatar" src={`/assets/img/${prefix}K.png`} alt="" draggable={false} />

      <div className="player-info">
        <span className="player-name">
          {side === "white" ? "White" : "Black"}
          {toMove && <span className="player-to-move" aria-label="to move" />}
        </span>
        <span className="player-taken">
          {material.taken.map((piece, i) => (
            <img key={i} src={`/assets/img/${piece}.png`} alt="" draggable={false} />
          ))}
          {material.lead > 0 && <span className="player-lead">+{material.lead}</span>}
        </span>
      </div>

      {ms !== null && (
        <div
          className={`clock clock-${side}${toMove ? " is-active" : ""}${ticking && low ? " is-low" : ""}${
            flagged ? " is-flagged" : ""
          }`}
          role="timer"
          aria-label={`${side} clock`}
        >
          {ticking && <FiClock className="clock-icon" aria-hidden />}
          {formatClock(ms)}
        </div>
      )}
    </div>
  );
}
