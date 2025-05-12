import './index.css'
import { Routes, Route } from 'react-router-dom'
import ShopCart from "./UI/ShopCart/ShopCart"
import { Animations } from "./Animations/Animations"
import { MainPage } from './Pages/MainPage/MainPage'
import { Register } from './Pages/Register/Register'
import { Login } from './Pages/Login/Login'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword'
import { TecnicoBackOffice } from './Pages/Bocetos/Tecnico/TecnicoBack'
// Import Router
import { Routes, Route } from 'react-router-dom';
// ---Import Components---
// -Import Animations: Circles/Dots-
// -Import Pages: MainPage/Register/Login/ForgotPassword/RecoveryPassword/ShopCart-
import { MainPage } from './Pages/MainPage/MainPage';
import { Register } from './Pages/Register/Register';
import { Login } from './Pages/Login/Login';
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword';
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword';
// -Import Admin-
import { AdminApp } from './Admin/AdminApp';
import { Technicians } from './Admin/Technicians/Technicians';
import { Clients } from './Admin/Clients/Clients';
import { Employees } from './Admin/Employees/Employees';
import { Products } from './Admin/Products/Products';

export function App() {
	return (
		<div className="flex flex-col gap-[80px]" >
			<Animations />
			<Routes>
				<Route path='/' element={<TecnicoBackOffice />} />
				<Route path='/Register' element={<Register />} />
				<Route path='/Login' element={<Login />} />
				<Route path='/Login/ForgotPassword' element={<ForgotPassword />} />
				<Route path='/Login/ForgotPassword/Recovery' element={<RecoveryPassword />} />
			</Routes>
			<ShopCart />
		</div>
	)
    return (
        <div className="flex flex-col gap-[80px]">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Login/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/Login/ForgotPassword/Recovery" element={<RecoveryPassword />} />
                {/* ADMIN */}
                <Route path="/Admin" element={<AdminApp />}>
                    <Route path="Technicians" element={<Technicians />} />
                    <Route path="Clients" element={<Clients />} />
                    <Route path="Employees" element={<Employees />} />
                    <Route path="Products" element={<Products />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;