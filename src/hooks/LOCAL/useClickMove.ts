import { useRef, useState, type CSSProperties } from 'react'
import type { Move, Square } from 'chess.js'
import GameLogic from '../../lib/logic'
import { handleMoveSounds } from '../../lib/sound'

type Args = {
  gameLogic: GameLogic
  setGameLogic: (logic: GameLogic) => void
  setFen: (fen: string) => void
  onMove?: (move: Move) => void // e.g. flip board orientation, record PGN
  locked?: boolean // no more moves (e.g. someone lost on time)
}

// click a piece, then click where it goes; or drag it there
export function useClickMove({ gameLogic, setGameLogic, setFen, onMove, locked = false }: Args) {
  const [selected, setSelected] = useState<string | null>(null)
  const [targets, setTargets] = useState<string[]>([])

  const clear = () => {
    setSelected(null)
    setTargets([])
  }

  const chessTargets = (square: string) =>
    gameLogic.getInstance().moves({ square: square as Square, verbose: true }).map((m) => m.to as string)

  const select = (square: string) => {
    const chess = gameLogic.getInstance()
    const piece = chess.get(square as Square)
    if (piece && piece.color === chess.turn() && !chess.isGameOver()) {
      setSelected(square)
      setTargets(chessTargets(square))
      return true
    }
    return false
  }

  const move = (from: string, to: string) => {
    const logic = new GameLogic(gameLogic.getFen())
    const result = logic.move(from, to, 'q')

    handleMoveSounds(logic.getInstance(), result.move)
    clear()

    if (result.valid && result.move) {
      setGameLogic(logic)
      setFen(result.updatedFen)
      onMove?.(result.move)
    }
  }

  const onSquareClick = (square: string) => {
    if (locked) return
    if (!selected) return void select(square)
    if (selected === square) return clear()
    // clicking another own piece switches the selection instead of an error
    if (!targets.includes(square) && select(square)) return
    move(selected, square)
  }

  // drag and drop: only the side to move can pick up pieces
  const canDrag = (square: string) => {
    if (locked) return false
    const chess = gameLogic.getInstance()
    return chess.get(square as Square)?.color === chess.turn() && !chess.isGameOver()
  }

  // picking a piece up selects it; remember if it already was, so a tap on it deselects
  const wasSelected = useRef(false)

  const onPieceDragStart = (square: string) => {
    wasSelected.current = selected === square
    if (!wasSelected.current) select(square)
  }

  const onPieceDrop = (from: string, to: string, tapped: boolean) => {
    if (from === to) {
      if (tapped && wasSelected.current) clear() // tap on the selected piece again
      return // otherwise put back: stays selected, click a target to move
    }
    if (canDrag(from) && chessTargets(from).includes(to)) move(from, to)
    else clear() // illegal square: piece snaps back quietly
  }

  const customSquareStyles: Record<string, CSSProperties> = {}
  if (selected) customSquareStyles[selected] = { background: 'var(--square-selected)' }
  // dot on empty squares, ring around capturable pieces (like chess.com)
  targets.forEach((sq) => {
    const capture = !!gameLogic.getInstance().get(sq as Square)
    customSquareStyles[sq] = {
      backgroundImage: capture
        ? 'radial-gradient(circle, transparent 79%, rgba(0,0,0,0.16) 80%)'
        : 'radial-gradient(circle, rgba(0,0,0,0.16) 25%, transparent 26%)',
    }
  })

  return {
    onSquareClick,
    canDrag,
    onPieceDragStart,
    onPieceDrop,
    customSquareStyles,
    turn: gameLogic.getTurn() === 'b' ? 'black' : 'white',
    status: gameLogic.status(),
  } as const
}
