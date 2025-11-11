import { Socket } from "socket.io";

export interface Player {
  id: string;
  name: string;
  position: number;
  correct_answers: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

export interface QuestionSend {
  question: Question["question"];
  options: Question["options"];
}

export interface Game {
  hostId: Socket["id"];
  players: Player[];
  questions: Question[];
  currentRound: number;
  currentPlayer: Player | null;
  currentQuestion: Question | null;
  totalPositions: number;
}

export interface GameStateSend {
  players: Player[];
  currentQuestion: QuestionSend | null;
  currentPlayer: Player | null;
  currentRound: number;
  hasPlayerAnswered: boolean;
}
