'use client'
import React from 'react'
import Title from '../title/title'
import Button from '../button/button'

function UserResetDialog() {
    const handleReset = () => {
        localStorage.removeItem('userId');
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
            <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm gap-4">

                <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-yellow-400 shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]" />
                    <div className="w-6 h-6 rounded-md bg-yellow-400 shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]" />
                    <div className="w-6 h-6 rounded-md bg-yellow-400 shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]" />
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                    <Title title="ACCOUNT NOT FOUND" className="text-red-700 !text-xl md:!text-2xl" />
                    <p className="text-sm text-gray-500">
                        Your saved account no longer exists. Reset to start fresh with a new account.
                    </p>
                </div>

                <Button onClick={handleReset}>
                    RESET
                </Button>
            </div>
        </div>
    )
}

export default UserResetDialog
