import { Header } from "../../Layouts/Header/Header"
import { Hero } from "./Hero/Hero"
import { ProductCategory } from "./ProductCategory/ProductCategory"
import { OffersSect } from "./Offers/Offers"
import { HeatersSect } from "./Heaters/Heaters"
import { ToolsSect } from './Tools/Tools'
import { SpaerPartsSect } from "./SpareParts/SparePart"
import { AccessoriesSect } from "./Accessories/Accessories"
import { ShopCart } from "../../UI/ShopCart/ShopCart"
import './MainPage.css'

export const MainPage = () => {
    return (
        <div className="MainPageContainer flex flex-col gap-[50px]">
            <Header />
            <Hero />
            <ProductCategory />
            <OffersSect />
            <HeatersSect />
            <ToolsSect />
            <SpaerPartsSect />
            <AccessoriesSect />
            <ShopCart />
        </div>
    )
}
export default MainPage