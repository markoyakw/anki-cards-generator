import { useEffect, useRef, type RefObject } from "react";

function useMousePosition(): RefObject<{ x: number; y: number }> {
    const pos = useRef({ x: 0, y: 0 });
    const pending = useRef(false);

    useEffect(() => {
        function onMove(e: MouseEvent) {
            if (pending.current) return;
            pending.current = true;
            requestAnimationFrame(() => {
                pos.current = { x: e.clientX, y: e.clientY };
                pending.current = false;
            });
        }
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return pos;
}

export default useMousePosition
