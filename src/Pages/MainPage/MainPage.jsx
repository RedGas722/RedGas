import { Header } from "../../Layouts/Header/Header"
import { Hero } from "./Hero/Hero"
import { ProductCategory } from "./ProductCategory/ProductCategory"
import { OffersSect } from "./Offers/Offers"
import { HeatersSect } from "./Heaters/Heaters"
import { ToolsSect } from './Tools/Tools'
import { SpaerPartsSect } from "./SpareParts/SparePart"
import { AccessoriesSect } from "./Accessories/Accessories"
import { useNavigate } from "react-router-dom";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { Footer } from "./Footer/Footer"
import './MainPage.css'
import { jwtDecode } from "jwt-decode"

export const MainPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const tipoUsuario = decoded?.data?.tipo_usuario;
                setIsLoggedIn(true);
                setIsAdmin(tipoUsuario === 1 || tipoUsuario === 3);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, []);


    return (
        <>
            <div className="bg-[var(--background-color)]">
                <Header />
                <div className="MainPageContainer bg-[var(--background-color)] flex flex-col gap-[60px]">
                    <Hero />
                    <ProductCategory />
                    <OffersSect />
                    <section id="AllProduct" className="flex flex-col gap-[60px] ">
                        <HeatersSect />
                        <ToolsSect />
                        <SpaerPartsSect />
                        <AccessoriesSect />
                    </section>
                    <div></div>
                </div>
                {isLoggedIn && !isAdmin && (
                    <div onClick={() => navigate('/Shopping')} className="shopCart flex items-center justify-center cursor-pointer w-14 h-14 fixed bottom-2 rounded-[100px] p-[10px] right-5 bg-[var(--Font-Nav)] z-[5]">
                        <FontAwesomeIcon icon={faCartShopping} className="text-[var(--background-color)] text-2xl" />
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}
export default MainPage