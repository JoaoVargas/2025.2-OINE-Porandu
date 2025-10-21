export const EndScreen = ({
  results,
  onGoHome,
}: {
  results: { id: string; name: string; score: number }[]
  onGoHome: () => void
}) => (
  <div className="text-center space-y-6">
    <h1 className="text-6xl font-extrabold text-yellow-400">Fim de Jogo!</h1>
    <div className="p-8 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-4xl font-bold mb-6">Pontuações Finais</h2>
      <ul className="space-y-3">
        {results &&
          results.map((player, index) => (
            <li
              key={player.id}
              className={`text-2xl p-4 rounded-md flex justify-between items-center ${index === 0 ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              <span>
                {index + 1}. {player.name}
              </span>
              <span className="font-bold">{player.score} pts</span>
            </li>
          ))}
      </ul>
    </div>
    <button
      onClick={onGoHome}
      className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
    >
      Jogar Novamente
    </button>
  </div>
)
