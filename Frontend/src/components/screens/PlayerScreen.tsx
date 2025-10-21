import type { Question } from "@/types/Types";

export const PlayerScreen = ({
  question,
  onAnswerSubmit,
  playerInfo,
}: {
  question: Question
  onAnswerSubmit: (answer: number) => void
  playerInfo: { name: string; score: number }
}) => {
  if (!question)
    return <div className="text-3xl">Aguardando a próxima pergunta...</div>

  const colors = ['bg-red-600', 'bg-blue-600', 'bg-yellow-600', 'bg-green-600']
  const hoverColors = [
    'hover:bg-red-700',
    'hover:bg-blue-700',
    'hover:bg-yellow-700',
    'hover:bg-green-700',
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xl p-4 bg-gray-800 rounded-lg">
        <span>{playerInfo.name}</span>
        <span className="font-bold">{playerInfo.score} pts</span>
      </div>
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <h2 className="text-4xl font-bold mb-6">{question.question}</h2>
        <p className="text-lg mb-6">
          Pergunta {question.questionNumber} de {question.totalQuestions}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSubmit(index)}
              className={`p-6 text-2xl font-bold rounded-lg transition-transform transform hover:scale-105 ${colors[index]} ${hoverColors[index]}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
