import { useRef, useState, type CSSProperties, type FC, type HTMLAttributes, type MouseEventHandler } from 'react'
import classes from "./MyCooldownButton.module.css"
import type { IconType } from 'react-icons'
import { flushSync } from 'react-dom'

type TMyCooldownButton = {
    isLoading?: boolean
    onClick: MouseEventHandler<HTMLButtonElement>

    children: string
    ButtonIcon: IconType

    cooldownText: string
    CooldownIcon: IconType
}


const getSymbolsWithStringLengthStyle = (string: string) => {
    return { "--string-length": string.length } as CSSProperties
}

const getSeparateSymbolsInSpans = (string: string, spanProps?: HTMLAttributes<HTMLSpanElement>) => {
    return string.split("").map((symbol, symbolId) => {
        const idCssPropertie = { "--id": symbolId } as CSSProperties
        return (
            <span key={symbolId} style={{ ...spanProps?.style, ...idCssPropertie }} >
                {symbol}
            </ span >)
    })
}

const MyCooldownButton: FC<TMyCooldownButton> = ({ isLoading, onClick, children, ButtonIcon, cooldownText, CooldownIcon }) => {

    const COPIED_TEXT_CHANGE_DURATION = 3000
    const copyTextChangeTimerRef = useRef<null | NodeJS.Timeout>(null)

    const [isCooldownRunning, setIsCooldownRunning] = useState<boolean | null>(null)

    const cooldownButtonClickHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (copyTextChangeTimerRef.current) {
            clearTimeout(copyTextChangeTimerRef.current)
            flushSync(() => setIsCooldownRunning(false))
        }

        onClick(e)

        setIsCooldownRunning(true)
        copyTextChangeTimerRef.current = setTimeout(() => {
            setIsCooldownRunning(false)
        }, COPIED_TEXT_CHANGE_DURATION)
    }

    const copyButtonClassname = `${classes["cooldown-button"]} 
    ${isCooldownRunning === true && classes["cooldown-button--on-cooldown"]} 
    ${isCooldownRunning === false && classes["cooldown-button--ready"]}`

    return (
        <>{
            isLoading
                ? <div className={classes["cooldown-button__loading-text"]}>
                    {getSeparateSymbolsInSpans("LOADING...")}
                </div>
                : <button onClick={cooldownButtonClickHandler} className={copyButtonClassname}>
                    <div className={classes["cooldown-button__animated-text-container"]}>
                        <div className={classes["cooldown-button__animated-text"]} style={getSymbolsWithStringLengthStyle(cooldownText)}>
                            {getSeparateSymbolsInSpans(cooldownText)}
                            <CooldownIcon className={classes["svg-icon"]} />
                        </div>
                        <div className={classes["cooldown-button__animated-text"]} style={getSymbolsWithStringLengthStyle(children)}>
                            {getSeparateSymbolsInSpans(children)}
                            <ButtonIcon className={classes["svg-icon"]} />
                        </div>
                    </div>
                </button>
        }</>
    )
}

export default MyCooldownButton