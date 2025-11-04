import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

export const HomeScreen = ({
  onCreateGame,
  onJoinGame,
  nameRef,
  roomRef,
}: {
  onCreateGame: () => void
  onJoinGame: () => void
  nameRef: React.RefObject<HTMLInputElement | null>
  roomRef: React.RefObject<HTMLInputElement | null>
}) => {
  const [url, setUrl] = useState('')
  
  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-center md:space-x-12 space-y-8 md:space-y-0">
      <div className="order-last md:order-first pt-8">
        {url && (
          <div className="p-4 bg-white inline-block rounded-lg">
            <QRCodeSVG value={url} size={256} />
          </div>
        )}
      </div>
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-extrabold text-purple-400">Porandu MVP</h1>
        <div className="space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold">Entrar em uma Sala</h2>
          <input
            ref={nameRef}
            type="text"
            placeholder="Seu Nome"
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            ref={roomRef}
            type="text"
            placeholder="ID da Sala"
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={onJoinGame}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
          >
            Entrar
          </button>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ou</h2>
          <button
            onClick={onCreateGame}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-xl font-bold transition-transform transform hover:scale-105"
          >
            Criar Nova Sala
          </button>
        </div>
      </div>
    </div>
  )
}
