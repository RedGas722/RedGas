import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Muestra una alerta de confirmación de eliminación
 * @param {string} [text='¿Estás seguro de que deseas eliminar este elemento?'] - Texto de confirmación
 * @returns {Promise<boolean>} - Retorna true si el usuario confirma, false si cancela
 */
export const Alert = async (text = '¿Estás seguro de que deseas eliminar este elemento?') => {
    const result = await MySwal.fire({
        title: 'Confirmar eliminación',
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
};

export default Alert