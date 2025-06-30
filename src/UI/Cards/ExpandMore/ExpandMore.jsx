import { useRef, useState, useEffect } from "react";

export const ExpandMore = ({ text = '', swiperRef }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
        }
    }, [text]);

    const toggleExpanded = (e) => {
        e.stopPropagation();
        setExpanded((prev) => {
            const next = !prev;
            // 👇 Llama al updateAutoHeight de Swiper cuando se cambia
            setTimeout(() => {
                swiperRef?.current?.updateAutoHeight?.();
            }, 50);
            return next;
        });
    };

    return (
        <div>
            <div
                ref={textRef}
                className={`card-subtitle ${expanded ? '' : 'short-description'}`}
            >
                {text || "Sin descripción disponible."}
            </div>

            {isOverflowing && (
                <button
                    className="text-blue-500 text-xs mt-1 hover:underline"
                    onClick={toggleExpanded}
                >
                    {expanded ? "Ver menos" : "Ver más"}
                </button>
            )}
        </div>
    );
};

export default ExpandMore;
