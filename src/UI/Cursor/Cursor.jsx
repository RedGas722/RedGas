import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const Cursor = () => {
    const cursorRef = useRef(null)
    const followerRef = useRef(null)
    const requestRef = useRef()
    const pos = useRef({ x: 0, y: 0 })
    const mouse = useRef({ x: 0, y: 0 })
    const speed = 0.15 // Controla la suavidad del seguimiento (0.1 - 0.3)

    useEffect(() => {
        const interactiveSelector = 'a, button, input, [data-cursor-hover]';
        const updateCursorPosition = (e) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
        }

        const animateCursor = () => {
            pos.current.x += (mouse.current.x - pos.current.x) * speed
            pos.current.y += (mouse.current.y - pos.current.y) * speed

            gsap.set(cursorRef.current, {
                x: mouse.current.x,
                y: mouse.current.y,
            })

            gsap.set(followerRef.current, {
                x: pos.current.x,
                y: pos.current.y,
            })

            requestRef.current = requestAnimationFrame(animateCursor)
        }

        const handleHover = (e) => {
            if (e.type === 'mouseenter') {
                gsap.to(cursorRef.current, { scale: 0.6, duration: 0.3 })
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.3 })
            } else if (e.type === 'mouseleave') {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.3 })
                gsap.to(followerRef.current, { scale: 1, duration: 0.3 })
            } else if (e.type === 'mousedown' || e.type === 'pointerdown') {
                gsap.to(cursorRef.current, { scale: 0.4, duration: 0.2, rotate: 15 })
                gsap.to(followerRef.current, { scale: 0.9, duration: 0.2, rotate: -10 })
            } else if (e.type === 'mouseup' || e.type === 'pointerup') {
                gsap.to(cursorRef.current, { scale: 0.6, duration: 0.2, rotate: 0 })
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.2, rotate: 0 })
            }
        }

        const handleActive = (e) => {
            if (e.type === 'mousedown' || e.type === 'pointerdown') {
                gsap.to(cursorRef.current, { scale: 0.4, duration: 0.2, rotate: 15 })
                gsap.to(followerRef.current, { scale: 0.9, duration: 0.2, rotate: -10 })
            } else if (e.type === 'mouseup' || e.type === 'pointerup') {
                gsap.to(cursorRef.current, { scale: 0.6, duration: 0.2, rotate: 0 })
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.2, rotate: 0 })
            }
        }

        // Delegación global robusta con pointer events
        const handleGlobalPointer = (e) => {
            if (e.type === 'pointerenter' && e.target.closest(interactiveSelector)) {
                gsap.to(cursorRef.current, { scale: 0.6, duration: 0.3 });
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.3 });
            } else if (e.type === 'pointerleave' && e.target.closest(interactiveSelector)) {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
                gsap.to(followerRef.current, { scale: 1, duration: 0.3 });
            } else if (e.type === 'pointerdown' && e.target.closest(interactiveSelector)) {
                gsap.to(cursorRef.current, { scale: 0.4, duration: 0.2, rotate: 15 });
                gsap.to(followerRef.current, { scale: 0.9, duration: 0.2, rotate: -10 });
            } else if (e.type === 'pointerup' && e.target.closest(interactiveSelector)) {
                gsap.to(cursorRef.current, { scale: 0.6, duration: 0.2, rotate: 0 });
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.2, rotate: 0 });
            }
        };

        // Evento global para clicks fuera de interactivos
        const handleGlobalPointerDown = (e) => {
            if (!e.target.closest(interactiveSelector)) {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.2, rotate: 0 });
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.2, rotate: 0 });
            }
        };
        const handleGlobalPointerUp = (e) => {
            if (!e.target.closest(interactiveSelector)) {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.2, rotate: 0 });
                gsap.to(followerRef.current, { scale: 1, duration: 0.2, rotate: 0 });
            }
        };

        gsap.set([cursorRef.current, followerRef.current], { xPercent: -50, yPercent: -50 })

        window.addEventListener('mousemove', updateCursorPosition)
        window.addEventListener('pointerenter', handleGlobalPointer, true);
        window.addEventListener('pointerleave', handleGlobalPointer, true);
        window.addEventListener('pointerdown', handleGlobalPointer, true);
        window.addEventListener('pointerup', handleGlobalPointer, true);
        window.addEventListener('pointerdown', handleGlobalPointerDown, true);
        window.addEventListener('pointerup', handleGlobalPointerUp, true);

        const interactiveElements = document.querySelectorAll(interactiveSelector)
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleHover)
            el.addEventListener('mouseleave', handleHover)
            el.addEventListener('mousedown', handleActive)
            el.addEventListener('mouseup', handleActive)
        })

        requestRef.current = requestAnimationFrame(animateCursor)

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition)
            window.removeEventListener('pointerenter', handleGlobalPointer, true);
            window.removeEventListener('pointerleave', handleGlobalPointer, true);
            window.removeEventListener('pointerdown', handleGlobalPointer, true);
            window.removeEventListener('pointerup', handleGlobalPointer, true);
            window.removeEventListener('pointerdown', handleGlobalPointerDown, true);
            window.removeEventListener('pointerup', handleGlobalPointerUp, true);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleHover)
                el.removeEventListener('mouseleave', handleHover)
                el.removeEventListener('mousedown', handleActive)
                el.removeEventListener('mouseup', handleActive)
            })
            cancelAnimationFrame(requestRef.current)
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--main-color-sub)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'difference',
                    willChange: 'transform'
                }}
            />
            <div
                ref={followerRef}
                style={{
                    position: 'fixed',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '1px solid var(--main-color-sub)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform',
                    transition: 'border 0.2s ease'
                }}
            />
        </>
    )
}

export default Cursor


