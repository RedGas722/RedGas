import './Nav.css'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-scroll'
import { useEffect, useState } from "react"

export const Navs = ({ className, ref1, ref2, ref3, ref4 }) => {
    const [active, setActive] = useState("Header")
    const [tipoUsuario, setTipoUsuario] = useState(null)

    useEffect(() => {
        setActive("Header")
        const tipo = localStorage.getItem('tipo_usuario')
        setTipoUsuario(tipo ? parseInt(tipo) : null)
    }, [])

    const getLinkClass = (id) =>
        `text-[var(--main-color)] cursor-pointer transition-colors duration-300 ${
            active === id ? '!text-[var(--Font-Nav2)] font-bold' : ''
        }`

    return (
        <div className={`flex gap-[15px] flex-col md:flex-wrap md:flex-row text-center justify-center items-center text-[15px] ${className}`}>
            <span ref={ref1}>
                <Link
                    to="Hero"
                    smooth={true}
                    duration={500}
                    id="HomeLink"
                    className={`${getLinkClass("Hero")} NeoSubContainer_outset_TL p-[5px_10px]`}
                    activeClass="!text-[var(--Font-Nav2)] font-bold"
                    spy={true}
                    onSetActive={() => setActive("Hero")}
                >
                    Inicio
                </Link>
            </span>
            <span ref={ref2}>
                <Link
                    to="ProductCategory"
                    smooth={true}
                    duration={500}
                    className={`${getLinkClass("ProductCategory")} NeoSubContainer_outset_TL p-[5px_10px]`}
                    activeClass="!text-[var(--Font-Nav2)] font-bold"
                    spy={true}
                    onSetActive={() => setActive("ProductCategory")}
                >
                    Productos
                </Link>
            </span>
            <span ref={ref3}>
                <Link
                    to="OffersSect"
                    smooth={true}
                    duration={500}
                    className={`${getLinkClass("OffersSect")} NeoSubContainer_outset_TL p-[5px_10px]`}
                    activeClass="!text-[var(--Font-Nav2)] font-bold"
                    spy={true}
                    onSetActive={() => setActive("OffersSect")}
                >
                    Ofertas
                </Link>
            </span>
            <NavLink
                ref={ref4}
                to="/Technic"
                className='NeoSubContainer_outset_TL p-[5px_10px]'
            >
                Técnicos
            </NavLink>

            {/* Mostrar solo si está logueado como admin o empleado */}
            {(tipoUsuario === 1 || tipoUsuario === 3) && (
                <NavLink to="/Admin" 
                className='NeoSubContainer_outset_TL p-[5px_10px]'
                >
                    Admin
                </NavLink>
            )}
            
            {/* Mostrar solo si está logueado como tecnico */}
            {(tipoUsuario === 4 ) && (
                <NavLink to="/Services" 
                className='NeoSubContainer_outset_TL p-[5px_10px]'
                >
                    Servi
                </NavLink>
            )}
        </div>
    )
}

export default Navs
