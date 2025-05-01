import './index.css'
import Header from "./Layouts/Header/Header"
import './index.css'
// import Cards from "./UI/Cards/Cards" 
import Hero from "./Layouts/Hero/Hero"
import ProductCategory from "./Layouts/ProductCategory/ProductCategory"
import OffersSect from "./Layouts/OffersSect/OffersSect"
import ShopCart from "./UI/ShopCart/ShopCart"
// import Cards from "./UI/Cards/Cards" 

export function App() {
	return (
		<div className="flex flex-col gap-[80px]">
			<Header />
			<Hero />
			<ProductCategory />
			<OffersSect />
			{/* <Cards /> */}
			<OffersSect />
			<Animations />
			<ShopCart />
		</div>
	)
}

export default App