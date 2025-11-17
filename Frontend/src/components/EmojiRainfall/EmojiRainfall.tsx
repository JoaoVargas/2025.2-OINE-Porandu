import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

interface ReactionRainProps {
  type: 'like' | 'dislike'
  isVisible: boolean
  duration?: number
}

interface Raindrop {
  id: number
  left: number
  delay: number
  duration: number
  emoji: string
}

const POSITIVE_EMOJIS = ['👍', '✅', '😄', '🎉', '⭐', '❤️', '🌟', '😍']
const NEGATIVE_EMOJIS = ['👎', '❌', '😢', '😭', '💔', '😞', '🤮', '😤']

export const ReactionRain = ({
  type,
  isVisible,
  duration = 3000,
}: ReactionRainProps): ReactElement | null => {
  const [raindrops, setRaindrops] = useState<Array<Raindrop>>([])

  useEffect(() => {
    if (isVisible) {
      generateRain()
      const timer = setTimeout(() => {
        setRaindrops([])
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  const generateRain = () => {
    const emojiList = type === 'like' ? POSITIVE_EMOJIS : NEGATIVE_EMOJIS
    const newDrops = Array.from({ length: 20 }, (_, i) => {
      const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)]
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2 + Math.random() * 1,
        emoji: randomEmoji,
      }
    })
    setRaindrops(newDrops)
  }

  if (!isVisible || raindrops.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <style>{`
        @keyframes rainfall {
          0% {
            opacity: 1;
            transform: translateY(-100px) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) scale(0.3);
          }
        }
        .raindrop {
          animation: rainfall linear forwards;
          position: fixed;
          font-size: 4rem;
          filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
        }
      `}</style>

      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={
            {
              left: `${drop.left}%`,
              top: '-100px',
              animationDuration: `${drop.duration}s`,
              animationDelay: `${drop.delay}s`,
            } as React.CSSProperties
          }
        >
          {drop.emoji}
        </div>
      ))}
    </div>
  )
}
