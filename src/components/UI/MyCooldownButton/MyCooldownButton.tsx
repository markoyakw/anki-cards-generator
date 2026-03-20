import { useMemo, useRef, useState, type CSSProperties, type FC, type MouseEventHandler } from 'react'
import classes from "./MyCooldownButton.module.css"
import type { IconType } from 'react-icons'
import { flushSync } from 'react-dom'

type TMyCooldownButton = {
    isLoading?: boolean
    onClick: MouseEventHandler<HTMLButtonElement>
    alignTo: "left" | "right"

    children: string
    ButtonIcon: IconType

    cooldownText: string
    CooldownIcon: IconType
}


const getSymbolsWithStringLengthStyle = (string: string) => {
    return { "--string-length": string.length } as CSSProperties
}

const getSeparateSymbolsInSpans = (string: string) => {
    return string.split("").map((symbol, symbolId) => {
        const idCssPropertie = { "--id": symbolId } as CSSProperties
        return (
            <span key={symbolId} style={idCssPropertie} >
                {symbol}
            </ span >)
    })
}

const MyCooldownButton: FC<TMyCooldownButton> = ({ isLoading, onClick, children, ButtonIcon, cooldownText, CooldownIcon, alignTo }) => {

    const [isCooldownRunning, setIsCooldownRunning] = useState<boolean | null>(null)
    const COPIED_TEXT_CHANGE_DURATION = 3000
    const copyTextChangeTimerRef = useRef<null | NodeJS.Timeout>(null)
    //===true/false checks are for handling of "null" case
    const copyButtonClassname = `${classes["cd-button"]} ${isCooldownRunning === true && classes["cd-button--on-cooldown"]} ${isCooldownRunning === false && classes["cd-button--ready"]}`

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

    const buttonTextContainerStyles = useMemo((): CSSProperties => {
        var justifyContent: CSSProperties["justifyContent"] = alignTo === "left" ? "flex-start" : "flex-end"
        return { justifyContent }
    }, [alignTo])

    return (
        <>{
            isLoading
                ? <div className={classes["cd-button__loading-spans-container"]}>
                    {getSeparateSymbolsInSpans("LOADING...")}
                </div>
                : <button onClick={cooldownButtonClickHandler} className={copyButtonClassname}>
                    <div className={classes["cd-button__states-container"]}>

                        <div className={`${classes["button-text__container"]} ${classes["button-text__container--on-cooldown"]}`}
                            style={{
                                ...getSymbolsWithStringLengthStyle(cooldownText),
                                ...buttonTextContainerStyles
                            }}
                        >
                            {getSeparateSymbolsInSpans(cooldownText)}
                            <CooldownIcon className={`${classes["svg-icon"]} ${classes["svg-icon--on-cooldown"]}`} />
                        </div>

                        <div className={`${classes["button-text__container"]} ${classes["button-text__container--ready"]}`}
                            style={{
                                ...getSymbolsWithStringLengthStyle(children),
                                ...buttonTextContainerStyles
                            }}
                        >
                            {getSeparateSymbolsInSpans(children)}
                            <ButtonIcon className={`${classes["svg-icon"]} ${classes["svg-icon--ready"]}`} />
                        </div>

                    </div>
                </button >
        }</>
    )
}

export default MyCooldownButton