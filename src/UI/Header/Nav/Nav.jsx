import { NavLink } from "react-router-dom";

export const Navs = () => {
    return (
        <div className="flex gap-[10%] flex-wrap text-center justify-center text-[20px] items-center">  
        <NavLink to="/" className="text-[var(--Font-Nav)] font-bold" >Inicio</NavLink>
            <NavLink route="" className="text-white" >Ofertas</NavLink>
            <NavLink route="" className="text-white" >Productos</NavLink> 
            <NavLink route="" className="text-white" >Tecnicos</NavLink> 
        </div>
    )
}

export default Navs;