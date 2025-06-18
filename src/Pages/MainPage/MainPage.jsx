import { Header } from "../../Layouts/Header/Header"
import { Hero } from "./Hero/Hero"
import { ProductCategory } from "./ProductCategory/ProductCategory"
import { OffersSect } from "./Offers/Offers"
import { HeatersSect } from "./Heaters/Heaters"
import { ToolsSect } from './Tools/Tools'
import { SpaerPartsSect } from "./SpareParts/SparePart"
import { AccessoriesSect } from "./Accessories/Accessories"
import { Footer } from "./Footer/Footer"
import './MainPage.css'

export const MainPage = () => {
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
            </div>
            <Footer />
        </>
    )
}
export default MainPage