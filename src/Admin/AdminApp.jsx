import { useEffect, useState } from 'react'
import ButtonSide from './UI/ButtonSide'
import { BtnBack } from "../UI/Login_Register/BtnBack"
import { Buttons } from '../UI/Login_Register/Buttons'
import './AdminStyles.css'

export const AdminApp = () => {
    const [tipoUsuario, setTipoUsuario] = useState(null)

    useEffect(() => {
        const tipo = localStorage.getItem('tipo_usuario')
        setTipoUsuario(tipo ? parseInt(tipo) : null)
    }, [])

    return (
        <>

            <div className='btnDown-left fixed flex-col'>
                <h2 className=' font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5 text-shadow'>ADMINISTRADOR</h2>
                <BtnBack To='/' />
            </div>
            <div className="Admin p-[2%_0_2%_1%] w-dvw h-dvh bg-[var(--Bacground-Admin)] flex items-center justify-center">
                <section id="sideBarr" className="h-fit p-[0_30px] gap-10 justify-center justify-self-center self-center flex flex-wrap">

                    {/* Si es admin, mostrar todo */}
                    {tipoUsuario === 1 && (
                        <>
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Tecnic.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Client.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Employer.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Product.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Facture.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Categories.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Services.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Admin.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Contract.png' className='w-20 brightness-80' />} />
                            <Buttons width='104px' height='104px' padding='0' nameButton={<img src='src/Admin/Assets/Icons/Sales.png' className='w-20 brightness-80' />} />
                            {/* noooooooooo */}
                            <ButtonSide to='/Admin/Technicians' children='Técnicos' imgBtn='src/Admin/Assets/Icons/Tecnic.png' />
                            <ButtonSide to='/Admin/Clients' children='Clientes' imgBtn='src/Admin/Assets/Icons/Client.png' />
                            <ButtonSide to='/Admin/Employees' children='Empleados' imgBtn='src/Admin/Assets/Icons/Employer.png' />
                            <ButtonSide to='/Admin/Products' children='Productos' imgBtn='src/Admin/Assets/Icons/Product.png' />
                            <ButtonSide to='/Admin/Factures' children='Facturas' imgBtn='src/Admin/Assets/Icons/Facture.png' />
                            <ButtonSide to='/Admin/Categories' children='Categorias' imgBtn='src/Admin/Assets/Icons/Categories.png' />
                            <ButtonSide to='/Admin/Services' children='Servicios' imgBtn='src/Admin/Assets/Icons/Services.png' />
                            <ButtonSide to='/Admin/Admins' children='Admin' imgBtn='src/Admin/Assets/Icons/Admin.png' />
                            <ButtonSide to='/Admin/Contracts' children='Contratos' imgBtn='src/Admin/Assets/Icons/Contract.png' />
                            <ButtonSide to='/Admin/Sales' children={'Ventas'} imgBtn='src/Admin/Assets/Icons/Sales.png' />
                        </>
                    )}

                    {/* Si es empleado, mostrar solo Productos y Servicios */}
                    {tipoUsuario === 3 && (
                        <>
                            <ButtonSide to='/Admin/Products' children='Productos' imgBtn='src/Admin/Assets/Icons/Product.png' />
                            <ButtonSide to='/Admin/Services' children='Servicios' imgBtn='src/Admin/Assets/Icons/Services.png' />
                            <ButtonSide to='/Admin/Sales' children={'Ventas'} imgBtn='...' />
                        </>
                    )}

                </section>
            </div>
        </>
    )
}

export default AdminApp
