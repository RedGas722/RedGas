// Import Router
import { Routes, Route } from 'react-router-dom'
// ---Import Components---
// -Import Pages: MainPage/Register/Login/ForgotPassword/RecoveryPassword/ShopCart-
import { MainPage } from './Pages/MainPage/MainPage'
import { CostumerServices } from './Pages/Costumer/CostumerServices'
import { ServicesInfo } from './Pages/Services/Services.jsx' 
import { TechniciansPage } from './Pages/Technicians/TechniciansPage'
import { Shopping } from './Pages/Shopping/Shopping.jsx'
import { Register } from './Pages/Register/Register'
import { Login } from './Pages/Login/Login'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword'
// -Import Admin-
import { AdminApp } from './Admin/AdminApp'
// -Imports Backs-
import { ClientsBack } from './Admin/Clients/ClientsBack'
import { ProductBack } from './Admin/Products/ProductBack'
import { EmployeesBack } from './Admin/Employees/EmployeesBack'
import { FacturesBack } from './Admin/Factures/FacturesBack'
import { CategoriesBack } from './Admin/Categories/CategoriesBack'
import { TechniciansBack } from './Admin/Technicians/TechniciansBack'
import { ServicesBack } from './Admin/Services/ServicesBack'
import { AdminsBack } from './Admin/Admins/AdminsBack'
import ContractBack from './Admin/Contracts/ContractsModal'

export function App() {
    return (
        <>
            <div>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/Costumer" element={<CostumerServices />} />
                    <Route path="/Services" element={<ServicesInfo />} />
                    <Route path="/Technic" element={<TechniciansPage />} />
                    <Route path="/Shopping" element={<Shopping />} />
                    <Route path='/Register' element={<Register />} />
                    <Route path='/Login' element={<Login />} />
                    <Route path='/Login/ForgotPassword' element={<ForgotPassword />} />
                    <Route path='/Login/ForgotPassword/Recovery/:token' element={<RecoveryPassword />} />
                    {/* ADMIN */}
                    <Route path="/Admin" element={<AdminApp />} />
                    <Route path='/Admin/Technicians' element={<TechniciansBack />} />
                    <Route path="/Admin/Clients" element={<ClientsBack />} />
                    <Route path="/Admin/Employees" element={<EmployeesBack />} />
                    <Route path="/Admin/Products" element={<ProductBack />} />
                    <Route path="/Admin/Factures" element={<FacturesBack />} />
                    <Route path="/Admin/Categories" element={<CategoriesBack />} />
                    <Route path="/Admin/Services" element={<ServicesBack />} />
                    <Route path="/Admin/Admins" element={<AdminsBack />} />
                </Routes>
            </div>
        </>
    )
}

export default App