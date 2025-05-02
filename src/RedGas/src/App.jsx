import './index.css';
import Header from "./Layouts/Header/Header";
import Hero from "./Layouts/Hero/Hero";
import ProductCategory from "./Layouts/ProductCategory/ProductCategory";
import OffersSect from "./Layouts/Offers/Offers";
import HeatersSect from "./Layouts/Heaters/Heaters";
import Animations from "./Animations/Animations";

export function App() {
    return (
        <div className="flex flex-col gap-[80px]">
            <Header />
            <Hero />
            <ProductCategory />
            <OffersSect />
            <HeatersSect />
            <Animations />
        </div>
    );
}

export default App;