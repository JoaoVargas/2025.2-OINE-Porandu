export const LobbyScreen = ({
  roomId,
  playerInfo,
  lastAnswerResult,
}: {
  roomId: string
  playerInfo: { name: string; score: number }
  lastAnswerResult: boolean | null
}) => (
  <div className="text-center space-y-6 flex flex-col items-center justify-center h-full">
    {lastAnswerResult !== null &&
      (lastAnswerResult ? (
        <div className="text-5xl font-extrabold text-green-400 p-8 rounded-lg bg-green-900 bg-opacity-50">
          Correto!
        </div>
      ) : (
        <div className="text-5xl font-extrabold text-red-400 p-8 rounded-lg bg-red-900 bg-opacity-50">
          Incorreto!
        </div>
      ))}
    <h1 className="text-4xl font-bold">Bem-vindo(a), {playerInfo.name}!</h1>
    <p className="text-2xl">
      Você está na sala{' '}
      <span className="font-mono text-yellow-300">{roomId}</span>
    </p>
    <p className="text-3xl mt-8 animate-pulse">
      Aguardando o anfitrião iniciar a próxima rodada...
    </p>
    <p className="text-2xl font-bold mt-4">Sua pontuação: {playerInfo.score}</p>
  </div>
)
