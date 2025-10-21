import type { Question } from "@/types/Types";

export const HostScreen = ({
  roomId,
  players,
  onStartGame,
  question,
  onNextQuestion,
}: {
  roomId: string
  players: { id: string; name: string; score: number }[]
  onStartGame: () => void
  question: Question
  onNextQuestion: () => void
}) => (
  <div className="text-center space-y-6">
    <h1 className="text-5xl font-bold">Painel do Anfitrião</h1>
    <p className="text-2xl">
      ID da Sala:{' '}
      <span className="font-mono bg-gray-700 text-yellow-300 px-4 py-2 rounded-lg">
        {roomId}
      </span>
    </p>

    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-4">
        {players.length > 0 ? 'Jogadores na Sala' : 'Aguardando jogadores...'}
      </h2>
      <ul className="space-y-2">
        {players.map((p) => (
          <li
            key={p.id}
            className="text-xl bg-gray-700 p-3 rounded-md flex justify-between"
          >
            <span>{p.name}</span> <span>{p.score}pts</span>
          </li>
        ))}
      </ul>
    </div>

    {!question && players.length > 0 && (
      <button
        onClick={onStartGame}
        className="w-full py-4 text-2xl font-bold bg-blue-600 hover:bg-blue-700 rounded-md transition-transform transform hover:scale-105"
      >
        Start Game
      </button>
    )}

    {question && (
      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">{question.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((opt) => (
            <div key={opt} className="bg-gray-700 p-4 rounded-md text-2xl">
              {opt}
            </div>
          ))}
        </div>
        <button
          onClick={onNextQuestion}
          className="mt-6 w-full py-3 text-xl font-bold bg-green-600 hover:bg-green-700 rounded-md transition-transform transform hover:scale-105"
        >
          Próxima Pergunta
        </button>
      </div>
    )}
  </div>
)
