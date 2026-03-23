import { useMemo, useRef, useState, type CSSProperties, type FC, type MouseEventHandler } from 'react'
import classes from "./MyCooldownButton.module.css"
import type { IconType } from 'react-icons'
import { flushSync } from 'react-dom'

type TMyCooldownButton = {
    isLoading?: boolean
    onClick: MouseEventHandler<HTMLButtonElement>
    alignTo: "left" | "right"
    loadingText?: string
    children: string
    ButtonIcon: IconType
    cooldownText: string
    CooldownIcon: IconType
}

type TButtonState = 'null' | 'loading' | 'ready' | 'onCD' | 'error'

const getSymbolsWithStringLengthStyle = (string: string) => {
    return { "--string-length": string.length } as CSSProperties
}

const getSeparateSymbolsInSpans = (string: string) => {
    return string.split("").map((symbol, symbolId) => {
        const idCssProperty = { "--id": symbolId } as CSSProperties
        return (
            <span key={symbolId} style={idCssProperty}>
                {symbol === ' ' ? '\u00A0' : symbol}
            </span>
        )
    })
}

const MyCooldownButton: FC<TMyCooldownButton> = ({
    isLoading,
    onClick,
    children,
    ButtonIcon,
    cooldownText,
    CooldownIcon,
    alignTo,
    loadingText = "LOADING..."
}) => {
    const [state, setState] = useState<TButtonState>('null')
    const COOLDOWN_DURATION = 3000
    const timerRef = useRef<null | NodeJS.Timeout>(null)

    // sync with isLoading prop
    const resolvedState: TButtonState = isLoading ? 'loading' : state

    const buttonClassname = `${classes["cd-button"]} ${
        resolvedState === 'onCD' ? classes["cd-button--on-cooldown"] : ''
    } ${
        resolvedState === 'ready' ? classes["cd-button--ready"] : ''
    } ${
        resolvedState === 'error' ? classes["cd-button--error"] : ''
    }`

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            flushSync(() => setState('ready'))
        }

        try {
            onClick(e)
            setState('onCD')
            timerRef.current = setTimeout(() => {
                setState('ready')
            }, COOLDOWN_DURATION)
        } catch {
            setState('error')
        }
    }

    const buttonTextContainerStyles = useMemo((): CSSProperties => ({
        justifyContent: alignTo === "left" ? "flex-start" : "flex-end"
    }), [alignTo])

    if (resolvedState === 'loading') {
        return (
            <div className={classes["cd-button__loading-spans-container"]}>
                {getSeparateSymbolsInSpans(loadingText)}
            </div>
        )
    }

    return (
        <button onClick={handleClick} className={buttonClassname}>
            <div className={classes["cd-button__states-container"]}>
                <div
                    className={`${classes["button-text__container"]} ${classes["button-text__container--on-cooldown"]}`}
                    style={{
                        ...getSymbolsWithStringLengthStyle(cooldownText),
                        ...buttonTextContainerStyles
                    }}
                >
                    {getSeparateSymbolsInSpans(cooldownText)}
                    <CooldownIcon className={`${classes["svg-icon"]} ${classes["svg-icon--on-cooldown"]}`} />
                </div>

                <div
                    className={`${classes["button-text__container"]} ${classes["button-text__container--ready"]}`}
                    style={{
                        ...getSymbolsWithStringLengthStyle(children),
                        ...buttonTextContainerStyles
                    }}
                >
                    {getSeparateSymbolsInSpans(children)}
                    <ButtonIcon className={`${classes["svg-icon"]} ${classes["svg-icon--ready"]}`} />
                </div>
            </div>
        </button>
    )
}

export default MyCooldownButton