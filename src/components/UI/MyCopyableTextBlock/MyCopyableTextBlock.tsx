import { useEffect, useRef, useState, type CSSProperties, type FC, type HTMLAttributes } from "react"
import classes from "./MyCopyableTextBlock.module.css"
import CopySVG from "@assets/svg/copy-svgrepo-com.svg?react"
import SuccessSVG from "@assets/svg/success-svgrepo-com.svg?react"
import MyDividerLine from "../MyDividerLine/MyDividerLine"
import { flushSync } from "react-dom"

type TMyTextBlockProps = {
    children: string,
    id: string,
    label: string,
    isLoading?: boolean,
    isCollapsed: boolean
    toggleIsTextBlockCollapsed: () => void
}

type TMyCopyableTextBlockProps = TMyTextBlockProps

const MyCopyableTextBlock: FC<TMyCopyableTextBlockProps> = ({
    children: text,
    id,
    label,
    isLoading,
    isCollapsed,
    toggleIsTextBlockCollapsed
}) => {

    const copyTextChangeTimerRef = useRef<null | NodeJS.Timeout>(null)
    const containerRef = useRef<null | HTMLDivElement>(null)
    //null for initial, uninteracted state for animation handling
    const [isTextCopied, setIsTextCopied] = useState<boolean | null>(null)
    const containerClassName = `${classes["text-block__container"]} ${isCollapsed ? classes["text-block__container--collapsed"] : classes["text-block__container--expanded"]}`
    const collapseButtonClassName = `${classes["collapse-button"]} ${isCollapsed ? classes["collapse-button--collapsed"] : classes["collapse-button--expanded"]}`

    const COPIED_TEXT = "COPIED"
    const COPY_TEXT = "COPY"
    const COPIED_TEXT_CHANGE_DURATION = 3000

    const onCopyButtonClick = () => {
        if (copyTextChangeTimerRef.current) {
            clearTimeout(copyTextChangeTimerRef.current)
            flushSync(() => setIsTextCopied(false))
        }
        navigator.clipboard.writeText(text)
        setIsTextCopied(true)
        copyTextChangeTimerRef.current = setTimeout(() => {
            setIsTextCopied(false)
        }, COPIED_TEXT_CHANGE_DURATION)
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

    const getSymbolsinStringCountStyle = (string: string) => {
        return { "--string-length": string.length } as CSSProperties
    }

    const copyButtonClassname = `${classes["copy-button"]} ${isTextCopied === true && classes["copy-button--copied-state"]} ${isTextCopied === false && classes["copy-button--copy-state"]}`

    //pass a line height to css for right sizing of a minimised text block
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const lineHeight = getComputedStyle(container).lineHeight
        console.log(lineHeight)
        container.style.setProperty("--line-height", lineHeight)
    }, [])

    return (
        <figure className={containerClassName} ref={containerRef}>
            <figcaption className={classes["text-block__header"]}>
                <label htmlFor={id}>
                    {label}
                </label>
                {
                    isLoading
                        ? <div className={classes["copy-button__loading-text"]}>
                            {getSeparateSymbolsInSpans("LOADING...")}
                        </div>
                        : <button onClick={onCopyButtonClick} className={copyButtonClassname}>
                            <div className={classes["copy-button__animated-text-container"]}>
                                <div className={classes["copy-button__animated-text"]} style={getSymbolsinStringCountStyle(COPIED_TEXT)}>
                                    {getSeparateSymbolsInSpans(COPIED_TEXT)}&nbsp;
                                    <SuccessSVG className={classes["copy-svg"]} />
                                </div>
                                <div className={classes["copy-button__animated-text"]} style={getSymbolsinStringCountStyle(COPY_TEXT)}>
                                    {getSeparateSymbolsInSpans(COPY_TEXT)}&nbsp;
                                    <CopySVG className={classes["copy-svg"]} />
                                </div>
                            </div>
                        </button>
                }
            </figcaption>
            <div className={classes["text-block__divider"]}>
                <MyDividerLine orientation="horisontal" />
            </div>
            <code id={id}>
                {text}
            </code>
            <button onClick={toggleIsTextBlockCollapsed} className={collapseButtonClassName} />
        </figure>
    )
}

export default MyCopyableTextBlock