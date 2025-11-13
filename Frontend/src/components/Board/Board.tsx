import React, { useLayoutEffect, useRef, useState } from 'react'
import type { Player } from '@/types/Types'

interface Point {
  x: number
  y: number
}

interface ColorSet {
  fill: string
  stroke: string
}

interface GameBoardProps {
  numberOfPositions?: number
  players?: Array<Player>
}

const boardColors: Array<ColorSet> = [
  { fill: '#fde047', stroke: '#eab308' },
  { fill: '#22c55e', stroke: '#15803d' },
  { fill: '#3b0764', stroke: '#312e81' },
]

export const GameBoard: React.FC<GameBoardProps> = ({
  numberOfPositions = 12,
  players = [],
}) => {
  const pathRef = useRef<SVGPathElement>(null)
  const [points, setPoints] = useState<Array<Point>>([])

  const svgPathData =
    'M 64.771 48.83 C 137.461 48.83 206.074 46.895 279.524 46.895 C 328.143 46.895 374.456 44.961 422.693 44.961 C 470.05 44.961 526.783 49.606 567.796 70.112 C 621.234 96.83 601.967 183.187 552.318 199.737 C 487.668 221.288 412.09 218.75 347.239 240.366 C 288.065 260.091 221.909 241.12 165.376 269.387 C 115.306 294.422 65.453 373.289 95.727 433.837 C 128.836 500.056 214.032 496.941 269.851 478.335 C 316.809 462.683 364.712 438.956 407.215 410.621 C 428.342 396.536 432.543 355.745 459.452 346.775 C 526.71 324.356 577.285 332.865 610.359 399.012 C 632.92 444.133 577.962 502.994 550.383 530.573 C 510.603 570.353 435.191 561.083 387.868 584.744 C 342.879 607.239 284.418 624.387 235.026 640.851 C 203.623 651.319 152.351 724.302 202.136 749.195 C 257.934 777.094 358.947 753.039 413.019 739.521 C 510.912 715.048 642.203 723.157 716.769 648.59 C 778.708 586.649 796.457 481.48 834.786 404.816 C 841.957 390.472 835.394 366.232 840.59 350.645 C 864.642 278.491 859.514 203.816 937.325 164.913 C 952.904 157.124 982.839 181.405 991.497 190.064 C 1040.06 238.624 1038.09 296.951 1059.21 360.318 C 1099.77 481.994 1021.65 652.062 1161.75 722.109 C 1186.94 734.704 1235.49 725.978 1264.29 725.978 C 1292.31 725.978 1330.46 732.654 1357.16 725.978 C 1386.04 718.756 1416.56 717.415 1444.22 710.5 C 1464.22 705.5 1484.71 697.648 1504.2 691.153 C 1559.09 672.854 1542.14 573.729 1498.39 551.854 C 1452.7 529.007 1419.49 521.489 1370.7 509.291 C 1349.75 504.054 1317.98 492.123 1304.92 472.531 C 1219.71 344.704 1317.2 152.001 1434.55 93.328 C 1523.18 49.008 1676.47 68.681 1767.32 91.394 C 1805.69 100.986 1856.69 171.89 1835.03 215.215 C 1790.51 304.269 1681.85 256.726 1608.67 238.432 C 1545.84 222.723 1492.21 265.955 1508.06 329.363 C 1533.12 429.558 1656.38 464.574 1738.3 491.878 C 1761.71 499.684 1782.06 522.467 1802.14 532.507 C 1837.8 550.339 1877.59 611.564 1877.59 648.59'

  useLayoutEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current
      const totalLength = path.getTotalLength()
      const newPoints: Array<Point> = []

      if (numberOfPositions <= 1) {
        if (numberOfPositions === 1) {
          const point = path.getPointAtLength(0)
          newPoints.push({ x: point.x, y: point.y })
        }
        setPoints(newPoints)
        return
      }

      const segmentLength = totalLength / (numberOfPositions - 1)

      for (let i = 0; i < numberOfPositions; i++) {
        const distance = i * segmentLength
        const point = path.getPointAtLength(distance)
        newPoints.push({ x: point.x, y: point.y })
      }
      setPoints(newPoints)
    }
  }, [numberOfPositions, svgPathData])

  const startPoint: Point | undefined = points[0]

  const PlayerTags = ({ positionIndex }: { positionIndex: number }) => {
    const playersAtThisPosition = players.filter(
      (player) => player.position === positionIndex,
    )

    const point = points[positionIndex]
    if (!point) return null

    let yOffset = -40
    if (positionIndex === 0) {
      yOffset = -80
    }
    const yStackOffset = -25

    return (
      <g>
        {playersAtThisPosition.map((player, playerIndex) => (
          <g
            key={player.id}
            transform={`translate(${point.x}, ${
              point.y + yOffset + playerIndex * yStackOffset
            })`}
          >
            <rect
              x="-45"
              y="-15"
              width="90"
              height="20"
              rx="8"
              ry="8"
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#333"
              strokeWidth="1"
            />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#000"
              fontSize="14"
              fontWeight="bold"
            >
              {player.name}
            </text>
          </g>
        ))}
      </g>
    )
  }

  return (
    <div
      className="relative w-full p-4 bg-green-800 rounded-lg overflow-hidden"
      style={{ height: '100%' }}
    >
      <h2
        className="absolute top-4 left-1/2 -translate-x-1/2 text-7xl font-bold text-white tracking-widest"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
      >
        PORANDU
      </h2>

      <svg
        className="w-full h-full"
        viewBox="0 0 2000 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          ref={pathRef}
          d={svgPathData}
          fill="none"
          stroke="#8B4513"
          strokeWidth="45"
          strokeLinecap="round"
        />

        {startPoint && (
          <g
            transform={`translate(${startPoint.x - 70}, ${startPoint.y - 75})`}
          >
            <rect
              x="0"
              y="25"
              width="70"
              height="50"
              fill="#a52a2a"
              stroke="#000"
              strokeWidth="2"
            />
            <polygon
              points="0,25 70,25 35,0"
              fill="#d2691e"
              stroke="#000"
              strokeWidth="2"
            />
            <rect x="25" y="45" width="20" height="30" fill="#f0e68c" />
          </g>
        )}

        {points.map((point, index) => {
          if (index === 0) return null

          if (index === numberOfPositions - 1) {
            return (
              <rect
                key={`pos-marker-${index}`}
                x={point.x - 30}
                y={point.y - 30}
                width="60"
                height="60"
                fill="#facc15"
                stroke="#eab308"
                strokeWidth="4"
                className="transition-all duration-300 ease-in-out"
              />
            )
          }

          const colorSet = boardColors[index % boardColors.length]
          return (
            <circle
              key={`pos-marker-${index}`}
              cx={point.x}
              cy={point.y}
              r="30"
              fill={colorSet.fill}
              stroke={colorSet.stroke}
              strokeWidth="8"
              className="transition-all duration-300 ease-in-out"
            />
          )
        })}

        {points.map((_point, index) => (
          <PlayerTags key={`tags-${index}`} positionIndex={index} />
        ))}
      </svg>
    </div>
  )
}
