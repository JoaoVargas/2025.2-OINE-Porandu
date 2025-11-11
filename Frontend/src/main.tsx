import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import App from './routes'
import { GameLogicProvider } from './contexts/useGameLogic'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <GameLogicProvider>
        <App />
      </GameLogicProvider>
    </StrictMode>,
  )
}
