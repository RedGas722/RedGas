import { useRef, useEffect } from "react"

export const AnimatedDots = () => {
	const canvasRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")

		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		const dots = []
		const dotCount = 100
		const dotRadius = .8
		const fadeSpeed = 0.008

		for (let i = 0; i < dotCount; i++) {
			dots.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				alpha: Math.random(),
				fadingOut: true,
			})
		}

		const drawDots = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			dots.forEach((dot) => {
				ctx.beginPath()
				ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
				ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`
				ctx.fill()

				if (dot.fadingOut) {
					dot.alpha -= fadeSpeed
					if (dot.alpha <= 0) {
						dot.fadingOut = false
						dot.x = Math.random() * canvas.width
						dot.y = Math.random() * canvas.height
					}
				} else {
					dot.alpha += fadeSpeed
					if (dot.alpha >= 1) {
						dot.fadingOut = true
					}
				}
			})

			requestAnimationFrame(drawDots)
		}

		drawDots()

		// Cleanup function for resizing or unmounting
		return () => {
			cancelAnimationFrame(drawDots)
		}
	}, [])

	return(
        <canvas ref={canvasRef} className="z-[-100] fixed w-full flex justify-self-center left-0" />
    ) 
}

export default AnimatedDots
