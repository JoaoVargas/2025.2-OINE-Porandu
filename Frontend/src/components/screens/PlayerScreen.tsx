import { useGameLogic } from '@/contexts/useGameLogic'

export default function PlayerScreen() {
  const {
    isCurrentPlayerRoundRef,
    currentQuestionRef,
    handleSubmitAnswer,
    isWaitingAnwser,
    anwserResponse,
  } = useGameLogic()

  if (!isCurrentPlayerRoundRef.current) {
    return (
      <div className="w-full h-full p-8 flex justify-center items-center">
        <div className="p-8 bg-gray-800 rounded-lg shadow-xl gap-6 flex flex-col items-center">
          <span className="text-xl font-bold">Aguarde...</span>
          <span>Outro jogador está respondendo agora</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-11 grid-rows-11 gap-8 h-full p-8">
      <div className="col-span-11 row-span-3">
        <div className="h-full w-full bg-gray-800 rounded-lg p-4 flex items-center justify-center">
          <span className="text-center">
            {currentQuestionRef.current?.question}
          </span>
        </div>
      </div>
      <div className="col-span-11 row-span-2">
        <button
          disabled={!isWaitingAnwser}
          onClick={() => handleSubmitAnswer(0)}
          className={`
            w-full h-full py-3 rounded-md text-xl font-bold 
            ${
              isWaitingAnwser
                ? 'cursor-pointer bg-orange-600 hover:bg-orange-700 transition-transform transform hover:scale-105 active:scale-105'
                : anwserResponse?.optionCorrect === 0
                  ? 'bg-green-600 scale-105'
                  : anwserResponse?.result === false &&
                      anwserResponse.optionSelected === 0
                    ? 'bg-red-600 scale-105'
                    : 'bg-orange-600/40 text-white/60'
            }`}
        >
          {currentQuestionRef.current?.options[0]}
        </button>
      </div>
      <div className="col-span-11 row-span-2">
        <button
          disabled={!isWaitingAnwser}
          onClick={() => handleSubmitAnswer(1)}
          className={`
            w-full h-full py-3 rounded-md text-xl font-bold 
            ${
              isWaitingAnwser
                ? 'cursor-pointer bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-105'
                : anwserResponse?.optionCorrect === 1
                  ? 'bg-green-600 scale-105'
                  : anwserResponse?.result === false &&
                      anwserResponse.optionSelected === 1
                    ? 'bg-red-600 scale-105'
                    : 'bg-blue-600/40 text-white/60'
            }`}
        >
          {currentQuestionRef.current?.options[1]}
        </button>
      </div>
      <div className="col-span-11 row-span-2">
        <button
          disabled={!isWaitingAnwser}
          onClick={() => handleSubmitAnswer(2)}
          className={`
            w-full h-full py-3 rounded-md text-xl font-bold 
            ${
              isWaitingAnwser
                ? 'cursor-pointer bg-yellow-600 hover:bg-yellow-700 transition-transform transform hover:scale-105 active:scale-105'
                : anwserResponse?.optionCorrect === 2
                  ? 'bg-green-600 scale-105'
                  : anwserResponse?.result === false &&
                      anwserResponse.optionSelected === 2
                    ? 'bg-red-600 scale-105'
                    : 'bg-yellow-600/40 text-white/60'
            }`}
        >
          {currentQuestionRef.current?.options[2]}
        </button>
      </div>
      <div className="col-span-11 row-span-2">
        <button
          disabled={!isWaitingAnwser}
          onClick={() => handleSubmitAnswer(3)}
          className={`
            w-full h-full py-3 rounded-md text-xl font-bold 
            ${
              isWaitingAnwser
                ? 'cursor-pointer bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 active:scale-105'
                : anwserResponse?.optionCorrect === 3
                  ? 'bg-green-600 scale-105'
                  : anwserResponse?.result === false &&
                      anwserResponse.optionSelected === 3
                    ? 'bg-red-600 scale-105'
                    : 'bg-purple-600/40 text-white/60'
            }`}
        >
          {currentQuestionRef.current?.options[3]}
        </button>
      </div>
    </div>
  )
}
