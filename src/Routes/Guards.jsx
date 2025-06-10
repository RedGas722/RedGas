import { Navigate } from 'react-router-dom';

export function AdminRoute({ children }) {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    if (tipoUsuario !== 'admin') {
        return <Navigate to="/Login" replace />;
    }
    return children;
}

export function TechnicianRoute({ children }) {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    if (tipoUsuario !== 'tecnico') {
        return <Navigate to="/Login" replace />;
    }
    return children;
}

export function EmployeeRoute({ children }) {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    if (tipoUsuario !== 'empleado') {
        return <Navigate to="/Login" replace />;
    }
    return children;
}

export function ClientRoute({ children }) {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    if (tipoUsuario !== 'cliente') {
        return <Navigate to="/Login" replace />;
    }
    return children;
}
