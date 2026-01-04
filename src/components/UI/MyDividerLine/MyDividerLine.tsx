import type { FC } from "react"
import classes from "./MyDividerLine.module.css"

type TMyDividerProps = {
    orientation: "horisontal" | "vertical"
}

const MyDividerLine: FC<TMyDividerProps> = ({ orientation }) => {
    return (
        <div className={classes[`divider--${orientation}`]} />
    )
}

export default MyDividerLine