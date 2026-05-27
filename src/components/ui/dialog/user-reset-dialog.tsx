'use client'
import React from 'react'
import Button from '../button/button'

function UserResetDialog() {
    const handleReset = () => {
        localStorage.removeItem('userId');
        window.location.reload();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='bg-white rounded-xl p-6 mx-4 max-w-sm w-full flex flex-col gap-4 shadow-xl'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg font-semibold text-black'>Account not found</h2>
                    <p className='text-sm text-gray-500'>
                        Your saved account could not be found. Reset to start fresh with a new account.
                    </p>
                </div>
                <Button onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    )
}

export default UserResetDialog
