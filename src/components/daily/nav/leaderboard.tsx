"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envConfig } from '@/lib/config/envConfig';
import type { LeaderboardEntry } from '@/services';

function countryCodeToFlag(code: string): string {
    return code
        .toUpperCase()
        .split('')
        .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('');
}

function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get<{ entries: LeaderboardEntry[] }>(`${envConfig.BASE_URL}/leaderboard`)
            .then(res => setEntries(res.data.entries))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center py-6 text-gray-500 text-sm">Loading...</div>;
    }

    if (entries.length === 0) {
        return <div className="text-center py-6 text-gray-500 text-sm">No completions yet today.</div>;
    }

    return (
        <div className="overflow-y-auto max-h-64">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-500 uppercase border-b">
                        <th className="py-1 text-left w-8">#</th>
                        <th className="py-1 text-left">Player</th>
                        <th className="py-1 text-center">Stars</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map(entry => (
                        <tr key={entry.userId} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-2 text-gray-400 pr-2">{entry.rank}</td>
                            <td className="py-2">
                                <span className="mr-1">
                                    {entry.countryCode ? countryCodeToFlag(entry.countryCode) : '🌐'}
                                </span>
                                {entry.name ?? entry.userId}
                            </td>
                            <td className="py-2 text-center text-yellow-500">
                                {entry.stars > 0
                                    ? '★'.repeat(entry.stars) + '☆'.repeat(5 - entry.stars)
                                    : <span className="text-red-400">✕</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { Leaderboard };
