import { type ButtonHTMLAttributes, type FC, type ReactNode } from 'react'
import classes from "./MyButton.module.css"

type TMyButtonProps = {
    children: ReactNode,
    loading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const MyButton: FC<TMyButtonProps> = ({ children, loading, ...props }) => {

    const className = `${classes["button"]} ${loading && classes["button--loading"]}`
    return (
        <button className={className} {...props}>
            {loading
                ? ""
                : children
            }
        </button>
    )
}

export default MyButton