import ButtonSide from './UI/ButtonSide'
import './AdminStyles.css'

export const AdminApp = () => {
    return (
        <>
            <h2 className='font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5'>Admin Page</h2>
            <div className="Admin p-[2%_0_2%_1%] w-dvw h-dvh bg-[var(--Bacground-Admin)] flex items-center justify-center">
                <section id="sideBarr" className="h-fit p-[0_30px] gap-10 justify-center justify-self-center self-center flex flex-wrap">
                    <ButtonSide to='/Admin/Technicians' children='Técnicos' imgBtn='../../src/Admin/Assets/Icons/Tecnic.png' />
                    <ButtonSide to='/Admin/Clients' children='Clientes' imgBtn='../../src/Admin/Assets/Icons/Client.png' />
                    <ButtonSide to='/Admin/Employees' children='Empleados' imgBtn='../../src/Admin/Assets/Icons/Employer.png' />
                    <ButtonSide to='/Admin/Products' children='Productos' imgBtn='../../src/Admin/Assets/Icons/Product.png' />
                    <ButtonSide to='/Admin/Factures' children='Facturas' imgBtn='../../src/Admin/Assets/Icons/Facture.png' />
                    <ButtonSide to='/Admin/Categories' children='Categorias' imgBtn='../../src/Admin/Assets/Icons/Categories.png' />
                    <ButtonSide to='/Admin/Services' children='Servicios' imgBtn='../../src/Admin/Assets/Icons/Services.png' />
                    <ButtonSide to='/Admin/Admins' children='Admin' imgBtn='../../src/Admin/Assets/Icons/Admin.png' />
                </section>
            </div>
        </>
    )
}

export default AdminApp