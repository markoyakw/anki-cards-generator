import { type FC } from 'react'
import classes from "./MyError.module.css"

type TMyErrorProps = {
    children?: string
}

const MyError: FC<TMyErrorProps> = ({ children }) => {
    if (!children) return <></>
    return (
        <div className={classes["error"]}>{children}</div>
    )
}

export default MyError