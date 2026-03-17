import type { CSSProperties, ReactNode, RefObject } from "react"

export type TooltipCursorProps = {
    content: ReactNode
    children: ReactNode
    offset?: number
    enterDelay?: number
    leaveDelay?: number
    disabled?: boolean
    className?: string
    style?: CSSProperties
}

export type BubbleProps = {
    content: ReactNode
    mousePos: RefObject<{ x: number; y: number }>
    anchorRef: RefObject<HTMLDivElement | null>
    visible: boolean
    offset: number
}