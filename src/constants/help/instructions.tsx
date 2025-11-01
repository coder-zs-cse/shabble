import { Board } from '@/components';
import React from 'react';


const hiddenShapes: string[][][] = [
    [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["X", "X", "X", "", ""],
        ["", "", "X", "X", ""],
        ["", "", "", "", ""]
    ],
    [
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "X", "X", "X", "X", ""],
        ["", "", "X", "X", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""]
    ],
    [
        ["", "", "", "", "X", ""],
        ["", "", "", "X", "X", ""],
        ["", "", "", "X", "", ""],
        ["", "", "X", "X", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""]
    ],
    [
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "X", "", ""],
        ["", "", "X", "", "X", "", ""],
        ["", "", "X", "X", "X", "X", ""]
    ],

]

const tileBlocks: string[][][] = [
    [
        ["", "", "4", "", ""],
        ["", "", "", "", ""],
        ["", "3", "", "", ""],
        ["", "", "", "1", ""],
        ["0", "", "", "", ""]
    ],
    [
        ["", "", "", "X", ""],
        ["", "X", "X", "X", ""],
        ["", "X", "", "X", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ]
]

export const instructions: readonly (string | JSX.Element)[][] = [
    [
        <>
            <span className='bg-green-300 text-black py-1'>The Goal is to find the hidden Shape!</span>
        </>,
        <>
            You will earn a star for every hint you have remaining once the <span className="font-bold">SHABBLE</span> is solved ⭐
        </>,
        <>
            Everyday is a new shape!
        </>
    ],
    [
        <>
            The hidden shape is a continuous block of tiles.
        </>,
        <>
            <div className='flex flex-wrap justify-around gap-4'>
                {hiddenShapes.map((shape, index) => (
                    <div className='flex flex-col items-center gap-2 !w-[40%] md:!w-[20%]  h-full' key={index}>
                        <Board
                            board={shape}
                            guess={shape}
                            gameStatus="guessing"
                            incorrectGuess={false}
                            className='!gap-0.5'
                            tileClassName='!rounded !cursor-default'
                        />
                        <div className='text-sm'>{shape.length} x {shape[0].length}</div>
                    </div>
                ))}
            </div>
        </>,
        <>
            The number of tiles in the hidden shape is equal to the length of the board.
        </>
    ],
    [
        <>
            Clicking on any tile will reveal the number of blocks of hidden shape surrounding that tile including it. In other words out of 9 tiles around it, how many are part of hidden shape.
        </>,
        <>
            <div className='flex flex-wrap justify-center gap-4'>
                {tileBlocks.map((block, index) => (
                    <Board
                        key={index}
                        board={block}
                        guess={block}
                        gameStatus={index === 0 ? "playing" : "guessing"}
                        incorrectGuess={false}
                        className='!w-[40%] md:!w-[20%] !gap-0.5'
                        tileClassName='!rounded !text-base !cursor-default'
                    />
                ))}
            </div>
        </>,
        <>
            In this above example, every tile with a number reveals the number of blocks of hidden shape surrounding it.
        </>
    ],
    [
        <>
            Guessing a incorrect shape would consume 2 hints.
        </>,
        <>
            <p className='text-black font-bold text-xl md:text-2xl text-center'>15 <span className='text-[#a9abad] font-normal'>HINTS REMAINING</span></p>
        </>,
        <>
            Solve the <span className="font-bold">SHABBLE</span> in 15 attempts or fewer.
        </>,
    ],
    [
        <>
            Inspired from <a href="https://wafflegame.net/daily" className='text-green-600 font-bold' target="_blank" rel="noopener noreferrer">Waffle</a> and <a href="https://minesweeper.online/" className='text-green-600 font-bold' target="_blank" rel="noopener noreferrer">Minesweeper</a>
        </>,
        <>
            Made with ❤️ by <a href="https://github.com/coder-zs-cse/" className='text-green-600 font-bold' target="_blank" rel="noopener noreferrer">Zubin Shah</a>
        </>,
        <>
            Buy me a <a href="https://getmechai.vercel.app/link.html?vpa=www.zubinshah1886@okaxis&nm=ZubinShah&amt=100" className='text-green-600 font-bold' target="_blank" rel="noopener noreferrer">{" "}chai ☕</a>
        </>
    ]
] as const;
