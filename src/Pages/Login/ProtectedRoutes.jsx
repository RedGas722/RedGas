import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children, requiredTypes }) => {
    const tipoUsuario = parseInt(localStorage.getItem('tipo_usuario'))

    // Si el tipo no está en la lista de permitidos, redirige
    if (!requiredTypes.includes(tipoUsuario)) {
        return <Navigate to="/" replace />
    }

    return children
}
