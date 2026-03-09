import React, { useEffect, useRef, type FC, type TextareaHTMLAttributes } from 'react'
import classes from "./MyTextarea.module.css"

type MyTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    isError?: boolean
}

const MyTextarea: FC<MyTextareaProps> = React.memo(({ isError, ...props }) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const className = `${classes["textarea"]} ${isError && classes["textarea--error"]}`

    const calculateTextareaSize = () => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = "100%"
        textarea.style.height = textarea.scrollHeight + "px";
    }

    //recalculating an textArea size on rerender instead of on input because a change of
    //nearby components can effect it's size that will be fixed only on the next input
    useEffect(() => {
        calculateTextareaSize()
    })

    useEffect(() => {
        window.addEventListener("resize", calculateTextareaSize)
        return () => window.removeEventListener("resize", calculateTextareaSize)
    }, [])

    return (
        <textarea {...props} ref={textareaRef} className={className} />
    )
})

export default MyTextarea