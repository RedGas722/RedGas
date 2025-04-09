import Header from "./Layouts/Header/Header"
import './index.css'
// import Cards from "./UI/Cards/Cards" 
import Circles from "./UI/ColorCircles/Circles"
import PrincipalSect from "./Layouts/PrincipalSect/PrincipalSect"
export function App() {
	return (
		<>
			<Header />
			{/* <Cards /> */}
			<PrincipalSect />
			<Circles /> 
		</>
	)
}

export default App