import { type ButtonHTMLAttributes, type FC, type ReactNode } from 'react'
import classes from "./MyButton.module.css"

type TMyButtonProps = {
    children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const MyButton: FC<TMyButtonProps> = ({ children, ...props }) => {
    return (
        <button className={classes["button"]} {...props}>
            {children}
        </button>
    )
}

export default MyButton