// utils/confirmDelete.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Muestra una alerta de confirmación de eliminación y un toast si se confirma
 * @param {string} [text='¿Estás seguro de que deseas eliminar este elemento?']
 * @param {string} [successMsg='Eliminado correctamente']
 * @returns {Promise<boolean>} true si el usuario confirma, false si cancela
 */
export const confirmDelete = async (
    text = '¿Estás seguro de que deseas eliminar este elemento?',
    successMsg = 'Eliminado correctamente'
) => {
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

    if (result.isConfirmed) {
        // Mostrar toast de éxito
        MySwal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: successMsg,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
        });
        return true;
    }

    return false;
};
