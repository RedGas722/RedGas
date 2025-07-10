import './Hero.css'
import Logo from '../../../assets/Images/Redgas.webp'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const Hero = () => {
    const sectionRef = useRef(null)
    const logoRef = useRef(null)
    const titleRef = useRef(null)
    const paragraph1Ref = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.in', duration: 0.6 } })

        tl.fromTo(
            sectionRef.current,
            { scale: 0.92, reversed: true, opacity: 0 },
            { scale: 1, opacity: 1 }
        )
            .fromTo(
                logoRef.current,
                { scale: 0.5, opacity: 0.5 },
                { scale: 1, opacity: 1 }
            )
            .fromTo(
                titleRef.current,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1 },
                "-=0.5"
            )
            .fromTo(
                paragraph1Ref.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1 },
                "-=0.4"
            )
    }, [])

    return (
        <section
            ref={sectionRef}
            id='Hero'
            className="z-[2] SectHero p-[30px_0_30px_0] !rounded-[40px] w-full NeoContainer_outset_TL text-[var(--main-color)] flex flex-col gap-[20px] justify-center items-center"
        >
            <img ref={logoRef} src={Logo} alt="RedGas Logo" className='Logo' />
            <h1 ref={titleRef} className='text-5xl sm:text-6xl text-center font-bold text-[var(--Font-Nav)]'>RedGas</h1>
            <div className='text-[20px] flex flex-col gap-[50px]'>
                <div ref={paragraph1Ref} className='flex flex-col items-center justify-center text-center'>
                    <p className='text-[15px] sm:text-[18px] max-w-[810px]'>   
                    <span className='text-[var(--Font-Nav)]'>Compromiso, calidad y confianza en cada servicio. </span>Somos un equipo de expertos en equipos a gas, comprometidos con la excelencia, la seguridad y la satisfacción de nuestros clientes. Nuestra integridad y profesionalismo nos permiten ofrecer soluciones eficientes y confiables, brindando la tranquilidad que mereces en tu hogar o negocio.
                    </p>
                </div>
            </div>
        </section>
    )
}
export default Hero