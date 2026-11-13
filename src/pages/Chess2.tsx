import LocalGame from "../components/LocalGame";

// one device on the table between two players: board stays put, pieces turn to face whoever is to move
export default function Chess2() {
  return <LocalGame mode="face" />;
}
