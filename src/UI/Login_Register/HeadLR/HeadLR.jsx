import { NavLink } from "react-router-dom";
import { ProfilePhoto } from "../../Header/ProfilePhoto/ProfilePhoto";

export const HeadLR = () => {
    return (
        <div className="flex flex-row gap-[5%] flex-wrap text-center justify-center text-[20px] items-center w-full">
            <NavLink to="/" className="text-[var(--Font-Nav)] font-bold" >Inicio</NavLink>
            <NavLink route="" className="text-white" >Tecnicos</NavLink>
            <ProfilePhoto />
        </div>
    )
}

export default HeadLR