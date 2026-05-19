'use client'
import { Divider, Title } from '@/components'
// Ensure your context path matches correctly
import { useGameSettings } from '@/contexts/puzzle/game-settings-context' 
import React from 'react'
import { FaHeart, FaQuestion } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdLeaderboard } from 'react-icons/md'

interface MenuProps {
    isOpen: boolean
    onClose: () => void
    onSelectDifficulty?: (size: number) => void // Marked optional since context handles it now!
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
    //  Connect updateSettings to catch size shifts!
    const { settings, updateSettings } = useGameSettings();

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

    //  Handle clicking dynamic sizes cleanly
    const handleDifficultyClick = (size: number) => {
        // 1. Instantly update the state size to regenerate the board arrays
        updateSettings({ boardSize: size });
        
        // 2. Fallback execution helper for your parent hooks if needed
        if (onSelectDifficulty) {
            onSelectDifficulty(size);
        }
        
        // 3. Automatically shut the drawer menu panel
        onClose();
    };

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
                <div>
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

                    <div className="mt-4">
                        {difficultyOptions.map((option, index) => (
                            // Updated onClick to call our context updater pipeline!
                            <div 
                                className={`flex gap-2 items-center h-[64px] hover:bg-white cursor-pointer ${option.size === settings.boardSize ? 'bg-gray-200 text-black' : ''}`} 
                                key={index} 
                                onClick={() => handleDifficultyClick(option.size)}
                            >
                                <span className={`text-[20px] font-bold pl-4 ${option.levelClassName}`}>{option.level}</span>
                                <span className='text-[25px] font-bold'>{option.label}</span>
                            </div>
                        ))}

                        <Divider isVertical={false} className='my-4' />

                        {menuItems.map((item, index) => (
                            <div className='flex gap-1 items-center hover:bg-white rounded cursor-pointer' onClick={item.onClick} key={index}>
                                <div className='pl-3'>{item.icon && <item.icon size={30} />}</div>
                                <div className="w-full text-left p-3 uppercase rounded text-[20px] font-bold">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;