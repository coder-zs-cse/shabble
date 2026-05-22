"use client";

import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '@/api/leaderboard-api';
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
        getLeaderboard()
            .then(setEntries)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">Loading...</div>;
    }

    if (entries.length === 0) {
        return <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">No completions yet today.</div>;
    }

    return (
        <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                    <tr className="text-xs text-gray-500 uppercase border-b">
                        <th className="py-1 text-left w-8">#</th>
                        <th className="py-1 text-left">Player</th>
                        <th className="py-1 text-right">Stars</th>
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
                            <td className="py-2 text-right">
                                {entry.stars > 0 ? (
                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                                        ⭐ {entry.stars}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">
                                        ✕
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { Leaderboard };
