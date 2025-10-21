import { Socket } from "socket.io";

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Question {
  question: string;
  options: string[];
  answer: number;
}

export interface QuestionSend {
  question: string;
  options: string[];
  questionNumber: number;
  totalQuestions: number;
}

export interface Game {
  hostId: Socket["id"];
  currentQuestionIndex: number;
  playerPositionIndex: { [key: Player["id"]]: number };
  players: Player[];
  questions: Question[];
}
