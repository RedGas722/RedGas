import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Cursor.css'

export const Cursor = () => {
    const cursorRef = useRef(null)
    const followerRef = useRef(null)
    const requestRef = useRef()
    const pos = useRef({ x: 0, y: 0 })
    const mouse = useRef({ x: 0, y: 0 })
    const speed = 0.15

    useEffect(() => {
        const interactiveSelector = 'a, button, input, [data-cursor-hover], .swiper-slide'

        const isMobile = window.matchMedia('(max-width: 768px)').matches
        if (isMobile) return

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
            console.log("Hover event:", e.type, e.target);
            if (e.type === 'mouseenter' || e.type === 'pointerenter') {
                gsap.to(cursorRef.current, { scale: 0.6, duration: 0.3 })
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.3 })

            } else if (e.type === 'mouseleave' || e.type === 'pointerleave') {
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
            if (
                (e.type === 'pointerenter' || e.type === 'pointerleave' || e.type === 'pointerdown' || e.type === 'pointerup') &&
                e.target &&
                typeof e.target.closest === 'function' &&
                e.target.closest(interactiveSelector)
            ) {
                if (e.type === 'pointerenter') {
                    gsap.to(cursorRef.current, { scale: 0.6, duration: 0.3 })
                    gsap.to(followerRef.current, { scale: 1.1, duration: 0.3 })
                } else if (e.type === 'pointerleave') {
                    gsap.to(cursorRef.current, { scale: 1, duration: 0.3 })
                    gsap.to(followerRef.current, { scale: 1, duration: 0.3 })
                } else if (e.type === 'pointerdown') {
                    gsap.to(cursorRef.current, { scale: 0.4, duration: 0.2, rotate: 15 })
                    gsap.to(followerRef.current, { scale: 0.9, duration: 0.2, rotate: -10 })
                } else if (e.type === 'pointerup') {
                    gsap.to(cursorRef.current, { scale: 0.6, duration: 0.2, rotate: 0 })
                    gsap.to(followerRef.current, { scale: 1.1, duration: 0.2, rotate: 0 })
                }
            }
        }

        const handleGlobalPointerDown = (e) => {
            if (!(e.target && typeof e.target.closest === 'function' && e.target.closest(interactiveSelector))) {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.2, rotate: 0 })
                gsap.to(followerRef.current, { scale: 1.1, duration: 0.2, rotate: 0 })
            }
        }
        const handleGlobalPointerUp = (e) => {
            if (!(e.target && typeof e.target.closest === 'function' && e.target.closest(interactiveSelector))) {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.2, rotate: 0 })
                gsap.to(followerRef.current, { scale: 1, duration: 0.2, rotate: 0 })
            }
        }

        gsap.set([cursorRef.current, followerRef.current], { xPercent: -50, yPercent: -50 })

        window.addEventListener('mousemove', updateCursorPosition)
        window.addEventListener('pointerenter', handleGlobalPointer, true)
        window.addEventListener('pointerleave', handleGlobalPointer, true)

        window.addEventListener('pointerdown', handleGlobalPointer, true)
        window.addEventListener('pointerup', handleGlobalPointer, true)
        window.addEventListener('pointerdown', handleGlobalPointerDown, true)
        window.addEventListener('pointerup', handleGlobalPointerUp, true)

        let attachedButtons = []

        const observeCardsAndAttachListeners = () => {
            const observer = new MutationObserver(() => {
                const buttons = Array.from(document.querySelectorAll('button'))

                // Ignorar si ya están conectados
                const newButtons = buttons.filter(btn => !attachedButtons.includes(btn))

                newButtons.forEach(btn => {
                    btn.addEventListener('pointerenter', handleHover)
                    btn.addEventListener('pointerleave', handleHover)
                    btn.addEventListener('pointerdown', handleActive)
                    btn.addEventListener('pointerup', handleActive)
                })

                attachedButtons.push(...newButtons)
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })

            return observer
        }

        const observer = observeCardsAndAttachListeners()

        requestRef.current = requestAnimationFrame(animateCursor)

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition)
            window.removeEventListener('pointerenter', handleGlobalPointer, true)
            window.removeEventListener('pointerleave', handleGlobalPointer, true)

            window.removeEventListener('pointerdown', handleGlobalPointer, true)
            window.removeEventListener('pointerup', handleGlobalPointer, true)

            window.removeEventListener('pointerdown', handleGlobalPointerDown, true)
            window.removeEventListener('pointerup', handleGlobalPointerUp, true)
            interactiveElements.forEach(el => {
                el.removeEventListener('pointerenter', handleHover)
                el.removeEventListener('pointerleave', handleHover)

                el.removeEventListener('pointerdown', handleActive)
                el.removeEventListener('pointerup', handleActive)
            })
            cancelAnimationFrame(requestRef.current)
        }
    }, [])

    // Renderizado condicional: no mostrar el cursor en móvil
    if (window.matchMedia('(max-width: 768px)').matches) return null

    return (
        <>
            <div
                ref={cursorRef}
                className="custom-cursor"
                style={{
                    position: 'fixed',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#8c8c8c',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'difference',
                    willChange: 'transform',
                }}
            />
            <div
                ref={followerRef}
                className="custom-cursor-follower"
                style={{
                    position: 'fixed',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #b5b5b5',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'difference',
                    willChange: 'transform',
                    transition: 'border 0.2s ease',
                }}
            />
        </>
    )
}

export default Cursor


