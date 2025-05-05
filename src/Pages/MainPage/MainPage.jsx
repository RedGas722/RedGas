import Hero from "./Hero/Hero"
import ProductCategory from "./ProductCategory/ProductCategory"
import OffersSect from "./Offers/Offers"
import HeatersSect from "./Heaters/Heaters"
import ToolsSect from './Tools/Tools'

export const MainPage = () => {
    return (
        <>
            <Hero />
            <ProductCategory />
            <OffersSect />
            <HeatersSect />
            <ToolsSect />
        </>
    )
}
export default MainPage