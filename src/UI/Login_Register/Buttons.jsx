import './LR.css'

export const Buttons = ({nameButton, Onclick, Type}) => {
    return (
        <>
            <button onClick={Onclick} type={Type} className='buttonTL p-[5px_70px] text-[var(--main-color)] w-fit NeoSubContainer_outset_TL cursor-pointer'>{nameButton}</button>
        </>
    )
}
export default Buttons