import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
const SOCKET_URL = 'http://192.168.1.5:4000';


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState('home'); 
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [playerInfo, setPlayerInfo] = useState({ name: '', score: 0 });
  const [lastAnswerResult, setLastAnswerResult] = useState(null);

  // Refs for input fields
  const nameInputRef = useRef(null);
  const roomInputRef = useRef(null);
  useEffect(() => {
    const newSocket = io(SOCKET_URL, { autoConnect: false });
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Socket conectado!', newSocket.id));
    newSocket.on('game-created', (newRoomId) => {
      setRoomId(newRoomId);
      setView('host');
    });
    newSocket.on('player-joined', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });
    newSocket.on('join-success', () => {
      setView('lobby');
    });
    newSocket.on('new-question', (q) => {
      setQuestion(q);
      setLastAnswerResult(null); 
      setView(view => (view === 'host' ? 'host' : 'player-question'));
    });
    newSocket.on('answer-result', ({ isCorrect, score }) => {
        setLastAnswerResult(isCorrect);
        setPlayerInfo(p => ({ ...p, score }));
    });
    newSocket.on('game-state-update', (game) => {
        setPlayers(game.players);
    });
    newSocket.on('game-over', (finalScores) => {
      setGameResult(finalScores);
      setView('game-over');
    });
    newSocket.on('error', (message) => {
      alert(`Erro: ${message}`);
    });

    newSocket.connect(); // Manually connect after setting up listeners

    // Cleanup on component unmount
    return () => {
      console.log('Desconectando o socket...');
      newSocket.disconnect();
    };
  }, []); // The empty dependency array ensures this effect runs only once.


  // --- Event Handlers ---
  const handleCreateGame = () => socket.emit('create-game');
  const handleJoinGame = () => {
    const playerName = nameInputRef.current.value;
    const gameRoomId = roomInputRef.current.value;
    if (playerName && gameRoomId) {
      setPlayerInfo({ name: playerName, score: 0 });
      setRoomId(gameRoomId);
      socket.emit('join-game', { roomId: gameRoomId, playerName });
    }
  };
  const handleStartGame = () => socket.emit('start-game', roomId);
  const handleNextQuestion = () => {
      setQuestion(null);
      socket.emit('next-question', roomId);
  };
  const handleAnswerSubmit = (answer) => {
    socket.emit('submit-answer', { roomId, answer });
    setView('lobby'); // Volta para o lobby de espera após responder
  };
  const handleGoHome = () => window.location.reload();


  // --- Render Logic ---
  const renderView = () => {
    switch (view) {
      case 'host':
        return <HostView roomId={roomId} players={players} onStartGame={handleStartGame} question={question} onNextQuestion={handleNextQuestion}/>;
      case 'player-question':
        return <PlayerQuestionView question={question} onAnswerSubmit={handleAnswerSubmit} playerInfo={playerInfo}/>;
      case 'lobby':
        return <LobbyView roomId={roomId} playerInfo={playerInfo} lastAnswerResult={lastAnswerResult} />;
      case 'game-over':
        return <GameOverView results={gameResult} onGoHome={handleGoHome} />;
      default:
        return <HomeView onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} nameRef={nameInputRef} roomRef={roomInputRef} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
}

const HomeView = ({ onCreateGame, onJoinGame, nameRef, roomRef }) => (
  <div className="text-center space-y-8">
    <h1 className="text-6xl font-extrabold text-purple-400">Porandu MVP</h1>
    <div className="space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold">Entrar em uma Sala</h2>
      <input ref={nameRef} type="text" placeholder="Seu Nome" className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <input ref={roomRef} type="text" placeholder="ID da Sala" className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <button onClick={onJoinGame} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105">Entrar</button>
    </div>
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Ou</h2>
      <button onClick={onCreateGame} className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105">Criar Nova Sala</button>
    </div>
  </div>
);

