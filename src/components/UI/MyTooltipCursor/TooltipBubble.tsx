import { useRef, useLayoutEffect, type FC } from "react"
import { createPortal } from "react-dom"
import type { BubbleProps } from "./MyTooltipCursorTypes"
import classes from "./MyTooltipCursor.module.css"

const VIEWPORT_PADDING = 8; // safe distance from viewport edges

const TooltipBubble: FC<BubbleProps> = ({
    content,
    mousePos,
    anchorRef,
    visible,
    offset,
}) => {
    const bubbleRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    // Run a loop when visible to reposition the bubble
    useLayoutEffect(() => {
        if (!visible) return;

        function tick() {
            const el = bubbleRef.current;
            if (!el) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            const bw = el.offsetWidth
            const bh = el.offsetHeight
            const vw = window.innerWidth
            const vh = window.innerHeight

            let x = 0;
            let y = 0;

            const halfVw = vw / 2;
            if (mousePos.current.x < halfVw) {
                // cursor on left = tooltip to the right
                x = mousePos.current.x + offset;
            } else {
                // cursor on right = tooltip to the left
                x = mousePos.current.x - bw - offset;
            }

            y = mousePos.current.y - bh / 2;

            // set position to viewport + padding when near
            x = Math.max(VIEWPORT_PADDING, Math.min(x, vw - bw - VIEWPORT_PADDING))
            y = Math.max(VIEWPORT_PADDING, Math.min(y, vh - bh - VIEWPORT_PADDING))

            el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`
            rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        };
    }, [visible, offset, mousePos, anchorRef])

    return createPortal(
        <div
            ref={bubbleRef}
            role="tooltip"
            aria-hidden={!visible}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 99999,
                willChange: "transform, opacity",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.12s ease",
            }}
        >
            <div className={classes["tooltip-bubble"]}>
                {content}
            </div>
        </div>,
        document.body
    );
};

export default TooltipBubble