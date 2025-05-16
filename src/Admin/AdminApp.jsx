import { Outlet } from 'react-router-dom';
import ButtonSide from './UI/ButtonSide';
import './AdminStyles.css';

export const AdminApp = () => {
    return (
        <div className="Admin p-[2%_0_2%_1%] w-dvw h-dvh flex flex-row bg-[var(--background-color)] items-center justify-center">
            <section id="sideBarr" className="h-full gap-[20px] justify-center flex flex-col w-[20%] NeoContainer_inset_TL">
                <ButtonSide to='/Admin/Technicians' children='Técnicos' />
                <ButtonSide to='/Admin/Clients' children='Clientes' />
                <ButtonSide to='/Admin/Employees' children='Empleados' />
                <ButtonSide to='/Admin/Products' children='Productos' />
                <ButtonSide to='/Admin/Factures' children='Facturas' />
                <ButtonSide to='/Admin/Categories' children='Categorias' />
                <ButtonSide to='/Admin/Services' children='Servicios' />
                <ButtonSide to='/Admin/Admins' children='Admin' />
            </section>
            <section className="SectionSIde w-[80%] h-full">
                <Outlet />
            </section>
        </div>
    );
};

export default AdminApp;