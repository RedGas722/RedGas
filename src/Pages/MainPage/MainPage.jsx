import { Header } from "../../Layouts/Header/Header"
import { Hero } from "./Hero/Hero"
import { ProductCategory } from "./ProductCategory/ProductCategory"
import { OffersSect } from "./Offers/Offers"
import { HeatersSect } from "./Heaters/Heaters"
import { ToolsSect } from './Tools/Tools'
import { Circles } from "../../Animations/ColorCircles/Circles"

export const MainPage = () => {
    return (
        <>
            <Circles styleC1="left-[30%] bottom-0" styleC2="top-[100px]" styleC3="top-[400px] right-[80px]" />
            <Header />
            <Hero />
            <ProductCategory />
            <OffersSect />
            <HeatersSect />
            <ToolsSect />
        </>
    )
}
export default MainPage