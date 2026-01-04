import { useRef, useState, type CSSProperties, type FC, type HTMLAttributes } from "react"
import classes from "./MyCopyableTextBlock.module.css"
import CopySVG from "@assets/svg/copy-svgrepo-com.svg?react"
import SuccessSVG from "@assets/svg/success-svgrepo-com.svg?react"
import MyDividerLine from "../MyDividerLine/MyDividerLine"
import { flushSync } from "react-dom"

type TMyCopyableTextBlockProps = {
    children: string,
    id: string,
    label: string,
    disableCopyButton?: boolean
} & HTMLAttributes<HTMLDivElement>

const MyCopyableTextBlock: FC<TMyCopyableTextBlockProps> = ({
    children: text,
    id,
    label,
    disableCopyButton
}) => {

    const copyTextChangeTimerRef = useRef<null | NodeJS.Timeout>(null)
    //null for initial, uninteracted state for animation handling
    const [isTextCopied, setIsTextCopied] = useState<boolean | null>(null)

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

    return (
        <figure className={classes["text-block__container"]}>
            <figcaption className={classes["text-block__header"]}>
                <label htmlFor={id}>
                    {label}
                </label>
                <button onClick={onCopyButtonClick} className={copyButtonClassname} disabled={disableCopyButton}>
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
            </figcaption>
            <div className={classes["text-block__divider"]}>
                <MyDividerLine orientation="horisontal" />
            </div>
            <code id={id}>
                {text}
            </code>
        </figure>
    )
}

export default MyCopyableTextBlock