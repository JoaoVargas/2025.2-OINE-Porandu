import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useGameLogic } from '@/contexts/useGameLogic'

export default function HomeScreen() {
  const {
    nameInputRef,
    roomInputRef,
    handleJoinGame,
    handleCreateGame,
    enableWakeLock,
  } = useGameLogic()

  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  return (
    <div className=" h-full flex flex-col md:flex-row items-center md:justify-center gap-8 p-8">
      <div className=" order-last md:order-first">
        {url && (
          <div className="p-4 bg-white rounded-lg">
            <QRCodeSVG
              className="h-[80vw] w-[80vw] md:h-[40vh] md:w-[40vh] max-w-[90vw]"
              value={url}
            />
          </div>
        )}
      </div>
      <div className=" flex flex-col items-center gap-8 w-full lg:max-w-2xl xl:max-w-4xl">
        <h1 className="text-6xl font-extrabold text-purple-400">Porandu</h1>

        <div className="p-8 bg-gray-800 rounded-lg shadow-xl gap-6 flex flex-col w-full items-center">
          <h2 className="text-3xl font-bold">Entrar em uma Sala</h2>
          <input
            ref={nameInputRef}
            type="text"
            placeholder="Seu Nome"
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            ref={roomInputRef}
            type="text"
            placeholder="ID da Sala"
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleJoinGame}
            className="cursor-pointer w-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
          >
            Entrar
          </button>
        </div>

        <h2 className="text-3xl font-bold">Ou</h2>
        <button
          onClick={handleCreateGame}
          className="cursor-pointer w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
        >
          Criar Nova Sala
        </button>
      </div>
    </div>
  )
}
