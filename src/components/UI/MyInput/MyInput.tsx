import { type FC, type InputHTMLAttributes } from 'react'
import classes from "./MyInput.module.css"

type MyInputProps = InputHTMLAttributes<HTMLInputElement>

const MyInput: FC<MyInputProps> = ({ ...props }) => {
    return (
        <input className={classes["input"]} {...props} />
    )
}

export default MyInput