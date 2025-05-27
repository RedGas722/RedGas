import { NavLink } from 'react-router-dom';
import './ButtonSide.css'

export const ButtonSide = ({ to, children, imgBtn }) => {
    return (
        <div>
            <NavLink to={to} className="hover:text-[var(--Font-Nav)] gap-2 text-[var(--main-color)] w-full flex flex-col items-center">
                <button className="NavsBTN p-[16px_0] NeoContainer_Admin_outset_TL h-26 w-26 flex justify-center items-center cursor-pointer">
                    <img src={imgBtn} alt={children} className='w-20' />
                </button>
                <span>{children}</span>
            </NavLink>
        </div>
    )
}
export default ButtonSide