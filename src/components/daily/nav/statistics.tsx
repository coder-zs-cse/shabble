import React from 'react'
import { Title } from '@/components'

// Subcomponents
const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center py-4 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 group">
    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide w-full h-full text-center group-hover:!text-black dark:group-hover:!text-white">{label}</div>
    <div className="text-2xl font-semibold text-black dark:text-white text-center w-full h-full group-hover:!text-black dark:group-hover:!text-white">{value}</div>
  </div>
)

const StarBar = ({ stars, value, maxValue }: { stars: number; value: number; maxValue: number }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
  
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 flex items-center justify-center dark:text-white">
        {stars === 0 ? '✕' : `${stars}`}
        {stars > 0 && <span className="text-yellow-500 ml-1">★</span>}
      </div>
      <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm overflow-hidden">
        {value > 0 && (
          <div 
            className={`h-full ${stars === 0 ? 'bg-red-400' : 'bg-green-500'} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      <div className="w-12 text-right text-sm text-gray-600 dark:text-gray-400">
        {percentage.toFixed(0)}%
      </div>
    </div>
  )
}

interface StatisticsProps {
  statistics: {
    played: number;
    totalStars: number;
    currentStreak: number;
    bestStreak: number;
    starDistribution: number[];
  };
  setShowStatistics: (show: boolean) => void;
}

function Statistics({ statistics, setShowStatistics }: StatisticsProps) {
  const maxDistribution = statistics.starDistribution.reduce((acc, curr) => acc + curr, 0)

  const playerId = localStorage.getItem("userId")
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]" 
      onClick={() => setShowStatistics(false)}
    >
      <div 
        className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Title title='STATISTICS' className='flex-1 text-center dark:text-white' />
          <button 
            onClick={() => setShowStatistics(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-white"
          >
            ✕
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          <StatBox label="Played" value={statistics.played} />
          <StatBox label="Total Stars" value={statistics.totalStars} />
          <StatBox label="Current Streak" value={statistics.currentStreak} />
          <StatBox label="Best Streak" value={statistics.bestStreak} />
        </div>

        {/* Star Distribution */}
        <div className="mb-8">
          <Title title='STAR DISTRIBUTION' className='flex-1 text-center text-[20px] md:!text-[25px] font-normal mb-2 dark:text-white' />
          <div className="space-y-2">
            {statistics.starDistribution.map((value, index) => (
              <StarBar 
                key={index}
                stars={index}
                value={value}
                maxValue={maxDistribution}
              />
            ))}
          </div>
        </div>

        {/* Player ID */}
        <div className="text-center text-sm text-gray-500">
          PLAYER ID: {playerId}
        </div>
      </div>
    </div>
  )
}

export { Statistics }