import { useGameLogic } from '@/contexts/useGameLogic'

export default function ResultScreen() {
  const { players, handlePlayAgain } = useGameLogic()

  return (
    <div className="">
      <div className="h-full w-full bg-gray-800 rounded-lg p-4 gap-4 flex flex-col">
        <span className="text-lg font-bold text-center">Ranking posição</span>
        <div className="flex flex-col gap-4 w-full overflow-scroll">
          {players
            .sort(
              (player1, player2) => (player1.position - player2.position) * -1,
            )
            .map((player) => (
              <div
                key={player.id}
                className=" bg-gray-700 rounded-lg p-4 gap-4 flex flex-row justify-between"
              >
                <span className="text-xl truncate ">{player.name}</span>
                <span className="text-xl font-bold">{player.position}</span>
              </div>
            ))}
        </div>
      </div>
      <div className="h-full w-full bg-gray-800 rounded-lg p-4 gap-4 flex flex-col">
        <span className="text-lg font-bold text-center">
          Ranking perguntas acertadas
        </span>
        <div className="flex flex-col gap-4 w-full overflow-scroll justify-center">
          {players
            .sort(
              (player1, player2) =>
                (player1.correct_answers - player2.correct_answers) * -1,
            )
            .map((player) => (
              <div
                key={player.id}
                className=" bg-gray-700 rounded-lg p-4 gap-4 flex flex-row justify-between"
              >
                <span className="text-xl truncate">{player.name}</span>
                <span className="text-xl font-bold">
                  {player.correct_answers}
                </span>
              </div>
            ))}
        </div>
      </div>

      <button
        onClick={handlePlayAgain}
        className="cursor-pointer w-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
      >
        Jogar Novamente
      </button>
    </div>
  )
}
