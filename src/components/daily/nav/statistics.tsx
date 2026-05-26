'use client'
import React, { useState } from 'react'
import { Title } from '@/components'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LeaderboardTab } from './leaderboard-tab'

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center py-4 border-b hover:bg-gray-100">
    <div className="flex items-center justify-center text-sm text-gray-600 uppercase tracking-wide w-full h-full text-center">{label}</div>
    <div className="text-2xl font-semibold text-center w-full h-full">{value}</div>
  </div>
)

const StarBar = ({ stars, value, maxValue }: { stars: number; value: number; maxValue: number }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 flex items-center justify-center">
        {stars === 0 ? '✕' : `${stars}`}
        {stars > 0 && <span className="text-yellow-500 ml-1">★</span>}
      </div>
      <div className="flex-1 h-8 bg-gray-100 rounded-sm overflow-hidden">
        {value > 0 && (
          <div
            className={`h-full ${stars === 0 ? 'bg-red-400' : 'bg-green-500'} transition-all duration-500`}
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

type Tab = 'statistics' | 'leaderboard'

function Statistics({ statistics, setShowStatistics }: StatisticsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('statistics')
  const maxDistribution = statistics.starDistribution.reduce((acc, curr) => acc + curr, 0)
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]"
      onClick={() => setShowStatistics(false)}
    >
      <div
        className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Title title='STATISTICS' className='flex-1 text-center' />
          <button onClick={() => setShowStatistics(false)} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 pb-2 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === 'statistics' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
          <button
            className={`flex-1 pb-2 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === 'leaderboard' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
        </div>

        {activeTab === 'statistics' ? (
          <>
            {/* Stats Grid — no overflow, fixed height */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              <StatBox label="Played" value={statistics.played} />
              <StatBox label="Total Stars" value={statistics.totalStars} />
              <StatBox label="Current Streak" value={statistics.currentStreak} />
              <StatBox label="Best Streak" value={statistics.bestStreak} />
            </div>

            {/* Star Distribution */}
            <div className="mb-6">
              <Title title='STAR DISTRIBUTION' className='flex-1 text-center text-[20px] md:!text-[25px] font-normal mb-2' />
              <div className="space-y-2">
                {statistics.starDistribution.map((value, index) => (
                  <StarBar key={index} stars={index} value={value} maxValue={maxDistribution} />
                ))}
              </div>
            </div>

            {/* Auth footer */}
            {session?.user ? (
              <div className="text-center text-sm text-gray-500">
                Signed in as <span className="font-semibold">{session.user.name || session.user.email}</span>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-400">
                Secure your stats with a free account{' '}
                <button
                  className="text-black underline font-medium"
                  onClick={() => { setShowStatistics(false); router.push('/login'); }}
                >
                  Log in
                </button>
                {' or '}
                <button
                  className="text-black underline font-medium"
                  onClick={() => { setShowStatistics(false); router.push('/login'); }}
                >
                  Sign up
                </button>
              </div>
            )}
          </>
        ) : (
          <LeaderboardTab />
        )}
      </div>
    </div>
  )
}

export { Statistics }
