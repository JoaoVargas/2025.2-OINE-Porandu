import http from "http";
import { Server, Socket } from "socket.io";
import { questions } from "../utils/Questions";
import { Game, GameStateSend, Player, QuestionSend } from "../types/Types";

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
        questions: questions,
        currentRound: 0,
        currentPlayer: null,
        currentQuestion: null,
        totalPositions: 10,
      };

      socket.emit("game-created", roomId);

      console.log(`Game created with ID: ${roomId} by host ${socket.id}`);
    });

    socket.on(
      "join-game",
      ({ roomId, playerName }: { roomId: string; playerName: string }) => {
        if (games[roomId]) {
          if (games[roomId].currentRound > 0) {
            socket.emit("error", "Game has already started");
            return;
          }

          socket.join(roomId);

          const newPlayer: Player = {
            id: socket.id,
            name: playerName,
            position: 0,
            correct_answers: 0,
          };

          games[roomId].players.push(newPlayer);

          io.to(roomId).emit("player-joined", {
            players: games[roomId].players,
            currentQuestion: null,
            currentPlayer: null,
            currentRound: games[roomId].currentRound,
            hasPlayerAnswered: false,
          } as GameStateSend);

          socket.emit("join-success", roomId);

          console.log(`Player ${playerName} joined room ${roomId}`);
        } else {
          socket.emit("error", "Game not found");
        }
      }
    );

    socket.on("start-game", (roomId: string) => {
      if (games[roomId] && games[roomId].hostId === socket.id) {
        console.log(`Starting game ${roomId}`);
        handleNextRound(roomId);
      }
    });

    socket.on("next-round", (roomId: string) => {
      if (games[roomId] && games[roomId].hostId === socket.id) {
        handleNextRound(roomId);
      }
    });

    socket.on(
      "submit-answer",
      ({ roomId, answer }: { roomId: string; answer: number }) => {
        if (games[roomId] && games[roomId].currentPlayer?.id === socket.id) {
          handleSubmitAnswer(roomId, answer, socket);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  function handleNextRound(roomId: string) {
    console.log(`Handling next round for room ${roomId}`);

    if (!games[roomId]) return;

    games[roomId].currentRound += 1;
    const roundPlayerPosition = fetchRoundPlayerPosition(roomId);
    if (roundPlayerPosition !== null && roundPlayerPosition !== undefined) {
      console.log(
        `Setting current player for room ${roomId} - position: ${roundPlayerPosition}`
      );
      games[roomId].currentPlayer = games[roomId].players[roundPlayerPosition];
    } else {
      console.log(`No current player for room ${roomId}`);
      games[roomId].currentPlayer = null;
    }
    const roundQuestionPosition = fetchRoundQuestionPosition(roomId);
    if (roundQuestionPosition !== null && roundQuestionPosition !== undefined) {
      games[roomId].currentQuestion =
        games[roomId].questions[roundQuestionPosition];
    } else {
      games[roomId].currentQuestion = null;
    }

    const gameState: GameStateSend = {
      players: games[roomId].players,
      currentQuestion: {
        question: games[roomId].currentQuestion?.question,
        options: games[roomId].currentQuestion?.options,
      } as QuestionSend,
      currentPlayer: games[roomId].currentPlayer,
      currentRound: games[roomId].currentRound,
      hasPlayerAnswered: false,
    };

    io.to(roomId).emit("round-updated", gameState);

    console.log(`Next round in room ${roomId}`, gameState);
  }

  function fetchRoundPlayerPosition(roomId: string) {
    const game = games[roomId];
    if (!game) return null;

    const gameRound = game.currentRound;
    const playersCount = game.players.length;
    const playerPosition = gameRound % playersCount;

    console.log(
      `Fetching player position for room ${roomId} - position: ${playerPosition}`
    );
    return playerPosition;
  }

  function fetchRoundQuestionPosition(roomId: string) {
    const game = games[roomId];
    if (!game) return null;

    const gameRound = game.currentRound;
    const questionsCount = game.questions.length;
    const questionPosition = gameRound % questionsCount;

    return questionPosition;
  }

  function handleSubmitAnswer(roomId: string, answer: number, socket: Socket) {
    const isCorrect = games[roomId].currentQuestion?.answer === answer;

    if (isCorrect) {
      handleCorrectAnswer(roomId, socket);
    } else {
      handleWrongAnswer(roomId, socket);
    }

    const gameState: GameStateSend = {
      players: games[roomId].players,
      currentQuestion: {
        question: games[roomId].currentQuestion?.question,
        options: games[roomId].currentQuestion?.options,
      } as QuestionSend,
      currentPlayer: games[roomId].currentPlayer,
      currentRound: games[roomId].currentRound,
      hasPlayerAnswered: true,
    };

    io.to(roomId).emit("round-updated", gameState);
  }

  function handleCorrectAnswer(roomId: string, socket: Socket) {
    if (!games[roomId] || !games[roomId].currentPlayer) return;

    const postionsToAdvance = rollD6();

    games[roomId].currentPlayer.position += postionsToAdvance;
    games[roomId].currentPlayer.correct_answers += 1;

    //
    // END GAME LOGIC
    //

    socket.emit("answer-result", { result: true, advance: postionsToAdvance });

    io.to(games[roomId].hostId).emit("player-answered", {
      result: true,
      advance: postionsToAdvance,
    });
  }

  function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function handleWrongAnswer(roomId: string, socket: Socket) {
    if (!games[roomId] || !games[roomId].currentPlayer) return;

    const postionsToAdvance = 1;

    games[roomId].currentPlayer.position += postionsToAdvance;

    //
    // END GAME LOGIC
    //

    socket.emit("answer-result", { result: false, advance: postionsToAdvance });

    io.to(games[roomId].hostId).emit("player-answered", {
      result: false,
      advance: postionsToAdvance,
    });
  }
};
