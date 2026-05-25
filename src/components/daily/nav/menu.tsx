'use client'
import { Divider, Title } from '@/components'
import { useGameSettings } from '@/contexts'
import React from 'react'
import { FaHeart, FaQuestion } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdLeaderboard } from 'react-icons/md'

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
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[999]"
                    onClick={onClose}
                />
            )}

            <div className={`
                absolute top-0 left-0 h-full w-[300px] bg-[#f6f7f8] dark:bg-[#1a1a2e] dark:text-white
                transform transition-transform duration-300 ease-in-out z-[1000]
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="">
                    <div className="flex items-center justify-between p-4">
                        <Title title="MENU" className='!text-md' />
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <IoClose size={24} />
                        </button>
                    </div>
                    <Divider isVertical={false} className='' />

                    <div className="mt-4">
                        {difficultyOptions.map((option, index) => (
                            <div
                                className={`flex gap-2 items-center h-[64px] hover:bg-white dark:hover:bg-gray-700 cursor-pointer ${option.size === settings.boardSize ? 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white' : ''}`}
                                key={index}
                                onClick={() => onSelectDifficulty(option.size)}
                            >
                                <span className={`text-[20px] font-bold pl-4 ${option.levelClassName}`}>{option.level}</span>
                                <span className='text-[25px] font-bold'>{option.label}</span>
                            </div>
                        ))}

                        <Divider isVertical={false} className='my-4' />

                        {menuItems.map((item, index) => (
                            <div
                                className='flex gap-1 items-center hover:bg-white dark:hover:bg-gray-700 rounded cursor-pointer'
                                onClick={item.onClick}
                                key={index}
                            >
                                <div className='pl-3'>{item.icon && <item.icon size={30} />}</div>
                                <div className="w-full text-left p-3 text-[25px] uppercase rounded text-[20px] font-bold">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu