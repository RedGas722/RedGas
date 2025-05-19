import './Hero.css'
import Logo from '../../../assets/Images/red_gas.webp'

export const Hero = () => {
    return (
        <section id='Hero' className="p-[15px] w-[100%] NeoContainer_outset_TL text-[var(--main-color)] flex flex-col gap-[20px] justify-center items-center">
            <img src={Logo} alt="RedGas Logo" id='Logo' />
            <div className='text-[20px] flex flex-col gap-[50px]'>
                <div className='flex flex-col items-center justify-center text-center'>
                    <p className='max-w-[810px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi eligendi eius, doloribus voluptas error accusantium in dignissimos, ipsam architecto labore rerum vel cum natus repellat esse beatae nostrum. Ratione, recusandae?</p>
                </div>
                <div className='flex flex-col items-end justify-center'>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt facere quae provident qui reprehenderit dignissimos animi cum.</p>
                    <p>-Pepe</p>
                </div>
            </div>
        </section>
    )
}
export default Hero