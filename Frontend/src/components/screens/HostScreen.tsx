import { GameBoard } from '../Board/Board'
import { ReactionRain } from '../EmojiRainfall/EmojiRainfall'
import { useGameLogic } from '@/contexts/useGameLogic'

export default function HostScreen() {
  const {
    currentQuestionRef,
    currentPlayerRef,
    players,
    handleNextRound,
    anwserResponse,
    isWaitingAnwser,
  } = useGameLogic()

  return (
    <>
      <ReactionRain
        type={anwserResponse?.result ? 'like' : 'dislike'}
        isVisible={!!anwserResponse}
      />
      <div className="grid grid-cols-11 grid-rows-11 gap-8 h-full p-8">
        <div className="col-span-8 row-span-8">
          <div className="h-full w-full bg-gray-800 rounded-lg p-4">
            <GameBoard numberOfPositions={13} players={players} />
          </div>
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
            <span className="text-xl font-bold text-center">
              Ranking posição
            </span>
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
            <span className="text-xl font-bold text-center">
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
            <span className="truncate block text-xl">
              {currentQuestionRef.current?.question}
            </span>
          </div>
        </div>
        <div
          className={`col-span-2 row-span-2 ${
            anwserResponse?.optionCorrect === 0
              ? 'bg-green-600 scale-105'
              : anwserResponse?.result === false &&
                  anwserResponse.optionSelected === 0
                ? 'bg-red-600 scale-105'
                : isWaitingAnwser
                  ? 'bg-orange-600'
                  : 'bg-orange-600/40 text-white/60'
          } rounded-lg p-4 flex justify-center items-center`}
        >
          <span className="text-2xl truncate block">
            {currentQuestionRef.current?.options[0]}
          </span>
        </div>
        <div
          className={`col-span-2 row-span-2 ${
            anwserResponse?.optionCorrect === 1
              ? 'bg-green-600 scale-105'
              : anwserResponse?.result === false &&
                  anwserResponse.optionSelected === 1
                ? 'bg-red-600 scale-105'
                : isWaitingAnwser
                  ? 'bg-blue-600'
                  : 'bg-blue-600/40 text-white/60'
          } rounded-lg p-4 flex justify-center items-center`}
        >
          <span className="text-2xl truncate block">
            {currentQuestionRef.current?.options[1]}
          </span>
        </div>
        <div
          className={`col-span-2 row-span-2 ${
            anwserResponse?.optionCorrect === 2
              ? 'bg-green-600 scale-105'
              : anwserResponse?.result === false &&
                  anwserResponse.optionSelected === 2
                ? 'bg-red-600 scale-105'
                : isWaitingAnwser
                  ? 'bg-yellow-600'
                  : 'bg-yellow-600/40 text-white/60'
          } rounded-lg p-4 flex justify-center items-center`}
        >
          <span className="text-2xl truncate block">
            {currentQuestionRef.current?.options[2]}
          </span>
        </div>
        <div
          className={`col-span-2 row-span-2 ${
            anwserResponse?.optionCorrect === 3
              ? 'bg-green-600 scale-105'
              : anwserResponse?.result === false &&
                  anwserResponse.optionSelected === 3
                ? 'bg-red-600 scale-105'
                : isWaitingAnwser
                  ? 'bg-purple-600'
                  : 'bg-purple-600/40 text-white/60'
          } rounded-lg p-4 flex justify-center items-center`}
        >
          <span className="text-2xl truncate block">
            {currentQuestionRef.current?.options[3]}
          </span>
        </div>
      </div>
    </>
  )
}
