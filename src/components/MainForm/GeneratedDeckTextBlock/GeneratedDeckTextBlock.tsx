import { useEffect, useMemo, useRef, type FC } from "react"
import classes from "./GeneratedDeckTextBlock.module.css"
import MyDividerLine from "../../UI/MyDividerLine/MyDividerLine"
import MyCooldownButton from "../../UI/MyCooldownButton/MyCooldownButton"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { RiFileCopy2Fill } from "react-icons/ri"
import { MdDownload } from "react-icons/md"
import downloadStringAsTxtFile from "../../../utils/downloadStringAsTxtFile"
import getTimeAndDateString from "../../../utils/getTimeAndDateString"
import GenerateApkgWithVoiceButton from "./GenerateApkgWithVoiceButton"
import { convertAiResponseToCardArray, convertDeckToAnkiPipeDividedTxt } from "../../../lib/convertDeck"

type TMyTextBlockProps = {
    children: string,
    id: string,
    label: string,
    isLoading?: boolean,
    isCollapsed: boolean
    toggleIsTextBlockCollapsed: () => void
}

type TGeneratedDeckTextBlockProps = TMyTextBlockProps

const GeneratedDeckTextBlock: FC<TGeneratedDeckTextBlockProps> = ({
    children: generatedDeckString,
    id,
    label,
    isLoading,
    isCollapsed,
    toggleIsTextBlockCollapsed
}) => {

    const containerClassName = `${classes["text-block__container"]} ${isCollapsed ? classes["text-block__container--collapsed"] : classes["text-block__container--expanded"]}`
    const collapseButtonClassName = `${classes["collapse-button"]} ${isCollapsed ? classes["collapse-button--collapsed"] : classes["collapse-button--expanded"]}`
    const downloadingFileName = "Anki generated deck " + getTimeAndDateString()
    const containerRef = useRef<null | HTMLDivElement>(null)

    const cardArray = useMemo(() => {
        if (isLoading) return null
        const cardArray = convertAiResponseToCardArray(generatedDeckString)
        return cardArray
    }, [generatedDeckString, isLoading])
    const renderDownloadButtons = !isLoading && cardArray

    const pipeSeparatedDeck = cardArray && !isLoading
        ? convertDeckToAnkiPipeDividedTxt(cardArray)
        : generatedDeckString

    const onCopyButtonClick = () => {
        if (!pipeSeparatedDeck) return
        navigator.clipboard.writeText(pipeSeparatedDeck)
    }

    const onDownloadButtonClick = () => {
        if (!pipeSeparatedDeck) return
        downloadStringAsTxtFile(pipeSeparatedDeck, downloadingFileName)
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const lineHeight = getComputedStyle(container).lineHeight
        container.style.setProperty("--line-height", lineHeight)
    }, [])

    return (
        <figure className={containerClassName} ref={containerRef}>
            <figcaption className={classes["text-block__header"]}>
                <div className={classes["get-result-buttons-row"]}>
                    <MyCooldownButton alignTo="left" CooldownIcon={IoIosCheckmarkCircle} ButtonIcon={RiFileCopy2Fill}
                        cooldownText="COPIED" onClick={onCopyButtonClick} isLoading={isLoading}
                    >
                        COPY
                    </MyCooldownButton>
                    {
                        renderDownloadButtons &&
                        <>
                            <MyCooldownButton alignTo="left" CooldownIcon={IoIosCheckmarkCircle} ButtonIcon={MdDownload}
                                cooldownText="SUCCESS" onClick={onDownloadButtonClick}
                                isLoading={isLoading}
                            >
                                .TXT FILE
                            </MyCooldownButton>
                            <GenerateApkgWithVoiceButton cardArray={cardArray} downloadingFileName={downloadingFileName} isLoading={isLoading} />
                        </>
                    }
                </div>
                <label htmlFor={id}>
                    {label}
                </label>
            </figcaption>
            <div className={classes["text-block__divider"]}>
                <MyDividerLine orientation="horisontal" />
            </div>
            <code id={id}>
                {pipeSeparatedDeck}
            </code>
            <button onClick={toggleIsTextBlockCollapsed} className={collapseButtonClassName} />
        </figure>
    )
}

export default GeneratedDeckTextBlock