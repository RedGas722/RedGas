import { NavLink } from 'react-router-dom';
import './ButtonSide.css'

export const ButtonSide = ({to, children}) => {
    return (
        <div>
            <NavLink to={to} className="hover:font-bold w-full">
                <button className="NavsBTN NeoContainer_outset_TL w-[100%] h-full flex justify-center items-center cursor-pointer">
                    {children}
                </button>
            </NavLink>
        </div>
    )
}
export default ButtonSide