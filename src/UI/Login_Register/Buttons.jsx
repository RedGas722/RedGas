import './LR.css'

export const Buttons = ({nameButton, Onclick, Type}) => {
    return (
        <>
            <button onClick={Onclick} type={Type} className='buttonRL w-fit bg-white text-2xl text-black rounded-[100px] cursor-pointer'>{nameButton}</button>
        </>
    )
}
export default Buttons