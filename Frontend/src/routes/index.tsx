import { EndScreen } from '@/components/screens/EndScreen'
import { HomeScreen } from '@/components/screens/HomeScreen'
import { HostScreen } from '@/components/screens/HostScreen'
import { LobbyScreen } from '@/components/screens/LobbyScreen'
import { PlayerScreen } from '@/components/screens/PlayerScreen'
import { useGameLogic } from '@/contexts/useGameLogic'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const {
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
  } = useGameLogic()

  function handleGoHome() {
    window.location.reload()
  }

  function renderView() {
    switch (view) {
      case 'host':
        return (
          <HostScreen
            roomId={roomId}
            players={players}
            onStartGame={handleStartGame}
            question={question}
            onNextQuestion={handleNextQuestion}
          />
        )
      case 'player-question':
        return (
          <PlayerScreen
            question={question}
            onAnswerSubmit={handleAnswerSubmit}
            playerInfo={playerInfo}
          />
        )
      case 'lobby':
        return (
          <LobbyScreen
            roomId={roomId}
            playerInfo={playerInfo}
            lastAnswerResult={lastAnswerResult}
          />
        )
      case 'game-over':
        return <EndScreen results={gameResult} onGoHome={handleGoHome} />
      case 'home':
        return (
          <HomeScreen
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            nameRef={nameInputRef}
            roomRef={roomInputRef}
          />
        )
      default:
        return (
          <HomeScreen
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            nameRef={nameInputRef}
            roomRef={roomInputRef}
          />
        )
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl mx-auto">{renderView()}</div>
    </div>
  )
}
