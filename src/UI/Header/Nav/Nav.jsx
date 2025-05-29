import './Nav.css'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-scroll'
import { useEffect, useState } from "react"

export const Navs = ({ className }) => {
    const [active, setActive] = useState("Header")

    useEffect(() => {
        setActive("Header")
    }, [])

    const getLinkClass = (id) =>
        `text-[var(--main-color)] cursor-pointer transition-colors duration-300 ${active === id ? '!text-[var(--Font-Nav2)] font-bold' : ''
        }`

    return (
        <div className={`flex gap-[15px] flex-col md:flex-wrap md:flex-row text-center justify-center items-center text-[20px] ${className}`}>
            <Link
                to="Hero"
                smooth={true}
                duration={500}
                id="HomeLink"
                className={`${getLinkClass("Hero")} NeoSubContainer_outset_TL p-[5px_10px]`}
                activeClass="!text-[var(--Font-Nav)] font-bold"
                spy={true}
                onSetActive={() => setActive("Hero")}
            >
                Inicio
            </Link>
            <Link
                to="ProductCategory"
                smooth={true}
                duration={500}
                className={`${getLinkClass("ProductCategory")} NeoSubContainer_outset_TL p-[5px_10px]`}
                activeClass="!text-[var(--Font-Nav)] font-bold"
                spy={true}
                onSetActive={() => setActive("ProductCategory")}
            >
                Productos
            </Link>
            <Link
                to="OffersSect"
                smooth={true}
                duration={500}
                className={`${getLinkClass("OffersSect")} NeoSubContainer_outset_TL p-[5px_10px]`}
                activeClass="!text-[var(--Font-Nav)] font-bold"
                spy={true}
                onSetActive={() => setActive("OffersSect")}
            >
                Ofertas
            </Link>
            <NavLink
                to="/Technic"
                className='NeoSubContainer_outset_TL p-[5px_10px]'
            >
                Técnicos
            </NavLink>
            <NavLink to="/Admin">
                Admin
            </NavLink>
             <NavLink to="/Costumer">
                Cliente
            </NavLink>
             <NavLink to="/Services">
                Servicios
            </NavLink>
        </div>
    )
}
export default Navs