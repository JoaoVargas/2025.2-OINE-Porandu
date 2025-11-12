import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import App from './routes'
import { GameLogicProvider } from './contexts/useGameLogic'
import WakeLock from './components/WakeLock/WakeLock'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <GameLogicProvider>
        <WakeLock />
        <App />
      </GameLogicProvider>
    </StrictMode>,
  )
}
