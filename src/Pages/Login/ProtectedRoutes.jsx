import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children, requiredTypes }) => {
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token)
    const tipoUsuario = decoded?.data?.tipo_usuario

    // Si el tipo no está en la lista de permitidos, redirige
    if (!requiredTypes.includes(tipoUsuario)) {
        return <Navigate to="/" replace />
    }

    return children
}
