import './index.css'
import Header from "./Layouts/Header/Header"
import './index.css'
// import ShopCart from "./UI/ShopCart/ShopCart"
import Animations from "./Animations/Animations"
import MainPage from './Pages/MainPage/MainPage'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import { Routes, Route } from 'react-router-dom'

export function App() {
	return (
		<div className="flex flex-col gap-[80px]" >
			<Header />
			<Animations />
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/Register' element={<Register />} />
				<Route path='/Login' element={<Login />} />
			</Routes>
			{/* <ShopCart /> */}
		</div>
	)
}

export default App