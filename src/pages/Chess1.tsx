import LocalGame from "../components/LocalGame";

// one device, board flips after every move so the side to move is always at the bottom
export default function Chess1() {
  return <LocalGame mode="flip" />;
}
