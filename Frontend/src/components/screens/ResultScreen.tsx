import { useGameLogic } from '@/contexts/useGameLogic'

export default function ResultScreen() {
  const { players, handlePlayAgain } = useGameLogic()

  const sortedByCorrect = [...players].sort(
    (player1, player2) => player2.correct_answers - player1.correct_answers,
  )

  const sortedByPosition = [...players].sort(
    (player1, player2) => player1.position - player2.position,
  )

  return (
    <main className="min-h-screen w-full p-8 flex flex-col items-center gap-6 sm:justify-center">
      <h1 className="text-4xl sm:text-5xl font-bold">Fim de Jogo!</h1>

      <button
        onClick={handlePlayAgain}
        className="cursor-pointer w-full max-w-md py-3 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-bold text-white transition-transform transform hover:scale-105 order-2 md:order-3"
      >
        Jogar Novamente
      </button>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 md:gap-8 order-3 md:order-2">
        <section className="flex-1 w-full bg-gray-800 rounded-lg p-4 gap-4 flex flex-col">
          <h2 className="text-lg font-bold text-center text-white">
            Perguntas acertadas
          </h2>
          <div className="flex flex-col gap-3 w-full">
            {sortedByCorrect.map((player) => (
              <div
                key={player.id}
                className="bg-gray-700 rounded-lg p-3 sm:p-4 flex flex-row justify-between items-center"
              >
                <span className="text-lg sm:text-xl truncate text-white">
                  {player.name}
                </span>
                <span className="text-lg sm:text-xl font-bold text-white">
                  {player.correct_answers}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 w-full bg-gray-800 rounded-lg p-4 gap-4 flex flex-col">
          <h2 className="text-lg font-bold text-center text-white">
            Posição final
          </h2>
          <div className="flex flex-col gap-3 w-full">
            {sortedByPosition.map((player) => (
              <div
                key={player.id}
                className="bg-gray-700 rounded-lg p-3 sm:p-4 flex flex-row justify-between items-center"
              >
                <span className="text-lg sm:text-xl truncate text-white">
                  {player.name}
                </span>
                <span className="text-lg sm:text-xl font-bold text-white">
                  {player.position}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
