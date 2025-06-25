import { Routes, Route } from 'react-router-dom'
import { MainPage } from './Pages/MainPage/MainPage'
import { CostumerMyService } from './Pages/CostumerMyService/CostumerMyService'
import { CostumerServices } from './Pages/CostumersServices/CostumersServices'
import { ServicesInfo } from './Pages/Services/Services'
import { TechniciansPage } from './Pages/Technicians/TechniciansPage'
import { Shopping } from './Pages/Shopping/Shopping.jsx'
import { Register } from './Pages/Register/Register'
import { Login } from './Pages/Login/Login'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword'
import { AdminApp } from './Admin/AdminApp'
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
import ConfirmacionPayPal from './Pages/Shopping/ConfirmacionPayPal.jsx'
import ConfirmacionPsE from './Pages/Shopping/ConfirmacionPsE.jsx'
import { NotFound } from './Pages/NotFound/NotFound.jsx'
import { LoginGeneral } from './Pages/Login/LoginGeneral.jsx'
import { LoginTechnician } from './Pages/Login/LoginTechnician.jsx'
import { startTokenRefresher } from './Pages/Login/TokenRefresher.jsx';
import { useEffect } from 'react'
import { SearchPage } from './Pages/SearchPage/SearchPage.jsx'
import { ProductInfo } from './Pages/ProductInfo/ProductInfo.jsx'
import { Technica } from './Pages/Technicians/Technica/Technica.jsx'
import { Cursor } from './UI/Cursor/Cursor.jsx'


// 👇 Importar ruta protegida
import { ProtectedRoute } from './Pages/Login/ProtectedRoutes.jsx'
import { SalesBack } from './Admin/Sales/SalesBack.jsx'

export function App() {

    useEffect(() => {
        const token = localStorage.getItem('token');
        const recordar = localStorage.getItem('recordarme') === 'true';

        if (token && recordar) {
            startTokenRefresher();
        }
    }, []);

    return (
        <>
            <div>
                <Cursor />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/CostumerMyService" element={<CostumerMyService />} />
                    <Route path="/Services" element={<ServicesInfo />} />
                    <Route path="/Technic" element={<TechniciansPage />} />
                    <Route path="/Shopping" element={<Shopping />} />
                    <Route path='/Register' element={<Register />} />
                    <Route path="/SearchPage" element={<SearchPage />} />
                    <Route path="/SearchPage" element={<SearchPage />} />
                    <Route path="/Technica" element={<Technica />} />
                    {/* Login's Route */}
                    <Route path='/Login' element={<Login />} >
                        <Route index element={<LoginGeneral />} />
                        <Route path='LoginGeneral' element={<LoginGeneral />} />
                        <Route path='LoginTechnician' element={<LoginTechnician />} />
                    </Route>
                    <Route path='/ProductInfo' element={<ProductInfo />} />
                    {/* Rutas de recuperación de contraseña */}
                    <Route path='/Login/ForgotPassword' element={<ForgotPassword />} />
                    <Route path='/Login/ForgotPassword/Recovery/:token' element={<RecoveryPassword />} />

                    {/* ADMIN (tipoUsuario === 1) */}
                    <Route path="/Admin/Clients" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <ClientsBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Employees" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <EmployeesBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Factures" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <FacturesBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Categories" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <CategoriesBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Admins" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <AdminsBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Contracts" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <ContractsBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Technicians" element={
                        <ProtectedRoute requiredTypes={[1]}>
                            <TechniciansBack />
                        </ProtectedRoute>
                    } />

                    {/* ADMIN (tipoUsuario === 1 y 3) */}
                    <Route path="/Admin" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <AdminApp />
                        </ProtectedRoute>
                    } />

                    <Route path="/Admin/Products" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <ProductsBack />
                        </ProtectedRoute>
                    } />
                    <Route path="/Admin/Services" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <ServicesBack />
                        </ProtectedRoute>
                    } />

                    <Route path="/Admin/Sales" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <SalesBack />
                        </ProtectedRoute>
                    } />

                    {/* rutas para tecnicos */}

                    <Route path="/CostumerServices" element={
                        <ProtectedRoute requiredTypes={[4]}>
                            <CostumerServices />
                        </ProtectedRoute>
                    } />

                    {/* Rutas de Pago */}
                    <Route path="/Shopping/ConfirmacionPayPal" element={<ConfirmacionPayPal />} />
                    <Route path="/Shopping/ConfirmacionPsE" element={<ConfirmacionPsE />} />
                    <Route path="/Shopping/Cancelado" element={<Cancelado />} />

                    {/* 404 */}
                    <Route path="/NotFound" element={<NotFound />} />
                </Routes>
            </div>
        </>
    )
}

export default App
