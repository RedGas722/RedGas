import './Hero.css'
import Logo from '../../../assets/Images/red_gas.webp'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const Hero = () => {
    const sectionRef = useRef(null)
    const logoRef = useRef(null)
    const titleRef = useRef(null)
    const paragraph1Ref = useRef(null)
    const paragraph2Ref = useRef(null)
    const quoteRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.in', duration: 0.6 } })

        tl.fromTo(
            sectionRef.current,
            { scale: 0.92 },
            { scale: 1}
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
            .fromTo(
                paragraph2Ref.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1 },
                "-=0.5"
            )
            .fromTo(
                quoteRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1 },
                "-=0.6"
            )
    }, [])

    return (
        <section
            ref={sectionRef}
            id='Hero'
            className="SectHero p-[15px] w-full NeoContainer_outset_TL text-[var(--main-color)] flex flex-col gap-[20px] justify-center items-center"
        >
            <img ref={logoRef} src={Logo} alt="RedGas Logo" className='Logo' />
            <h1 ref={titleRef} className='text-6xl text-center font-bold text-[var(--Font-Nav)]'>RedGas</h1>
            <div className='text-[20px] flex flex-col gap-[50px]'>
                <div ref={paragraph1Ref} className='flex flex-col items-center justify-center text-center'>
                    <p className='max-w-[810px]'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi eligendi eius, doloribus voluptas error accusantium in dignissimos, ipsam architecto labore rerum vel cum natus repellat esse beatae nostrum. Ratione, recusandae?
                    </p>
                </div>
                <div ref={paragraph2Ref} className='flex flex-col items-end justify-center text-right'>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt facere quae provident qui reprehenderit dignissimos animi com.
                    </p>
                    <span ref={quoteRef}>-Pepe</span>
                </div>
            </div>
        </section>
    )
}
export default Hero