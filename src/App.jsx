import './index.css'
import Header from "./Layouts/Header/Header"
import PrincipalSect from "./Layouts/PrincipalSect/PrincipalSect"
import ProductCategory from "./Layouts/ProductCategory/ProductCategory"
import Animations from "./Animations/Animations"
import OffersSect from './Layouts/OffersSect/OffersSect'
import ShopCart from "./UI/ShopCart/ShopCart"
// import Cards from "./UI/Cards/Cards" 

export function App() {
	return (
		<div className="flex flex-col gap-[80px]">
			<Header />
			<PrincipalSect />
			<ProductCategory />
			{/* <Cards /> */}
			<OffersSect />
			<Animations />
			<ShopCart />
		</div>
	)
}

export default App