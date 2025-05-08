import './Nav.css'
import { Link } from 'react-scroll'
import { useEffect, useState } from "react"

export const Navs = () => {
    const [active, setActive] = useState("Header")

    useEffect(() => {
        setActive("Header")
    }, [])

    const getLinkClass = (id) =>
        `text-white cursor-pointer transition-colors duration-300 ${active === id ? '!text-[var(--Font-Nav)] font-bold' : ''
        }`

    return (
        <div className="flex gap-[10%] flex-wrap text-center justify-center text-[20px] items-center">
            <Link
                to="Hero"
                smooth={true}
                duration={500}
                id="HomeLink"
                className={getLinkClass("Header")}
                activeClass="!text-[var(--Font-Nav)] font-bold"
                spy={true}
                onSetActive={() => setActive("Header")}
            >
                Inicio
            </Link>
            <Link
                to="ProductCategory"
                smooth={true}
                duration={500}
                className={getLinkClass("ProductCategory")}
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
                className={getLinkClass("OffersSect")}
                activeClass="!text-[var(--Font-Nav)] font-bold"
                spy={true}
                onSetActive={() => setActive("OffersSect")}
            >
                Ofertas
            </Link>
            <Link
                to="HeatersSect"
                smooth={true}
                duration={500}
                className={getLinkClass("HeatersSect")}
                activeClass="!text-[var(--Font-Nav)] font-bold"
                spy={true}
                onSetActive={() => setActive("HeatersSect")}
            >
                Técnicos
            </Link>
        </div>
    )
}
export default Navs