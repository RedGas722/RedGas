import { useEffect, useState } from 'react'
import ButtonSide from './UI/ButtonSide'
import { BtnBack } from "../UI/Login_Register/BtnBack"
import './AdminStyles.css'

export const AdminApp = () => {
    const [tipoUsuario, setTipoUsuario] = useState(null)

    useEffect(() => {
        const tipo = localStorage.getItem('tipo_usuario')
        setTipoUsuario(tipo ? parseInt(tipo) : null)
    }, [])

    return (
        <>
            
            <div className='btnDown fixed flex-col'>
                <h2 className=' font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5 text-shadow'>ADMINISTRADOR</h2>
                <BtnBack To='/' className='btnDown' />
            </div>
            <div className="Admin p-[2%_0_2%_1%] w-dvw h-dvh bg-[var(--Bacground-Admin)] flex items-center justify-center">
                <section id="sideBarr" className="h-fit p-[0_30px] gap-10 justify-center justify-self-center self-center flex flex-wrap">

                    {/* Si es admin, mostrar todo */}
                    {tipoUsuario === 1 && (
                        <>
                            <ButtonSide to='/Admin/Technicians' children='Técnicos' imgBtn='../../src/Admin/Assets/Icons/Tecnic.png' />
                            <ButtonSide to='/Admin/Clients' children='Clientes' imgBtn='../../src/Admin/Assets/Icons/Client.png' />
                            <ButtonSide to='/Admin/Employees' children='Empleados' imgBtn='../../src/Admin/Assets/Icons/Employer.png' />
                            <ButtonSide to='/Admin/Products' children='Productos' imgBtn='../../src/Admin/Assets/Icons/Product.png' />
                            <ButtonSide to='/Admin/Factures' children='Facturas' imgBtn='../../src/Admin/Assets/Icons/Facture.png' />
                            <ButtonSide to='/Admin/Categories' children='Categorias' imgBtn='../../src/Admin/Assets/Icons/Categories.png' />
                            <ButtonSide to='/Admin/Services' children='Servicios' imgBtn='../../src/Admin/Assets/Icons/Services.png' />
                            <ButtonSide to='/Admin/Admins' children='Admin' imgBtn='../../src/Admin/Assets/Icons/Admin.png' />
                            <ButtonSide to='/Admin/Contracts' children='Contratos' imgBtn='../../src/Admin/Assets/Icons/Contract.png' />
                        </>
                    )}

                    {/* Si es empleado, mostrar solo Productos y Servicios */}
                    {tipoUsuario === 3 && (
                        <>
                            <ButtonSide to='/Admin/Products' children='Productos' imgBtn='../../src/Admin/Assets/Icons/Product.png' />
                            <ButtonSide to='/Admin/Services' children='Servicios' imgBtn='../../src/Admin/Assets/Icons/Services.png' />
                        </>
                    )}

                </section>
            </div>
        </>
    )
}

export default AdminApp
