import { NavLink, Outlet } from 'react-router-dom';
import './AdminStyles.css';

export const AdminApp = () => {
    return (
        <div className="Admin w-dvw h-dvh flex flex-row bg-[var(--background-color)] items-center">
            <section id="sideBarr" className="h-[95%] flex flex-col w-[20%] NeoContainer_inset_TL">
                <NavLink to="/Admin/Technicians" className="p-4 hover:font-bold">
                    Técnicos
                </NavLink>
                <NavLink to="/Admin/TechniciansBack" className="p-4 hover:font-bold">
                    Tecnicos Back
                </NavLink>
                <NavLink to="/Admin/Clients" className="p-4 hover:font-bold">
                    Clientes
                </NavLink>
                <NavLink to="/Admin/Employees" className="p-4 hover:font-bold">
                    Empleados
                </NavLink>
                <NavLink to="/Admin/Products" className="p-4 hover:font-bold">
                    Productos
                </NavLink>
                <NavLink to="/Admin/Factures" className="p-4 hover:font-bold">
                    Facturas
                </NavLink>
            </section>
            <section className="SectionSIde w-[80%] h-full">
                <Outlet />
            </section>
        </div>
    );
};

export default AdminApp;