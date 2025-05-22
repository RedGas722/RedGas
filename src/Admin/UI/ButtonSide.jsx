import { NavLink } from 'react-router-dom';
import './ButtonSide.css'

export const ButtonSide = ({to, children}) => {
    return (
        <div>
            <NavLink to={to} className="hover:text-[var(--Font-Nav)] hover:font-bold w-full">
                <button className="NavsBTN p-[16px_0] NeoContainer_outset_TL w-[100%] h-full flex justify-center items-center cursor-pointer">
                    {children}
                </button>
            </NavLink>
        </div>
    )
}
export default ButtonSide