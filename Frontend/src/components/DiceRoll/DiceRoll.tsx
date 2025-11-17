import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

interface DiceRollProps {
  advance: number
  isVisible: boolean
}

interface Star {
  id: number
  angle: number
  delay: number
}

export const DiceRoll = ({
  advance,
  isVisible,
}: DiceRollProps): ReactElement | null => {
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [stars, setStars] = useState<Array<Star>>([])

  useEffect(() => {
    if (isVisible) {
      setIsRolling(true)
      const timer = setTimeout(() => {
        setIsRolling(false)
        generateStars()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const generateStars = () => {
    const newStars = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      angle: (360 / 16) * i + Math.random() * 10,
      delay: Math.random() * 0.3,
    }))
    setStars(newStars)
    setTimeout(() => setStars([]), 2500)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-10">
      <style>{`
        @keyframes rollDice {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
          }
          50% {
            transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1.1);
          }
          100% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
          }
        }
        .dice-rolling {
          animation: rollDice 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dice-result {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes starBurst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          15% {
            opacity: 1;
            transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--tx) * 1.5), calc(var(--ty) * 1.5 + 200px)) scale(0.2) rotate(360deg);
          }
        }
        .star-particle {
          animation: starBurst 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          pointer-events: none;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
        }
      `}</style>

      <div
        className={`w-40 h-40 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-8xl text-white shadow-lg ${
          isRolling ? 'dice-rolling' : ''
        }`}
      >
        {advance}
      </div>

      {!isRolling && (
        <p className="text-4xl font-bold text-blue-600 dice-result">
          Ande {advance} casas!
        </p>
      )}

      {stars.map((star) => {
        const radians = (star.angle * Math.PI) / 180
        const distance = 120
        const tx = Math.cos(radians) * distance
        const ty = Math.sin(radians) * distance

        return (
          <div
            key={star.id}
            className="star-particle fixed text-4xl"
            style={
              {
                left: '50%',
                top: '50%',
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
                animationDelay: `${star.delay}s`,
              } as React.CSSProperties
            }
          >
            ⭐
          </div>
        )
      })}
    </div>
  )
}
