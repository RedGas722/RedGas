import Animations from "./Animations/Animations"
import Header from "./Layouts/Header/Header"
import './index.css'
// import Cards from "./UI/Cards/Cards" 
import PrincipalSect from "./Layouts/PrincipalSect/PrincipalSect"
import ProductCategory from "./Layouts/ProductCategory/ProductCategory"

export function App() {
	return (
		<div className="flex flex-col gap-[80px]">
			<Header />
			<PrincipalSect />
			<ProductCategory />
			{/* <Cards /> */}
			<Animations />
		</div>
	)
}

export default App