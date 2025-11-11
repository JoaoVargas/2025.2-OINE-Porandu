import type { Game, Player, Question, ScreenView } from '@/types/Types'
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
  players: Player[]
  isHostRef: React.RefObject<boolean>
  isCurrentPlayerRoundRef: React.RefObject<boolean>
  isWaitingAnwser: boolean
  nameInputRef: React.RefObject<HTMLInputElement>
  roomInputRef: React.RefObject<HTMLInputElement>
  roomIdRef: React.RefObject<string>
  currentQuestionRef: React.RefObject<Question | null>
  currentPlayerRef: React.RefObject<Player | null>
  currentRoundRef: React.RefObject<number>
  handleCreateGame: () => void
  handleJoinGame: () => void
  handleStartGame: () => void
  handleNextRound: () => void
  handleSubmitAnswer: (answer: number) => void
}

const GameLogicContext = createContext<GameLogicContextType | undefined>(
  undefined,
)

export const GameLogicProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<ScreenView>('home')

  const [socket, setSocket] = useState<Socket>()
  const [players, setPlayers] = useState<Player[]>([])
  const [isWaitingAnwser, setIsWaitingAnwser] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const roomInputRef = useRef<HTMLInputElement>(null)

  const roomIdRef = useRef<string>('')
  const isHostRef = useRef<boolean>(false)
  const isCurrentPlayerRoundRef = useRef<boolean>(false)
  const currentQuestionRef = useRef<Question | null>(null)
  const currentPlayerRef = useRef<Player | null>(null)
  const currentRoundRef = useRef<number>(0)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      autoConnect: false,
    })

    // if (!newSocket?.connected) {
    //   return
    // }

    setSocket(newSocket)

    newSocket.on('connect', () =>
      console.log('Socket conectado!', newSocket.id),
    )

    newSocket.on('game-created', (newRoomId: string) => {
      roomIdRef.current = newRoomId
      isHostRef.current = true
      setView('pre-game')
    })

    newSocket.on('player-joined', (gameState: Game) => {
      setPlayers(gameState.players)
    })

    newSocket.on('join-success', (newRoomId: string) => {
      roomIdRef.current = newRoomId
      setView('pre-game')
    })

    newSocket.on('round-updated', (gameState: Game) => {
      console.log('Round updated received:', gameState)

      setPlayers(gameState.players)
      currentQuestionRef.current = gameState.currentQuestion
      currentPlayerRef.current = gameState.currentPlayer
      currentRoundRef.current = gameState.currentRound
      isCurrentPlayerRoundRef.current =
        currentPlayerRef.current?.id === newSocket.id
      setIsWaitingAnwser(!gameState.hasPlayerAnswered)
      gameState.currentRound === 1 &&
        setView(isHostRef.current ? 'host' : 'player')
    })

    newSocket.on(
      'answer-result',
      ({ result, advance }: { result: boolean; advance: number }) => {
        console.log('answer-result')
        if (currentPlayerRef.current?.id === newSocket.id) {
          if (result) {
            // handleCorretAnswer()
          } else {
            // handleWrongAnswer()
          }
        }
      },
    )

    newSocket.on(
      'player-answered',
      ({ result, advance }: { result: boolean; advance: number }) => {
        console.log('player-answered')
      },
    )

    newSocket.on('game-over', (gameState: Game) => {
      setPlayers(gameState.players)
      currentQuestionRef.current = gameState.currentQuestion
      currentPlayerRef.current = gameState.currentPlayer
      currentRoundRef.current = gameState.currentRound
      setIsWaitingAnwser(!gameState.hasPlayerAnswered)
      setView('result')
    })

    newSocket.on('error', (message: string) => {
      alert(`Erro: ${message}`)
    })

    newSocket.connect()

    return () => {
      console.log('Desconectando o socket...')
      newSocket?.disconnect()
    }
  }, [])

  const handleCreateGame = () => {
    socket?.emit('create-game')
  }

  const handleJoinGame = () => {
    const playerName = nameInputRef.current?.value || ''
    const gameRoomId = roomInputRef.current?.value || ''

    if (playerName && gameRoomId) {
      socket?.emit('join-game', { roomId: gameRoomId, playerName: playerName })
    }
  }

  const handleStartGame = () => {
    socket?.emit('start-game', roomIdRef.current)
  }

  const handleNextRound = () => {
    socket?.emit('next-round', roomIdRef.current)
  }

  const handleSubmitAnswer = (answer: number) => {
    socket?.emit('submit-answer', { roomId: roomIdRef.current, answer: answer })
  }

  const contextValue: GameLogicContextType = {
    view,
    players,
    isHostRef,
    isCurrentPlayerRoundRef,
    isWaitingAnwser,
    nameInputRef,
    roomInputRef,
    roomIdRef,
    currentQuestionRef,
    currentPlayerRef,
    currentRoundRef,
    handleCreateGame,
    handleJoinGame,
    handleStartGame,
    handleNextRound,
    handleSubmitAnswer,
  } as GameLogicContextType
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
