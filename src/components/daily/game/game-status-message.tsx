import { MAX_HINTS } from '@/constants'
import { useGameSettings } from '@/contexts'
import { useEffect, useRef, useState } from 'react'


function HintWarningToast({ status }: { status: "danger" | "warning" | "normal" }) {
    const [show, setShow] = useState(false)
    const prev = useRef(status)
    const hideTimer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        if (status !== "normal" && status !== prev.current) {
            clearTimeout(hideTimer.current)
            setShow(true)
            hideTimer.current = setTimeout(() => setShow(false), 1200)
        }
        prev.current = status
        return () => clearTimeout(hideTimer.current)
    }, [status])

    const isDanger = status === "danger"

    return (
        <div
            className={`
                fixed top-4 left-1/2 -translate-x-1/2 z-[9999]
                flex items-center gap-2 px-5 py-2.5
                rounded-full font-semibold text-sm shadow-xl
                pointer-events-none select-none
                transition-all duration-300 ease-out
                ${show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-3"
                }
                ${isDanger
                    ? "bg-red-500 text-white shadow-red-500/30"
                    : "bg-yellow-400 text-yellow-900 shadow-yellow-400/30"
                }
            `}
        >
            <span>{isDanger ? "🔴" : "⚠️"}</span>
            <span>{isDanger ? "Almost out of hints!" : "Hints running low"}</span>
        </div>
    )
}



export function GameStatusMessage() {
    const { settings } = useGameSettings()

    const remainingHints = MAX_HINTS[settings.boardSize] - settings.hints

    const getHintStatus = (remaining: number): "danger" | "warning" | "normal" => {
        if (remaining <= 1) return "danger"
        if (remaining <= 3) return "warning"
        return "normal"
    }

    const hintStatus = getHintStatus(remainingHints)

    const getMessage = (): React.ReactNode => {
        switch (settings.gameStatus) {
            case "won":
            case "lost":
            case "playing":
            case "tile-loading":
                if (settings.hints === 0 && settings.gameStatus !== "won") {
                    return (
                        <span className='text-[#a9abad] font-normal'>
                            CLICK ANY TILE TO GET A HINT
                        </span>
                    )
                }

                return (
                    <span className='font-normal flex items-center gap-2 flex-wrap'>
                        <span
                            className={`
                                font-bold
                                ${hintStatus === "danger"
                                    ? "text-red-500"
                                    : hintStatus === "warning"
                                    ? "text-yellow-500"
                                    : "text-black dark:text-white"
                                }
                            `}
                        >
                            {remainingHints}
                        </span>
                        <span className='text-[#a9abad]'>HINTS REMAINING</span>
                    </span>
                )

            case "guess-loading":
                return (
                    <span className='text-[#a9abad] font-normal'>CHECKING...</span>
                )

            case "guessing":
                return (
                    <span className='text-[#a9abad] font-normal'>
                        {settings.guessTileCount}/{settings.boardSize} TILES OF HIDDEN SHAPE SELECTED
                    </span>
                )

            default:
                return null
        }
    }

    return (
        <>
            <HintWarningToast status={hintStatus} />
            <div className='text-black font-bold text-sm sm:text-xl md:text-2xl'>
                {getMessage()}
            </div>
        </>
    )
}