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

export interface Game {
  hostId: Socket["id"];
  currentQuestionIndex: number;
  playerPositionIndex: { [key: Player["id"]]: number };
  players: Player[];
  questions: Question[];
}
