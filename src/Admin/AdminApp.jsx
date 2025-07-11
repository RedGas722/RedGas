import { useNavigate } from 'react-router-dom'
import { faChessKing, faChessQueen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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
        <section className='AdminPanel bg-linear-[130deg] from-[#c7c7c7] via-[#f2f2f2] to-[#c7c7c7] sm:gap-30 flex flex-col h-fit lg:h-dvh gap-10 p-[5px] '>
            <div className='flex flex-col gap-2 items-center sm:gap-0 sm:justify-between sm:flex-row'>
                <BtnBack To='/' />
                <h2 className='z-[2] font-bold text-4xl text-[var(--Font-Nav)]'>Panel de control</h2>
            </div>
            <div className="Admin flex pb-[20px] items-center justify-center">
                <section id="sideBarr" className="z-[2] h-fit justify-center justify-self-center self-center flex flex-wrap">

                    {/* Si es admin, mostrar todo */}
                    {tipoUsuario === 1 && (
                        <div className='BTNS h-full flex flex-wrap w-[80%] 2xl:w-[50%] gap-8 justify-center'>
                            {/* <div className='flex flex-wrap w-fit gap-10 justify-center NeoContainer_outset_TL p-[10px_10px] sm:p-[20px_20px]'> */}
                            <Buttons subTextBTN='Técnicos' onClick={() => navigate('/Admin/Technicians')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Tecnic.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Clientes' onClick={() => navigate('/Admin/Clients')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Client.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Empleados' onClick={() => navigate('/Admin/Employees')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Employer.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Productos' onClick={() => navigate('/Admin/Products')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Product.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Facturas' onClick={() => navigate('/Admin/Factures')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Facture.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            {/* </div> */}
                            {/* <div className='flex flex-wrap w-fit gap-10 justify-center NeoContainer_outset_TL p-[20px_20px]'> */}
                            <Buttons subTextBTN='Categorias' onClick={() => navigate('/Admin/Categories')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Categories.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Admin' onClick={() => navigate('/Admin/Admins')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Admin.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Contratos' onClick={() => navigate('/Admin/Contracts')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Contract.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Ventas' onClick={() => navigate('/Admin/Sales')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Sales.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Servicios' onClick={() => navigate('/Admin/ServicesCompleted')} radius='10' width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Services.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            {/* </div> */}
                        </div>
                    )}

                    {/* Si es empleado, mostrar solo Productos y Servicios */}
                    {tipoUsuario === 3 && (
                        <div className='BTNS h-full flex flex-wrap w-[80%] 2xl:w-[50%] gap-8 justify-center'>
                            <Buttons subTextBTN='Productos' onClick={() => navigate('/Admin/Products')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Product.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Ventas' onClick={() => navigate('/Admin/Sales')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Sales.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Facturas' onClick={() => navigate('/Admin/Factures')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Facture.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Servicios' onClick={() => navigate('/Admin/ServicesCompleted')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Services.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Productos' onClick={() => navigate('/Admin/Products')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Product.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Ventas' onClick={() => navigate('/Admin/Sales')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Sales.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                            <Buttons subTextBTN='Facturas' onClick={() => navigate('/Admin/Factures')} width='144px' height='144px' padding='0' nameButton={<img src='/Assets/Icons/Facture.webp' className='p-[5px_5px] w-24 no-drag brightness-80' />} />
                        </div>
                    )}

                </section>
            </div>
            <div className='w-fit fixed hidden md:bottom-0 sm:left-0 bg-[var(--Bacground-Admin)] h-fit md:flex flex-col'>
                {
                    tipoUsuario === 1 ? <FontAwesomeIcon icon={faChessKing} className="text-[var(--Font-Nav)] hidden sm:block text-4xl" /> :
                        tipoUsuario === 3 ? <FontAwesomeIcon icon={faChessQueen} className="hidden sm:block text-[var(--Font-Nav)] text-4xl" /> :
                            <FontAwesomeIcon icon={faChessKing} className="hidden sm:block text-[var(--Font-Nav)] text-3xl" />
                }
                <p className='font-bold text-3xl text-[var(--Font-Nav)]'>{
                    tipoUsuario === 1 ? 'Administrador' : tipoUsuario === 3 ? 'Empleado' : 'Usuario Desconocido'
                }</p>
            </div>
        </section>
    )
}

export default AdminApp
