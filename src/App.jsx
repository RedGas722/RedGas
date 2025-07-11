import { CostumerMyService } from './Pages/CostumerMyService/CostumerMyService'
import { CostumerServices } from './Pages/CostumersServices/CostumersServices'
import { RecoveryPassword } from './Pages/RecoveryPassword/RecoveryPassword'
import { BackgroundFire } from './UI/BackgroundFire/BackgroundFire.jsx'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import { LoadingProvider, useLoading } from './UI/Loading/Loading.jsx'
import { startTokenRefresher } from './Pages/Login/TokenRefresher.jsx'
import { TechniciansBack } from './Admin/Technicians/TechniciansBack'
import { Technica } from './Pages/Technicians/Technica/Technica.jsx'
import { ContractsBack } from './Admin/Contracts/ContractsBack.jsx'
import { LoginTechnician } from './Pages/Login/LoginTechnician.jsx'
import { CategoriesBack } from './Admin/Categories/CategoriesBack'
import { ProductInfo } from './Pages/ProductInfo/ProductInfo.jsx'
import { EmployeesBack } from './Admin/Employees/EmployeesBack'
import { SearchPage } from './Pages/SearchPage/SearchPage.jsx'
import { LoginGeneral } from './Pages/Login/LoginGeneral.jsx'
import { ProductsBack } from './Admin/Products/ProductsBack'
import { FacturesBack } from './Admin/Factures/FacturesBack'
import { Backdrop, CircularProgress } from '@mui/material'
import { Cancelado } from './Pages/Shopping/Cancelado.jsx'
import { ClientsBack } from './Admin/Clients/ClientsBack'
import { Shopping } from './Pages/Shopping/Shopping.jsx'
import { NotFound } from './Pages/NotFound/NotFound.jsx'
import { ServicesInfo } from './Pages/Services/Services'
import { AdminsBack } from './Admin/Admins/AdminsBack'
import { Register } from './Pages/Register/Register'
import { MainPage } from './Pages/MainPage/MainPage'
import { Routes, Route } from 'react-router-dom'
import { Login } from './Pages/Login/Login'
import { useEffect } from 'react'
import { AdminApp } from './Admin/AdminApp'
import ConfirmacionPayPal from './Pages/Shopping/ConfirmacionPayPal.jsx'
import ConfirmacionMercadoPago from './Pages/Shopping/ConfirmacionMP.jsx'
import { SnackbarProvider } from './UI/Snackbar/SnackbarProvider.jsx'

// 👇 Importar ruta protegida
import { ProtectedRoute } from './Pages/Login/ProtectedRoutes.jsx'
import { SalesBack } from './Admin/Sales/SalesBack.jsx'
import { ProfileClient } from './Pages/Profile/ProfileClient.jsx'
import ProfileTechnician from './Pages/Profile/ProfileTechnician.jsx'
import ProfileGeneral from './Pages/Profile/ProfileGeneral.jsx'
import ServicesCompletedBack from './Admin/ServicesCompletes/ServicesCompleted.jsx'

export function AppContent() {
    const { isLoading } = useLoading();

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
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/CostumerMyService" element={<CostumerMyService />} />
                    <Route path="/Services" element={<ServicesInfo />} />
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
                    <Route path='/Login/ForgotPassword/Recovery' element={<RecoveryPassword />} />

                    {/*Rutas cliente y tecnico*/}

                    <Route path="/Shopping" element={
                        <ProtectedRoute requiredTypes={[2]}>
                            <Shopping />
                        </ProtectedRoute>
                    } />

                    <Route path="/ProfileGeneral" element={
                        <ProtectedRoute requiredTypes={[2, 4]}>
                            <ProfileGeneral />
                        </ProtectedRoute>
                    } />

                    {/*Cliente (tipoUsuario === 2)*/}

                    <Route path="/ProfileClient" element={
                        <ProtectedRoute requiredTypes={[2]}>
                            <ProfileClient />
                        </ProtectedRoute>
                    } />

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

                    <Route path="/Admin/Sales" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <SalesBack />
                        </ProtectedRoute>
                    } />

                    <Route path="/Admin/Factures" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <FacturesBack />
                        </ProtectedRoute>
                    } />

                    <Route path="/Admin/ServicesCompleted" element={
                        <ProtectedRoute requiredTypes={[1, 3]}>
                            <ServicesCompletedBack />
                        </ProtectedRoute>
                    } />

                    {/* rutas para tecnicos */}

                    <Route path="/CostumerServices" element={
                        <ProtectedRoute requiredTypes={[4]}>
                            <CostumerServices />
                        </ProtectedRoute>
                    } />

                    <Route path="/ProfileTechnician" element={
                        <ProtectedRoute requiredTypes={[2]}>
                            <ProfileTechnician />
                        </ProtectedRoute>
                    } />

                    {/* Rutas de Pago */}
                    <Route path="/Shopping/ConfirmacionPayPal" element={<ConfirmacionPayPal />} />
                    <Route path="/Shopping/ConfirmacionMercadoPago" element={<ConfirmacionMercadoPago />} />
                    <Route path="/Shopping/Cancelado" element={<Cancelado />} />

                    {/* 404 */}
                    <Route path="/NotFound" element={<NotFound />} />
                </Routes>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    )
}

export function App() {
    return (
        <LoadingProvider>
            <SnackbarProvider>
                <div style={{ position: 'relative', minHeight: '100vh' }}>
                    {/* Fondo de fuego */}
                    <div style={{ width: '100%', height: '600px', position: 'fixed' }}>
                        <BackgroundFire
                            particleColors={['#F77E3B', '#F7B733', '#FF6F61', '#D9BF77', '#FFFA6F', '#323232']}
                            particleCount={200}
                            particleSpread={10}
                            speed={0.1}
                            particleBaseSize={100}
                            sizeRandomness={1}
                            moveParticlesOnHover={false}
                            alphaParticles={false}
                            disableRotation={false}
                        />
                    </div>
                    {/* Tu contenido normal */}
                    <AppContent />
                </div>
            </SnackbarProvider>
        </LoadingProvider>
    )
}
export default App
