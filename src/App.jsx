import './index.css'
import { Routes, Route } from 'react-router-dom'
import ShopCart from "./UI/ShopCart/ShopCart"
import { Animations } from "./Animations/Animations"
import { MainPage } from './Pages/MainPage/MainPage'
import { Register } from './Pages/Register/Register'
import { Login } from './Pages/Login/Login'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword'

export function App() {
	return (
		<div className="flex flex-col gap-[80px]" >
			<Animations />
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/Register' element={<Register />} />
				<Route path='/Login' element={<Login />} />
				<Route path='/Login/ForgotPassword' element={<ForgotPassword />} />
				<Route path='/Login/ForgotPassword/Recovery' element={<RecoveryPassword />} />
			</Routes>
			<ShopCart />
		</div>
	)
}

export default App