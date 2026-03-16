import { useId, type FC, type InputHTMLAttributes } from 'react'
import classes from "./MyInput.module.css"

type MyInputProps = InputHTMLAttributes<HTMLInputElement> & {
    id?: string,
    label?: string
}

const MyInput: FC<MyInputProps> = ({ id, label, ...props }) => {

    const generatedId = useId()
    const inputId = id || generatedId
    const value = props.value

    return (
        <div className={classes["input__container"]}>
            <input id={inputId} className={classes["input"]} {...props} value={value || ""} placeholder='' autoComplete='off' />
            {label &&
                <label className={classes["input__label"]} htmlFor={inputId}>
                    {label}
                </label>
            }
        </div>
    )
}

export default MyInput