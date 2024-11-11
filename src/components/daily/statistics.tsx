import React from 'react'
import Title from '../ui/title/title';

// Subcomponents
const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center py-4 border-b hover:bg-gray-100">
    <div className="flex items-center justify-center text-sm text-gray-600 uppercase tracking-wide w-full h-full text-center">{label}</div>
    <div className="text-2xl font-semibold text-center w-full h-full">{value}</div>
  </div>
  // <div className="flex items-center justify-center">
  //   <div className="text-xl text-gray-600 bg-gray-200 uppercase text-right tracking-wide w-full h-full">{label}</div>
  //   <div className="text-2xl font-semibold w-full h-full pl-4">{value}</div>
  // </div>
)

const StarBar = ({ stars, value, maxValue }: { stars: number; value: number; maxValue: number }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
  
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 flex items-center">
        {stars === 0 ? '✕' : `${stars}`}
        {stars > 0 && <span className="text-yellow-500 ml-1">★</span>}
      </div>
      <div className="flex-1 h-8 bg-gray-100 rounded-sm overflow-hidden">
        {value > 0 && (
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      <div className="w-12 text-right text-sm text-gray-600">
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
  const maxDistribution = Math.max(...statistics.starDistribution)

  const playerId = localStorage.getItem("userId")
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center" 
      onClick={() => setShowStatistics(false)}
    >
      <div 
        className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Title title='STATISTICS' className='flex-1 text-center' />
          <button 
            onClick={() => setShowStatistics(false)}
            className="text-gray-500 hover:text-gray-700"
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
          <Title title='STAR DISTRIBUTION' className='flex-1 text-center text-[20px] md:!text-[25px] font-normal mb-2' />
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

export default Statistics