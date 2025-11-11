import { useGameLogic } from '@/contexts/useGameLogic'

export default function HostScreen() {
  const { currentQuestionRef, currentPlayerRef, players, handleNextRound } =
    useGameLogic()

  return (
    <div className="grid grid-cols-11 grid-rows-11 gap-8 h-full p-8">
      <div className="col-span-8 row-span-8">
        <div className="h-full w-full bg-gray-800 rounded-lg p-4">main</div>
      </div>
      <div className="col-span-3 row-span-1">
        <button
          onClick={handleNextRound}
          className="cursor-pointer w-full h-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
        >
          Próximo turno
        </button>
      </div>
      <div className="col-span-3 row-span-2">
        <div className="h-full w-full bg-gray-800 rounded-lg p-4 flex flex-col justify-center gap-4 text-center">
          <span className="text-5xl font-bold truncate">
            {currentPlayerRef.current?.name}
          </span>
          <span className="italic">Jogador atual</span>
        </div>
      </div>
      <div className="col-span-3 row-span-4">
        <div className="h-full w-full bg-gray-800 rounded-lg p-4 gap-4 flex flex-col">
          <span className="text-lg font-bold text-center">Ranking posição</span>
          <div className="flex flex-col gap-4 w-full overflow-scroll">
            {players
              .sort(
                (player1, player2) =>
                  (player1.position - player2.position) * -1,
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
      </div>
      <div className="col-span-3 row-span-4">
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
      </div>
      <div className="col-span-8 row-span-1">
        <div className="h-full w-full bg-gray-800 rounded-lg p-4 items-center text-center">
          <span className="truncate block">
            {currentQuestionRef.current?.question}
          </span>
        </div>
      </div>
      <div className="col-span-2 row-span-2">
        <div className="h-full w-full bg-red-900 rounded-lg p-4 flex justify-center items-center">
          <span className="text-xl truncate block">
            {currentQuestionRef.current?.options[0]}
          </span>
        </div>
      </div>
      <div className="col-span-2 row-span-2">
        <div className="h-full w-full bg-green-900 rounded-lg p-4 flex justify-center items-center">
          <span className="text-xl truncate block">
            {currentQuestionRef.current?.options[1]}
          </span>
        </div>
      </div>
      <div className="col-span-2 row-span-2">
        <div className="h-full w-full bg-yellow-900 rounded-lg p-4 flex justify-center items-center">
          <span className="text-xl truncate block">
            {currentQuestionRef.current?.options[2]}
          </span>
        </div>
      </div>
      <div className="col-span-2 row-span-2">
        <div className="h-full w-full bg-purple-900 rounded-lg p-4 flex justify-center items-center">
          <span className="text-xl truncate block">
            {currentQuestionRef.current?.options[3]}
          </span>
        </div>
      </div>
    </div>
  )
}
