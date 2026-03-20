import { useEffect, useRef, type FC } from "react"
import classes from "./MyCopyableTextBlock.module.css"
import MyDividerLine from "../MyDividerLine/MyDividerLine"
import MyCooldownButton from "../MyCooldownButton/MyCooldownButton"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { RiFileCopy2Fill } from "react-icons/ri"
import { MdDownload } from "react-icons/md"
import downloadStringAsTxtFile from "../../../utils/downloadStringAsTxtFile"
import getTimeAndDateString from "../../../utils/getTimeAndDateString"

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

    const containerClassName = `${classes["text-block__container"]} ${isCollapsed ? classes["text-block__container--collapsed"] : classes["text-block__container--expanded"]}`
    const collapseButtonClassName = `${classes["collapse-button"]} ${isCollapsed ? classes["collapse-button--collapsed"] : classes["collapse-button--expanded"]}`
    const containerRef = useRef<null | HTMLDivElement>(null)

    const onCopyButtonClick = () => {
        navigator.clipboard.writeText(text)
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const lineHeight = getComputedStyle(container).lineHeight
        container.style.setProperty("--line-height", lineHeight)
    }, [])

    const downloadedFileName = "Anki generated deck " + getTimeAndDateString()

    return (
        <figure className={containerClassName} ref={containerRef}>
            <figcaption className={classes["text-block__header"]}>
                <label htmlFor={id}>
                    {label}
                </label>
                <div className={classes["get-result-buttons-row"]}>
                    <MyCooldownButton alignTo="right" CooldownIcon={IoIosCheckmarkCircle} ButtonIcon={RiFileCopy2Fill}
                        cooldownText="COPIED" onClick={onCopyButtonClick} isLoading={isLoading}
                    >
                        COPY
                    </MyCooldownButton>
                    <MyCooldownButton alignTo="right" CooldownIcon={IoIosCheckmarkCircle} ButtonIcon={MdDownload}
                        cooldownText="SUCCESS" onClick={() => downloadStringAsTxtFile(text, downloadedFileName)}
                    >
                        DOWNLOAD
                    </MyCooldownButton>
                </div>
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