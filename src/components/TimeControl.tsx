import { TIME_CONTROLS } from "../lib/timeControls";

// segmented picker, locked once the first move is made
export default function TimeControl({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (ms: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="time-control" role="radiogroup" aria-label="Time control">
      {TIME_CONTROLS.map((tc) => (
        <button
          key={tc.label}
          type="button"
          role="radio"
          aria-checked={tc.ms === value}
          title={tc.ms ? `${tc.label} per side` : "No clock"}
          className={`page-button${tc.ms === value ? " is-active" : ""}`}
          onClick={() => onChange(tc.ms)}
          disabled={disabled}
        >
          {tc.label}
        </button>
      ))}
    </div>
  );
}
