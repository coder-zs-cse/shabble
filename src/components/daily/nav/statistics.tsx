"use client";

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Title } from '@/components';
import { Leaderboard } from './leaderboard';

// Subcomponents
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

type Tab = 'stats' | 'leaderboard';

function Statistics({ statistics, setShowStatistics }: StatisticsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const { data: session, status } = useSession();
  const isSignedIn = status === 'authenticated';
  const maxDistribution = statistics.starDistribution.reduce((acc, curr) => acc + curr, 0);
  const playerId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const displayName = isSignedIn ? (session?.user?.name ?? playerId) : playerId;

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
          <button
            onClick={() => setShowStatistics(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'stats' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
          >
            MY STATS
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'leaderboard' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
          >
            LEADERBOARD
          </button>
        </div>

        {activeTab === 'stats' ? (
          <>
            {/* Stats Grid */}
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
                  <StarBar
                    key={index}
                    stars={index}
                    value={value}
                    maxValue={maxDistribution}
                  />
                ))}
              </div>
            </div>

            {/* Player identity + sign-in */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>PLAYER: {displayName}</span>
              {isSignedIn ? (
                <button
                  onClick={() => signOut()}
                  className="text-xs underline hover:text-gray-700"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center gap-1 bg-white border border-gray-300 rounded px-3 py-1 text-xs font-medium hover:bg-gray-50 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Sign in with Google
                </button>
              )}
            </div>
          </>
        ) : (
          <Leaderboard />
        )}
      </div>
    </div>
  )
}

export { Statistics }
