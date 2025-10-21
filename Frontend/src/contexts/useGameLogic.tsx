import type { Player } from '@/types/Types'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

export interface GameLogicContextType {
  view: string
  roomId: string
  players: Player[]
  question: any
  gameResult: any
  playerInfo: { name: string; score: number }
  lastAnswerResult: boolean | null
  nameInputRef: React.RefObject<HTMLInputElement | null>
  roomInputRef: React.RefObject<HTMLInputElement | null>
  handleCreateGame: () => void
  handleJoinGame: () => void
  handleStartGame: () => void
  handleNextQuestion: () => void
  handleAnswerSubmit: (answer: number) => void
}

const GameLogicContext = createContext<GameLogicContextType | undefined>(
  undefined,
)

export const GameLogicProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>()
  const [view, setView] = useState<string>('home')
  const [roomId, setRoomId] = useState<string>('')
  const [players, setPlayers] = useState<Player[]>([])
  const [question, setQuestion] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [playerInfo, setPlayerInfo] = useState({ name: '', score: 0 })
  const [lastAnswerResult, setLastAnswerResult] = useState(null)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const roomInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      autoConnect: false,
    })
    setSocket(newSocket)

    newSocket.on('connect', () =>
      console.log('Socket conectado!', newSocket.id),
    )
    newSocket.on('game-created', (newRoomId) => {
      setRoomId(newRoomId)
      setView('host')
    })
    newSocket.on('player-joined', (updatedPlayers) => {
      setPlayers(updatedPlayers)
    })
    newSocket.on('join-success', () => {
      setView('lobby')
    })
    newSocket.on('new-question', (q) => {
      setQuestion(q)
      setLastAnswerResult(null)
      setView((view) => (view === 'host' ? 'host' : 'player-question'))
    })
    newSocket.on('answer-result', ({ isCorrect, score }) => {
      setLastAnswerResult(isCorrect)
      setPlayerInfo((p) => ({ ...p, score }))
    })
    newSocket.on('game-state-update', (game) => {
      setPlayers(game.players)
    })
    newSocket.on('game-over', (finalScores) => {
      setGameResult(finalScores)
      setView('game-over')
    })
    newSocket.on('error', (message) => {
      alert(`Erro: ${message}`)
    })

    newSocket.connect()

    return () => {
      console.log('Desconectando o socket...')
      newSocket.disconnect()
    }
  }, [])

  const handleCreateGame = () => {
    socket?.emit('create-game')
  }

  const handleJoinGame = () => {
    const playerName = nameInputRef.current?.value || ''
    const gameRoomId = roomInputRef.current?.value || ''

    if (playerName && gameRoomId) {
      setPlayerInfo({ name: playerName, score: 0 })
      setRoomId(gameRoomId)
      socket?.emit('join-game', { roomId: gameRoomId, playerName })
    }
  }

  const handleStartGame = () => {
    socket?.emit('start-game', roomId)
  }

  const handleNextQuestion = () => {
    setQuestion(null)
    socket?.emit('next-question', roomId)
  }

  const handleAnswerSubmit = (answer: number) => {
    socket?.emit('submit-answer', { roomId, answer })
    setView('lobby')
  }

  const contextValue: GameLogicContextType = {
    view,
    roomId,
    players,
    question,
    gameResult,
    playerInfo,
    lastAnswerResult,
    nameInputRef,
    roomInputRef,
    handleCreateGame,
    handleJoinGame,
    handleStartGame,
    handleNextQuestion,
    handleAnswerSubmit,
  }
  return (
    <GameLogicContext.Provider value={contextValue}>
      {children}
    </GameLogicContext.Provider>
  )
}

export const useGameLogic = () => {
  const context = useContext(GameLogicContext)
  if (context === undefined) {
    throw new Error('useGameLogic must be used within a GameLogicProvider')
  }
  return context
}
