import { NavLink } from "react-router-dom";

export const Text = ({ Have, GoTo, nav }) => {
    return (
        <div className='flex gap-[5px] items-center group'>
            <p className='text-[13px] text-[var(--main-color-sub)]'>{Have}</p>
            <NavLink to={nav} className='flex justify-center items-center'>
                <button className='text-[13px] h-fit text-[var(--main-focus)] font-bold group-hover:text-[var(--Font-Nav)] transition-colors duration-300 cursor-pointer'>{GoTo}</button>
            </NavLink>
        </div>
    )
}
export default Text;