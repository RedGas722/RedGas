import './PrincipalSect.css'

export const PrincipalSect = () => {
    return (
        <section id='Principal' className='w-[100%] bg-glass-total rounded-[18px]'>
                <img src="../src/assets/Images/red_gas.webp" alt="RedGas Logo" className='w-[200px] flex'/>
                <div className='text-[20px]'>
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
export default PrincipalSect