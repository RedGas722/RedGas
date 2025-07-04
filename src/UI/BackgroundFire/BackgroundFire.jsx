import React, { useState, useEffect, useRef } from 'react';

export const BackgroundFire = ({
    children,
    particleCount = 100,
    intensity = 'medium',
    className = '',
    style = {}
}) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef();

    const getIntensityConfig = (intensity) => {
        switch (intensity) {
            case 'low':
                return { count: particleCount * 0.5, speed: 0.5, size: 0.7 };
            case 'high':
                return { count: particleCount * 0.5, speed: 1.5, size: 0.7 };
            default:
                return { count: particleCount, speed: 1, size: 1 };
        }
    };
    const config = getIntensityConfig(intensity);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; 
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 10;
                this.size = (Math.random() * 4 + 1) * config.size;
                this.speedY = (Math.random() * 3 + 1) * config.speed;
                this.speedX = (Math.random() - 0.5) * 2;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.005;
                this.flicker = Math.random();
            }

            update() {
                this.x += this.speedX;
                this.y -= this.speedY;
                this.life -= this.decay;
                this.flicker += 0.1;

                this.x += Math.sin(this.flicker) * 0.5;

                this.speedY *= 0.99;
                this.speedX *= 0.99;

                if (this.life <= 0 || this.y < -10) {
                    this.reset();
                }
            }

            draw(ctx) {
                ctx.save();

                const alpha = this.life;
                const red = Math.floor(255 * Math.min(1, this.life + 0.3));
                const green = Math.floor(100 * this.life);
                const blue = Math.floor(20 * this.life);

                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 3
                );

                gradient.addColorStop(0, `rgba(${red}, ${green + 50}, ${blue}, ${alpha})`);
                gradient.addColorStop(0.3, `rgba(${red}, ${green}, ${blue}, ${alpha * 0.8})`);
                gradient.addColorStop(1, `rgba(${red * 0.5}, 0, 0, 0)`);

                ctx.fillStyle = gradient;
                ctx.globalCompositeOperation = 'screen';

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                if (this.life > 0.7) {
                    ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        particlesRef.current = [];
        for (let i = 0; i < config.count; i++) {
            particlesRef.current.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(particle => {
                particle.update();
                particle.draw(ctx);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [config.count, config.speed, config.size]);

    return (
        <div
            className={`relative w-full h-full ${className}`}
            style={style}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    background: 'transparent',
                    zIndex: -1
                }}
            />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'transparent',
                    zIndex: 0
                }}
            />

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default BackgroundFire;