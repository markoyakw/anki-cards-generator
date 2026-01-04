import { useEffect, useRef, type FC, type TextareaHTMLAttributes } from 'react'
import classes from "./MyTextarea.module.css"

type MyTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const MyTextarea: FC<MyTextareaProps> = (props) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const calculateTextareaSize = () => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = "100%"
        textarea.style.height = textarea.scrollHeight + "px";
    }

    const onInput = () => {
        calculateTextareaSize()
    }

    useEffect(() => {
        window.addEventListener("resize", calculateTextareaSize)
        return () => window.removeEventListener("resize", calculateTextareaSize)
    }, [])

    return (
        <textarea ref={textareaRef} {...props} className={classes["textarea"]} onInput={onInput} />
    )
}

export default MyTextarea