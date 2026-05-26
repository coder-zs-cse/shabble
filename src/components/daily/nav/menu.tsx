'use client'
import { Divider, Title } from '@/components'
import { useGameSettings } from '@/contexts'
import React, { useEffect, useState } from 'react'
import { FaHeart, FaQuestion } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdLeaderboard } from 'react-icons/md'
import { MdLogin, MdLogout } from 'react-icons/md'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface MenuProps {
    isOpen: boolean
    onClose: () => void
    onSelectDifficulty: (size: number) => void
    onShowStatistics: () => void
    onShowHelp: () => void
}

const Menu: React.FC<MenuProps> = ({
    isOpen,
    onClose,
    onSelectDifficulty,
    onShowStatistics,
    onShowHelp,
}) => {
    const { settings } = useGameSettings();
    const { data: session } = useSession();
    const router = useRouter();
    const [playerId, setPlayerId] = useState<string | null>(null);

    useEffect(() => {
        setPlayerId(localStorage.getItem("userId"));
    }, []);

    const difficultyOptions = [
        { size: 5, label: 'EASY', level: '5 x 5', levelClassName: 'text-green-600' },
        { size: 6, label: 'MEDIUM', level: '6 x 6', levelClassName: 'text-yellow-500' },
        { size: 7, label: 'HARD', level: '7 x 7', levelClassName: 'text-red-700' },
    ];

    const menuItems = [
        { label: 'Statistics', onClick: onShowStatistics, icon: MdLeaderboard },
        { label: 'Help', onClick: onShowHelp, icon: FaQuestion },
        {
            label: 'Support',
            onClick: () => {
                window.open('https://getmechai.vercel.app/link.html?vpa=www.zubinshah1886@okaxis&nm=ZubinShah&amt=100', '_blank');
            },
            icon: FaHeart
        },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-[999]"
                    onClick={onClose}
                />
            )}

            {/* Sliding Menu */}
            <div className={`
                absolute top-0 left-0 h-full w-[300px] bg-[#f6f7f8]
                transform transition-transform duration-300 ease-in-out z-[1000]
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="">
                    <div className="flex items-center justify-between p-4">
                        <Title title="MENU" className='!text-md' />
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <IoClose size={24} />
                        </button>
                    </div>
                    <Divider isVertical={false} className='' />

                    <div className=" mt-4">

                        {difficultyOptions.map((option, index) => (
                            <div className={`flex gap-2 items-center h-[64px] hover:bg-white cursor-pointer ${option.size === settings.boardSize ? 'bg-gray-200 text-black' : ''}`} key={index} onClick={() => onSelectDifficulty(option.size)}>
                                {/* <div className='flex gap-2 items-center h-[64px] hover:bg-white cursor-pointer' key={index} onClick={() => onSelectDifficulty(option.size)}> */}
                                    <span className={`text-[20px] font-bold pl-4 ${option.levelClassName}`}>{option.level}</span>
                                    <span className='text-[25px] font-bold '>{option.label}</span>
                                </div>

                        ))}

                                <Divider isVertical={false} className='my-4' />

                                {menuItems.map((item, index) => (
                                    <div className='flex gap-1 items-center hover:bg-white rounded cursor-pointer' onClick={item.onClick} key={index}>
                                        <div className='pl-3'>{item.icon && <item.icon size={30} />}</div>
                                        <div
                                            className="w-full text-left p-3 text-[25px] uppercase rounded text-[20px] font-bold"
                                        >
                                            {item.label}
                                        </div>
                                    </div>
                                ))}

                                <Divider isVertical={false} className='my-2' />

                                {session?.user ? (
                                    <>
                                        <div className='px-4 py-1 text-sm text-gray-500 uppercase tracking-wide truncate'>
                                            {session.user.name || session.user.email}
                                        </div>
                                        <div
                                            className='flex gap-1 items-center hover:bg-white rounded cursor-pointer'
                                            onClick={() => signOut({ callbackUrl: '/daily' })}
                                        >
                                            <div className='pl-3'><MdLogout size={30} /></div>
                                            <div className="w-full text-left p-3 text-[20px] uppercase font-bold">Log Out</div>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className='flex gap-1 items-center hover:bg-white rounded cursor-pointer'
                                        onClick={() => { onClose(); router.push('/login'); }}
                                    >
                                        <div className='pl-3'><MdLogin size={30} /></div>
                                        <div className="w-full text-left p-3 text-[20px] uppercase font-bold">Log In</div>
                                    </div>
                                )}

                                {playerId && (
                                    <div className='px-4 py-3 text-xs text-gray-400 uppercase tracking-wider text-center'>
                                        PLAYER ID: {playerId}
                                    </div>
                                )}
                            </div>
                </div>
                </div>
            </>
            )
}

            export default Menu