import { Board } from '@/components';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

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
      <div className="bg-green-200 dark:bg-green-900/40 text-black dark:text-white rounded-xl px-4 py-3 text-center font-semibold text-lg">
        Find the hidden shape.
      </div>
    </>,
    <>
      <div className="space-y-2 text-center text-base leading-relaxed">
        <p>
          Every solved <span className="font-bold">SHABBLE</span> rewards stars ⭐
          based on your remaining hints.
        </p>
        <p className="text-zinc-500 dark:text-zinc-400">
          A new puzzle appears every day.
        </p>
      </div>
    </>
  ],

  [
    <>
      <div className="space-y-2">
        <h3 className="font-bold text-xl">Hidden Shape</h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          The hidden shape is always one connected group of tiles.
        </p>
      </div>
    </>,

    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center py-2">
        {hiddenShapes.map((shape, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-3"
          >
            <Board
              board={shape}
              guess={shape}
              gameStatus="guessing"
              incorrectGuess={false}
              className="!gap-0.5"
              tileClassName="!rounded !cursor-default"
            />

            <div className="text-sm font-medium text-zinc-500">
              {shape.length} × {shape[0].length}
            </div>
          </div>
        ))}
      </div>
    </>,

    <>
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-center">
        The shape contains exactly as many tiles as the board size.
      </div>
    </>
  ],

  [
    <>
      <div className="space-y-2">
        <h3 className="font-bold text-xl">Hints</h3>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Clicking a tile reveals how many surrounding tiles belong to the
          hidden shape.
        </p>
      </div>
    </>,

    <>
      <div className="flex flex-wrap justify-center gap-6 py-2">
  {tileBlocks.map((block, index) => (
    <div
      key={index}
      className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-3"
    >
            <Board
            board={block}
              guess={block}
              gameStatus={index === 0 ? "playing" : "guessing"}
              incorrectGuess={false}
              className="!w-[140px] md:!w-[180px] !gap-0.5"
              tileClassName="!rounded !text-base !cursor-default dark:text-white"
            />
          </div>
        ))}
      </div>
    </>,

    <>
      <div className="text-center text-zinc-500 dark:text-zinc-400">
        Numbers count nearby shape tiles, including the selected tile.
      </div>
    </>
  ],

  [
    <>
      <div className="bg-red-100 dark:bg-red-900/20 rounded-xl px-4 py-3 text-center">
        Incorrect guesses consume <span className="font-bold">2 hints</span>.
      </div>
    </>,

    <>
      <div className="text-center py-2">
        <p className="text-3xl font-black tracking-wide">
          15{" "}
          <span className="text-zinc-400 dark:text-zinc-500 font-medium">
            HINTS
          </span>
        </p>
      </div>
    </>,

    <>
      <div className="text-center text-lg">
        Solve the <span className="font-bold">SHABBLE</span> in 15 attempts or
        fewer.
      </div>
    </>
  ],

  [
    <>
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col items-center gap-4 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          Inspired by{" "}
          <a
            href="https://wafflegame.net/daily"
            className="text-green-600 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Waffle
          </a>{" "}
          and{" "}
          <a
            href="https://minesweeper.online/"
            className="text-green-600 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Minesweeper
          </a>
        </p>

        <a
          href="https://github.com/coder-zs-cse/Shabble"
          className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl hover:scale-105 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={22} />
          <span className="font-semibold">GitHub</span>
        </a>
      </div>
    </>
  ]
] as const;