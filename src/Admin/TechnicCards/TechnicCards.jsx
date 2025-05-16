import './TechnicCards.css'

export const Technicians = () => {
    return (
        <section className='h-[95%] flex flex-wrap justify-center justify-self-center self-center items-center gap-[20px]'>
            <div className="flex gap-[20px] NeoContainer_outset_BR">
                <div>
                    <img src="https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg" alt="John Doe" className="w-[200px] rounded-l-[20px]" />
                </div>
                <div className="Info flex flex-col justify-center font-bold gap-[20px]">
                    <h3 className="text-gray-500">Técnico</h3>
                    <h2 className="text-2xl max-w-[250px]">Mary Michel Hauck Yost</h2>
                    <div className="flex gap-[3px] text-amber-500 text-[18px]">
                        <p className='Points'>4.5</p>
                        <p className="text-black">/</p>
                        <p className='Points'>5</p>
                    </div>
                    <button className='BTN NeoContainer_outset_BR w-full cursor-pointer'>Contactar</button>
                </div>
            </div>
        </section>
    )
}
export default Technicians