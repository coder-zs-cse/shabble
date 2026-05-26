'use client'
import React, { useEffect, useState } from 'react'
import { axiosOpen } from '@/api/axios'
import { Loader } from '@/components'

const MAX_LEADERBOARD_USERS = 10

interface LeaderboardUser {
    name: string | null
    totalStars: number
    played: number
    bestStreak: number
}

export function LeaderboardTab() {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        axiosOpen.get('/leaderboard')
            .then(res => setUsers(res.data.users.slice(0, MAX_LEADERBOARD_USERS)))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader />
            </div>
        )
    }

    if (error) {
        return <p className="text-center text-sm text-gray-400 py-8">Failed to load leaderboard.</p>
    }

    if (users.length === 0) {
        return <p className="text-center text-sm text-gray-400 py-8">No entries yet. Be the first to log in and play!</p>
    }

    return (
        <div className="overflow-y-auto max-h-[calc(100vh-260px)] hide-scrollbar">
            {users.map((user, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-6 text-center text-sm font-bold text-gray-400">{index + 1}</span>
                        <span className="text-sm font-semibold truncate max-w-[160px]">
                            {user.name ?? 'Anonymous'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                        <span className="text-yellow-500">★</span>
                        <span>{user.totalStars}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
