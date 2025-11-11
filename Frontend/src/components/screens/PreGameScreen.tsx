import { useGameLogic } from '@/contexts/useGameLogic'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

export default function PreGameScreen() {
  const { handleStartGame, players, isHostRef, roomIdRef } = useGameLogic()

  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  return (
    <div className="flex flex-col items-center md:justify-center h-full p-8">
      <div className=" flex flex-col gap-8 w-full lg:max-w-4xl xl:max-w-7xl">
        <h2 className="text-3xl font-bold text-center">
          Aguardando jogadores entrarem na sala
        </h2>
        <div className="p-8 bg-gray-800 rounded-lg shadow-xl gap-6 flex flex-col md:flex-row w-full items-center">
          <div className="max-h-[65vh] w-full overflow-scroll flex flex-col gap-4">
            {players.length > 0 ? (
              players?.map((player) => (
                <div key={player.id} className=" bg-gray-700 rounded-lg p-4">
                  <span className="text-xl truncate block w-full">
                    {player.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <h3 className="text-2xl font-bold text-center">
                  Nenhum jogador conectado ainda...
                </h3>
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="flex flex-row justify-center items-center mb-4 gap-1">
              <span className="text-xl">ID da sala: </span>
              <span className="text-xl font-bold bg-gray-600 rounded-lg px-2 py-1">
                {roomIdRef.current}
              </span>
            </div>
            {url && (
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG className="h-full w-full" value={url} />
              </div>
            )}
          </div>
        </div>
        {isHostRef.current && (
          <button
            onClick={handleStartGame}
            className="cursor-pointer w-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
          >
            Começar Jogo
          </button>
        )}
      </div>
    </div>
  )
}
