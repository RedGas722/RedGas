import { DeleteEmployee } from '../Delete/Delete'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardEmployeesBack = ({ empleado, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${empleado.nombre_empleado}?`)
    if (!confirmar) return

    const { success, message } = await DeleteEmployee(empleado.correo_empleado)

    if (success) {
      alert(message)
      setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="text-center z-[2] items-center NeoContainer_outset_TL w-[300px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] truncate w-full">{empleado.nombre_empleado}</h2>

      <div className="flex flex-col text-sm text-[var(--main-color)]">
        <p className="font-medium flex items-center gap-1">
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
        <p className="font-medium flex items-start text-start gap-1 min-w-0">
          <span className="font-bold text-[15px] whitespace-nowrap">Dirección:</span>
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
