import './LR.css'

export const Buttons = ({nameButton, Onclick, Type}) => {
    return (
        <div className='group'>
            <button onClick={Onclick} type={Type} className='buttonTL group-hover:text-[var(--Font-Nav)] font-semibold p-[5px_70px] text-[var(--main-color)] w-fit NeoSubContainer_outset_TL cursor-pointer'>{nameButton}</button>
        </div>
    )
}
export default Buttons