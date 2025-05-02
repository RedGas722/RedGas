import './index.css'
import Header from "./Layouts/Header/Header"
import './index.css'
// import Cards from "./UI/Cards/Cards" 
import Hero from "./Layouts/Hero/Hero"
import ProductCategory from "./Layouts/ProductCategory/ProductCategory"
import OffersSect from "./Layouts/Offers/Offers"
import HeatersSect from "./Layouts/Heaters/Heaters"
// import ShopCart from "./UI/ShopCart/ShopCart"
import Animations from "./Animations/Animations"
import ToolsSect from './Layouts/Tools/Tools'

export function App() {
	return (
		<div className="flex flex-col gap-[80px]" >
			<Header />
			<Hero />
			<ProductCategory />
			<OffersSect />
			<HeatersSect />
			<ToolsSect />
			<Animations />
			{/* <ShopCart /> */}
		</div>
	)
}

export default App