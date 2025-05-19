import { NavLink } from 'react-router-dom';
import './ButtonSide.css'

export const ButtonSide = ({to, children}) => {
    return (
        <div>
<<<<<<< HEAD
            <NavLink to={to} className="hover:font-bold w-full">
                <button className="NavsBTN NeoContainer_outset_TL w-[100%] h-full flex justify-center items-center cursor-pointer">
=======
            <NavLink to={to} className="hover:text-[var(--Font-Nav)] hover:font-bold w-full">
                <button className="NavsBTN p-[16px_0] NeoContainer_outset_TL w-[100%] h-full flex justify-center items-center cursor-pointer">
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
                    {children}
                </button>
            </NavLink>
        </div>
    )
}
export default ButtonSide