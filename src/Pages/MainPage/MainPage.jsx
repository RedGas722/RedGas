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

export const MainPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
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
                {isLoggedIn && (
                    <div onClick={() => navigate('/Shopping')} className="w-10 h-10 fixed bottom-2 rounded-[100px] p-[10px] right-5 bg-[var(--Font-Nav)] z-[5]"><FontAwesomeIcon icon={faCartShopping} className="text-[var(--main-color)]" /></div>
                )}
            </div>
            <Footer />
        </>
    )
}
export default MainPage