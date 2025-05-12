import { Header } from "../../Layouts/Header/Header"
import { Hero } from "./Hero/Hero"
import { ProductCategory } from "./ProductCategory/ProductCategory"
import { OffersSect } from "./Offers/Offers"
import { HeatersSect } from "./Heaters/Heaters"
import { ToolsSect } from './Tools/Tools'
import { ShopCart } from "../../UI/ShopCart/ShopCart"
import { Circles } from "../../Animations/ColorCircles/Circles"
import { AnimatedDots } from "../../Animations/AnimatedDots/AnimatedDots"
import './MainPage.css'

export const MainPage = () => {
    return (
        <div className="MainPageContainer flex flex-col gap-[80px]">  
            <AnimatedDots />
            <Circles styleC1="left-[30%] bottom-0" styleC2="top-[100px]" styleC3="top-[400px] right-[80px]" />
            <Header />
            <Hero />
            <ProductCategory />
            <OffersSect />
            <HeatersSect />
            <ToolsSect />
            <ShopCart />
        </div>
    )
}
export default MainPage