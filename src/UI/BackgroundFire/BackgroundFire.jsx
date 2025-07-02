import React, { useState, useEffect, useRef } from 'react';

export const BackgroundFire = ({
    children,
    particleCount = 100,
    intensity = 'medium', // 'low', 'medium', 'high'
    className = '',
    style = {}
}) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef();

    // Configuración basada en intensidad
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
    console.log('FireParticlesBackground se está renderizando');
    const config = getIntensityConfig(intensity);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Ajustar el tamaño del canvas
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Clase Partícula
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Inicializar en posición aleatoria
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

                // Efecto de ondulación
                this.x += Math.sin(this.flicker) * 0.5;

                // Reducir velocidad gradualmente
                this.speedY *= 0.99;
                this.speedX *= 0.99;

                // Resetear partícula cuando se desvanece o sale de pantalla
                if (this.life <= 0 || this.y < -10) {
                    this.reset();
                }
            }

            draw(ctx) {
                ctx.save();

                // Calcular colores basados en la vida de la partícula
                const alpha = this.life;
                const red = Math.floor(255 * Math.min(1, this.life + 0.3));
                const green = Math.floor(100 * this.life);
                const blue = Math.floor(20 * this.life);

                // Crear gradiente radial para efecto de brillo
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 3
                );

                gradient.addColorStop(0, `rgba(${red}, ${green + 50}, ${blue}, ${alpha})`);
                gradient.addColorStop(0.3, `rgba(${red}, ${green}, ${blue}, ${alpha * 0.8})`);
                gradient.addColorStop(1, `rgba(${red * 0.5}, 0, 0, 0)`);

                ctx.fillStyle = gradient;
                ctx.globalCompositeOperation = 'screen';

                // Dibujar la partícula
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Agregar chispa central más brillante
                if (this.life > 0.7) {
                    ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // Inicializar partículas
        particlesRef.current = [];
        for (let i = 0; i < config.count; i++) {
            particlesRef.current.push(new Particle());
        }

        // Función de animación
        const animate = () => {
            // Limpiar canvas completamente para eliminar estelas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Actualizar y dibujar partículas
            particlesRef.current.forEach(particle => {
                particle.update();
                particle.draw(ctx);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
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
            {/* Canvas de fondo */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    background: 'transparent',
                    zIndex: -1
                }}
            />

            {/* Gradiente adicional para mejorar el efecto */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'transparent',
                    zIndex: 0
                }}
            />

            {/* Contenido que se renderiza sobre el fondo */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default BackgroundFire;