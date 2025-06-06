// Import Router
import { Routes, Route } from 'react-router-dom'
// ---Import Components---
// -Import Pages: MainPage/Register/Login/ForgotPassword/RecoveryPassword/ShopCart-
import { MainPage } from './Pages/MainPage/MainPage'
import { CostumerServices } from './Pages/Costumer/CostumerServices'
import { ServicesInfo } from './Pages/Services/Services.jsx'
// import { ServicesInfo } from './Pages/Services/Services.jsx'
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
import { ProductsBack } from './Admin/Products/ProductsBack'
import { EmployeesBack } from './Admin/Employees/EmployeesBack'
import { FacturesBack } from './Admin/Factures/FacturesBack'
import { CategoriesBack } from './Admin/Categories/CategoriesBack'
import { TechniciansBack } from './Admin/Technicians/TechniciansBack'
import { ServicesBack } from './Admin/Services/ServicesBack'
import { AdminsBack } from './Admin/Admins/AdminsBack'
import { ContractsBack } from './Admin/Contracts/ContractsBack.jsx'
import { Cancelado } from './Pages/Shopping/Cancelado.jsx'
import { Confirmacion } from './Pages/Shopping/Confirmacion.jsx'
import { NotFound } from './Pages/NotFound/NotFound.jsx'

// Login Client, Technician
import { LoginClient } from './Pages/Login/LoginClient.jsx'
import { LoginTechnician } from './Pages/Login/LoginTechnician.jsx'

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
                    {/* Login's Route */}
                    <Route path='/Login' element={<Login />} >
                        <Route index element={<LoginClient />} />
                        <Route path='LoginClient' element={<LoginClient />} />
                        <Route path='LoginTechnician' element={<LoginTechnician />} />
                    </Route>
                    <Route path='/Login/ForgotPassword' element={<ForgotPassword />} />
                    <Route path='/Login/ForgotPassword/Recovery/:token' element={<RecoveryPassword />} />
                    {/* ADMIN */}
                    <Route path="/Admin" element={<AdminApp />} />
                    <Route path='/Admin/Technicians' element={<TechniciansBack />} />
                    <Route path="/Admin/Clients" element={<ClientsBack />} />
                    <Route path="/Admin/Employees" element={<EmployeesBack />} />
                    <Route path="/Admin/Products" element={<ProductsBack />} />
                    <Route path="/Admin/Factures" element={<FacturesBack />} />
                    <Route path="/Admin/Categories" element={<CategoriesBack />} />
                    <Route path="/Admin/Services" element={<ServicesBack />} />
                    <Route path="/Admin/Admins" element={<AdminsBack />} />
                    <Route path="/Admin/Contracts" element={<ContractsBack />} />
                    {/*Rutas de Pago*/}
                    <Route path="/Shopping/Confirmacion" element={<Confirmacion />} />
                    <Route path="/Shopping/Cancelado" element={<Cancelado />} />
                    {/* 404 */}
                    <Route path="/NotFound" element={<NotFound />} />
                </Routes>
            </div>
        </>
    )
}

export default App