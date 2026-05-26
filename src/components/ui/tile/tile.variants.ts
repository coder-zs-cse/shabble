import { tv } from 'tailwind-variants';

export const tileTv = tv({
    base: "flex items-center justify-center rounded-md sm:rounded-xl md:rounded-xl font-bold text-2xl md:text-4xl shadow-[inset_0_-4px_0_rgba(0,0,0,0.05)]",
    variants: {
      status: {
        "tile-empty": "bg-gray-200 dark:bg-gray-800 text-white",
        "tile-loading": "bg-yellow-400 text-white",
        "tile-filled": "bg-yellow-400 dark:bg-yellow-500 text-white",
        "guess-empty": "bg-green-200 text-green-800/50",
        "guess-filled": "bg-green-600 text-white/30",
        "guess-loading": "animate-guessLoading text-white/15",
        "guess-incorrect": "bg-red-600 animate-shake text-white",
        "won": "bg-green-600 text-white"
      },
      gameComplete: {
        true: "",
        false: "cursor-pointer"
      }
    },
    defaultVariants: {
      status: "tile-empty",
      gameComplete: false
    }
  })
  