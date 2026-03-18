import { type CSSProperties, type FC } from 'react'
import { BsFillPatchQuestionFill } from 'react-icons/bs'
import MyLink from '../../UI/MyLink/MyLink'
import classes from "./ApiKeyManager.module.css"
import TooltipCursor from '../../UI/MyTooltipCursor/MyTooltipCursor'
import useSensorScreen from '../../../hooks/useIsSensorScreen'

const ApiKeyTip: FC = () => {

    const isOnSensorScreen = useSensorScreen()

    const cursorBubbleContent = <>
        <div>This app needs an API-key</div>
        <div>You can grab it for free!</div>
    </>

    return (
        <TooltipCursor disabled={isOnSensorScreen} content={cursorBubbleContent}>
            <div className={classes["key-manager__tip-container"]}>
                <span style={{ animation: "color-change 7s linear infinite" } as CSSProperties}
                    className={classes["key-manager__tip-questionmark-icon"]}
                >
                    <BsFillPatchQuestionFill />
                </span>
                &nbsp;
                <MyLink href="https://aistudio.google.com/api-keys" newTab>
                    get a Google Studio AI API key
                </MyLink>
            </div>
        </TooltipCursor>
    )
}

export default ApiKeyTip