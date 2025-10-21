import http from "http";
import { Server } from "socket.io";
import { questions } from "../utils/Questions";
import { Game } from "../types/Types";

export const initializeWebSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const games: { [key: string]: Game } = {};

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("create-game", () => {
      const roomId = Math.floor(1000 + Math.random() * 9000).toString();
      socket.join(roomId);
      games[roomId] = {
        hostId: socket.id,
        players: [],
        playerPositionIndex: {},
        currentQuestionIndex: -1,
        questions: questions,
      };
      socket.emit("game-created", roomId);
      console.log(`Game created with ID: ${roomId} by host ${socket.id}`);
    });

    socket.on("start-game", (roomId: string) => {
      if (games[roomId] && games[roomId].hostId === socket.id) {
        console.log(`Starting game ${roomId}`);
        askQuestion(roomId);
      }
    });

    socket.on("next-question", (roomId: string) => {
      if (games[roomId] && games[roomId].hostId === socket.id) {
        askQuestion(roomId);
      }
    });

    socket.on(
      "join-game",
      ({ roomId, playerName }: { roomId: string; playerName: string }) => {
        if (games[roomId]) {
          socket.join(roomId);
          const newPlayer = { id: socket.id, name: playerName, score: 0 };
          games[roomId].players.push(newPlayer);

          io.to(roomId).emit("player-joined", games[roomId].players);
          socket.emit("join-success");
          console.log(`Player ${playerName} joined room ${roomId}`);
        } else {
          socket.emit("error", "Game not found");
        }
      }
    );

    socket.on(
      "submit-answer",
      ({ roomId, answer }: { roomId: string; answer: number }) => {
        const game = games[roomId];
        if (!game) return;

        const player = game.players.find((p) => p.id === socket.id);
        const question = game.questions[game.currentQuestionIndex];

        if (player && question) {
          const isCorrect = question.answer === answer;
          if (isCorrect) {
            player.score += 10;
          }
          socket.emit("answer-result", { isCorrect, score: player.score });
          io.to(game.hostId).emit("player-answered", {
            playerName: player.name,
            isCorrect,
          });
          io.to(roomId).emit("game-state-update", game);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  function askQuestion(roomId: string) {
    const game = games[roomId];
    if (!game) return;

    game.currentQuestionIndex++;
    if (game.currentQuestionIndex >= game.questions.length) {
      io.to(roomId).emit(
        "game-over",
        game.players.sort((a, b) => b.score - a.score)
      );
      console.log(`Game ${roomId} is over.`);
      delete games[roomId];
      return;
    }

    const question = game.questions[game.currentQuestionIndex];
    io.to(roomId).emit("new-question", {
      question: question.question,
      options: question.options,
      questionNumber: game.currentQuestionIndex + 1,
      totalQuestions: game.questions.length,
    });
    console.log(
      `Asking question ${game.currentQuestionIndex + 1} in room ${roomId}`
    );
  }
};
