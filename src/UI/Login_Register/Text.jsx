import { NavLink } from "react-router-dom";

export const Text = ({ Have, GoTo, nav }) => {
    return (
        <div className='flex gap-[5px] items-center'>
            <p className='text-[13px] text-gray-300'>{Have}</p>
            <NavLink to={nav} className='flex justify-center items-center'>
                <button className='text-[13px] h-fit text-white font-bold cursor-pointer'>{GoTo}</button>
            </NavLink>
        </div>
    )
}
export default Text;