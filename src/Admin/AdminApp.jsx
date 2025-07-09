import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BtnBack } from "../UI/Login_Register/BtnBack"
import { Buttons } from '../UI/Login_Register/Buttons'
import './AdminStyles.css'
import { jwtDecode } from 'jwt-decode'

export const AdminApp = () => {
    const [tipoUsuario, setTipoUsuario] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        const tipo_usuario = jwtDecode(token)?.data?.tipo_usuario
        setTipoUsuario(tipo_usuario ? parseInt(tipo_usuario) : null)
    }, [])

    return (
        <section className='AdminPanel flex flex-col h-dvh gap-20 p-[5px]'>
            <div className='flex flex-col gap-2 items-center sm:gap-0 sm:justify-between sm:flex-row'>
                <BtnBack To='/' />
                <h2 className='z-[2] font-bold text-4xl text-[var(--Font-Nav)]'>ADMINISTRADOR</h2>
            </div>
            <div className="Admin bg-[var(--Bacground-Admin)] flex items-center justify-center">
                <section id="sideBarr" className="z-[2] h-fit gap-10  justify-center justify-self-center self-center flex flex-wrap">

                    {/* Si es admin, mostrar todo */}
                    {tipoUsuario === 1 && (
                        <>
                            <Buttons subTextBTN='Técnicos' onClick={() => navigate('/Admin/Technicians')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Tecnic.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Clientes' onClick={() => navigate('/Admin/Clients')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Client.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Empleados' onClick={() => navigate('/Admin/Employees')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Employer.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Productos' onClick={() => navigate('/Admin/Products')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Product.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Facturas' onClick={() => navigate('/Admin/Factures')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Facture.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Categorias' onClick={() => navigate('/Admin/Categories')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Categories.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Admin' onClick={() => navigate('/Admin/Admins')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Admin.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Contratos' onClick={() => navigate('/Admin/Contracts')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Contract.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Ventas' onClick={() => navigate('/Admin/Sales')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Sales.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Servicios' onClick={() => navigate('/Admin/ServicesCompleted')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Services.png' className='w-20 no-drag brightness-80' />} />
                        </>
                    )}

                    {/* Si es empleado, mostrar solo Productos y Servicios */}
                    {tipoUsuario === 3 && (
                        <>
                            <Buttons subTextBTN='Productos' onClick={() => navigate('/Admin/Products')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Product.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Ventas' onClick={() => navigate('/Admin/Sales')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Sales.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Facturas' onClick={() => navigate('/Admin/Factures')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Facture.png' className='w-20 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Servicios' onClick={() => navigate('/Admin/ServicesCompleted')} width='104px' height='104px' padding='0' nameButton={<img src='/Assets/Icons/Services.png' className='w-20 no-drag brightness-80' />} />
                        </>
                    )}

                </section>
            </div>
        </section>
    )
}

export default AdminApp