const HostView = ({ roomId, players, onStartGame, question, onNextQuestion }) => (
  <div className="text-center space-y-6">
    <h1 className="text-5xl font-bold">Painel do Anfitrião</h1>
    <p className="text-2xl">ID da Sala: <span className="font-mono bg-gray-700 text-yellow-300 px-4 py-2 rounded-lg">{roomId}</span></p>

    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-4">{players.length > 0 ? "Jogadores na Sala" : "Aguardando jogadores..."}</h2>
      <ul className="space-y-2">
        {players.map(p => <li key={p.id} className="text-xl bg-gray-700 p-3 rounded-md flex justify-between"><span>{p.name}</span> <span>{p.score}pts</span></li>)}
      </ul>
    </div>

    {!question && players.length > 0 && <button onClick={onStartGame} className="w-full py-4 text-2xl font-bold bg-blue-600 hover:bg-blue-700 rounded-md transition-transform transform hover:scale-105">Start Game</button>}

    {question && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-4xl font-bold mb-4">{question.question}</h2>
            <div className="grid grid-cols-2 gap-4">
                {question.options.map(opt => <div key={opt} className="bg-gray-700 p-4 rounded-md text-2xl">{opt}</div>)}
            </div>
             <button onClick={onNextQuestion} className="mt-6 w-full py-3 text-xl font-bold bg-green-600 hover:bg-green-700 rounded-md transition-transform transform hover:scale-105">Próxima Pergunta</button>
        </div>
    )}
  </div>
);

const PlayerQuestionView = ({ question, onAnswerSubmit, playerInfo }) => {
  if (!question) return <div className="text-3xl">Aguardando a próxima pergunta...</div>;

  const colors = ["bg-red-600", "bg-blue-600", "bg-yellow-600", "bg-green-600"];
  const hoverColors = ["hover:bg-red-700", "hover:bg-blue-700", "hover:bg-yellow-700", "hover:bg-green-700"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xl p-4 bg-gray-800 rounded-lg">
        <span>{playerInfo.name}</span>
        <span className="font-bold">{playerInfo.score} pts</span>
      </div>
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <h2 className="text-4xl font-bold mb-6">{question.question}</h2>
        <p className="text-lg mb-6">Pergunta {question.questionNumber} de {question.totalQuestions}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button key={index} onClick={() => onAnswerSubmit(option)} className={`p-6 text-2xl font-bold rounded-lg transition-transform transform hover:scale-105 ${colors[index]} ${hoverColors[index]}`}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LobbyView = ({ roomId, playerInfo, lastAnswerResult }) => (
    <div className="text-center space-y-6 flex flex-col items-center justify-center h-full">
        {lastAnswerResult !== null && (
            lastAnswerResult
            ? <div className="text-5xl font-extrabold text-green-400 p-8 rounded-lg bg-green-900 bg-opacity-50">Correto!</div>
            : <div className="text-5xl font-extrabold text-red-400 p-8 rounded-lg bg-red-900 bg-opacity-50">Incorreto!</div>
        )}
        <h1 className="text-4xl font-bold">Bem-vindo(a), {playerInfo.name}!</h1>
        <p className="text-2xl">Você está na sala <span className="font-mono text-yellow-300">{roomId}</span></p>
        <p className="text-3xl mt-8 animate-pulse">Aguardando o anfitrião iniciar a próxima rodada...</p>
        <p className="text-2xl font-bold mt-4">Sua pontuação: {playerInfo.score}</p>
    </div>
);

const GameOverView = ({ results, onGoHome }) => (
    <div className="text-center space-y-6">
        <h1 className="text-6xl font-extrabold text-yellow-400">Fim de Jogo!</h1>
        <div className="p-8 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-4xl font-bold mb-6">Pontuações Finais</h2>
            <ul className="space-y-3">
                {results && results.map((player, index) => (
                    <li key={player.id} className={`text-2xl p-4 rounded-md flex justify-between items-center ${index === 0 ? 'bg-yellow-600' : 'bg-gray-700'}`}>
                        <span>{index + 1}. {player.name}</span>
                        <span className="font-bold">{player.score} pts</span>
                    </li>
                ))}
            </ul>
        </div>
        <button onClick={onGoHome} className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105">Jogar Novamente</button>
    </div>
);
