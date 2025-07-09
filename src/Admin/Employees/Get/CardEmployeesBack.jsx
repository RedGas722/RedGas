import { DeleteEmployee } from '../Delete/Delete'
import { confirmDelete } from '../../../UI/Alert/Alert'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardEmployeesBack = ({ empleado, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmado = await confirmDelete(
      `¿Seguro que quieres eliminar al empleado ${empleado.nombre_empleado}?`,
      `Empleado ${empleado.nombre_empleado} eliminado correctamente`
    );
    if (!confirmado) return;

    const { success, message } = await DeleteEmployee(empleado.correo_empleado);

    if (success) {
      setRefrescar(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: message || 'Ocurrió un error inesperado',
      });
    }
  };
  return (
    <div className="NeoContainer_outset_TL p-4 w-[400px] z-[2] gap-4 min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{empleado.nombre_empleado}</h2>
      <div className="text-[var(--main-color)] flex flex-col text-sm">
        <p className="font-medium flex flex-wrap gap-2">
          <span className="font-bold text-[15px]">ID:</span>
          <span className="break-words">{empleado.id_empleado}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">CC:</span>
          <span className="break-words">{empleado.cc_empleado}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Correo:</span>
          <span className="break-words">{empleado.correo_empleado}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Teléfono:</span>
          <span className="break-words">{empleado.telefono_empleado}</span>
        </p>
        <p className="font-medium flex flex-wrap gap-2">
          <span className="font-bold text-[15px]">Dirección:</span>
          <span className="break-words">{empleado.direccion_empleado}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Buttons
          onClick={handleDelete}
          nameButton='Eliminar'
          textColor='var(--Font-Nav2)'
          radius='12'
          borderWidth='1'
          borderColor='var(--Font-Nav2)'
        />
        <Buttons
          onClick={() => onUpdateClick(empleado)}
          nameButton='Actualizar'
          textColor='var(--Font-Yellow)'
          radius='12'
          borderWidth='1'
          borderColor='var(--Font-Yellow)'
        />
      </div>
    </div>
  )
}

export default CardEmployeesBack
