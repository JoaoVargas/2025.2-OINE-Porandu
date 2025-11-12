export interface Player {
  id: string
  name: string
  position: number
  correct_answers: number
}

export interface Question {
  question: string
  options: Array<string>
}

export interface Game {
  players: Array<Player>
  currentQuestion: Question | null
  currentPlayer: Player | null
  currentRound: number
  hasPlayerAnswered: boolean
}

export type ScreenView = 'home' | 'pre-game' | 'host' | 'player' | 'result'

export interface AnswerResponse {
  result: boolean
  optionCorrect: number
  optionSelected: number
}