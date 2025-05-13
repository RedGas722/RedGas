// Import Router
import { Routes, Route } from 'react-router-dom'
// ---Import Components---
// -Import Pages: MainPage/Register/Login/ForgotPassword/RecoveryPassword/ShopCart-
import { MainPage } from './Pages/MainPage/MainPage'
import { Register } from './Pages/Register/Register'
import { Login } from './Pages/Login/Login'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword'
// -Import Admin-
import { AdminApp } from './Admin/AdminApp'
// import { Technicians } from './Admin/Technicians/Technicians'
import { ClientsBack } from './Admin/Clients/ClientsBack'
// import { Products } from './Admin/Products/Products'
import { ProductBack } from './Admin/Products/ProductBack'
import { EmployeesBack } from './Admin/Employees/EmployeesBack'
import { FacturesBack } from './Admin/Factures/FacturesBack'
import { CategoriesBack } from './Admin/Categories/CategoriesBack'
import { TechniciansBack } from './Admin/Technicians/TechniciansBack'
import { ServicesBack } from './Admin/Services/ServicesBack'

export function App() {
    return (
        <>

            <div className="flex flex-col gap-[80px]" >
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path='/Register' element={<Register />} />
                    <Route path='/Login' element={<Login />} />
                    <Route path='/Login/ForgotPassword' element={<ForgotPassword />} />
                    <Route path='/Login/ForgotPassword/Recovery' element={<RecoveryPassword />} />
                    {/* ADMIN */}
                    <Route path="/Admin" element={<AdminApp />} >
                        <Route path='Technicians' element={<TechniciansBack />} />
                        <Route path="Clients" element={<ClientsBack />} />
                        <Route path="Employees" element={<EmployeesBack />} />
                        <Route path="Products" element={<ProductBack />} />
						<Route path="Factures" element={<FacturesBack />} />
                        <Route path="Categories" element={<CategoriesBack />} />
                        <Route path="Services" element={<ServicesBack />} />
                    </Route>
                </Routes>
            </div>
        </>
    )
}

export default App;