import { useCallback, useEffect, useRef, useState, type FC } from "react";
import type { TooltipCursorProps } from "./MyTooltipCursorTypes";
import useMousePosition from "./useMousePosition";
import TooltipBubble from "./TooltipBubble";

export const TooltipCursor: FC<TooltipCursorProps> = ({
    content,
    children,
    offset = 12,
    enterDelay = 0,
    leaveDelay = 0,
    disabled = false,
    className,
    style,
}) => {
    const [visible, setVisible] = useState(false)
    const mousePosition = useMousePosition()
    const anchorRef = useRef<HTMLDivElement>(null)
    const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearTimers = useCallback(() => {
        if (enterTimer.current !== null) clearTimeout(enterTimer.current)
        if (leaveTimer.current !== null) clearTimeout(leaveTimer.current)
    }, []);

    const handleEnter = useCallback(() => {
        if (disabled) return;
        clearTimers()
        enterTimer.current = setTimeout(() => setVisible(true), enterDelay)
    }, [disabled, clearTimers, enterDelay])

    const handleLeave = useCallback(() => {
        clearTimers()
        leaveTimer.current = setTimeout(() => setVisible(false), leaveDelay)
    }, [clearTimers, leaveDelay])

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const hide = () => {timer = setTimeout(() => setVisible(false), 100)}

        document.addEventListener("visibilitychange", hide)

        return () => {
            document.removeEventListener("visibilitychange", hide)
            clearTimeout(timer)
        }
    }, [])

    // Cleanup timers on unmount
    useEffect(() => () => clearTimers(), [clearTimers])

    return (
        <>
            <div
                ref={anchorRef}
                className={className}
                style={{ display: "inline-block", ...style }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
            >
                {children}
            </div>

            <TooltipBubble
                content={content}
                mousePos={mousePosition}
                anchorRef={anchorRef}
                visible={visible}
                offset={offset}
            />
        </>
    );
};

export default TooltipCursor;