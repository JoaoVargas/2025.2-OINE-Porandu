import { useMemo } from 'react'
import ResultScreen from '@/components/screens/ResultScreen'
import HomeScreen from '@/components/screens/HomeScreen'
import HostScreen from '@/components/screens/HostScreen'
import PreGameScreen from '@/components/screens/PreGameScreen'
import PlayerScreen from '@/components/screens/PlayerScreen'
import { useGameLogic } from '@/contexts/useGameLogic'

export default function App() {
  const { view } = useGameLogic()

  const renderView = useMemo(() => {
    switch (view) {
      case 'home':
        return <HomeScreen />
      case 'pre-game':
        return <PreGameScreen />
      case 'host':
        return <HostScreen />
      case 'player':
        return <PlayerScreen />
      case 'result':
        return <ResultScreen />
      default:
        return <HomeScreen />
    }
  }, [view])

  return (
    <div className="bg-gray-900 text-white h-screen w-screen font-sans">
      {renderView}
    </div>
  )
}
