import { confirmDelete } from '../../../UI/Alert/Alert'
import { DeleteContract } from '../Delete/Delete'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardContractsBack = ({ contrato, setRefrescar, onUpdateClick, empleados, admins }) => {
  if (!contrato || !contrato.id_contrato) return null
  if (!contrato.id_empleado) {
    return (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow w-[300px] text-center">
        <strong>Advertencia:</strong> El contrato #{contrato.id_contrato} no tiene un ID de empleado válido. No se puede eliminar.
      </div>
    )
  }
  
  const handleDelete = async () => {
    const confirmado = await confirmDelete(
      `¿Seguro que quieres eliminar el(los) contrato(s) del empleado #${contrato.id_empleado}?`,
      `Contrato eliminado correctamente.`
    );

    if (!confirmado) return;

    const { success, message } = await DeleteContract(contrato.id_empleado);

    if (success) {
      if (setRefrescar) setRefrescar(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: message || 'Ocurrió un error inesperado',
      });
    }
  };

  // Buscar empleado y admin por ID
  const empleado = empleados.find(e => e.id_empleado === contrato.id_empleado)
  const admin = admins.find(a => a.id_admin === contrato.id_admin)

  return (
    <div className="z-[2] text-center items-center NeoContainer_outset_TL w-[300px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] truncate w-full">
        Contrato #{contrato.id_contrato}
      </h2>

      <div className="flex flex-col text-sm gap-1 text-[var(--main-color)] text-left w-full">
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Fecha:</span>
          <span>{contrato.fecha_contrato.slice(0, 10)}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Duración:</span>
          <span>{contrato.duracion_contrato}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Tipo:</span>
          <span>{contrato.tipo_contrato}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Salario:</span>
          <span>{contrato.salario}</span>
        </p>
        <p className="font-medium flex items-start gap-1">
          <span className="font-bold text-[15px]">Empleador:</span>
          <div className='flex flex-col'>
            <span className='truncate max-w-[200px]'>{admin.nombre_admin}</span>
            <span className='truncate max-w-[200px]'>{admin ? `(${admin.correo_admin})` : contrato.id_admin}</span>
          </div>
        </p>
        <p className="font-medium flex items-start gap-1">
          <span className="font-bold text-[15px]">Empleado:</span>
          <div className='flex flex-col'>
            <span className='truncate max-w-[200px]'>{empleado.nombre_empleado}</span>
            <span className='truncate max-w-[200px]'>{empleado ? `(${empleado.correo_empleado})` : contrato.id_empleado}</span>
          </div>
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Buttons
          onClick={handleDelete}
          nameButton='Eliminar'
          textColor='var(--Font-Nav2)'
          radius='12'
          borderWidth='1'
          borderColor='var(--Font-Nav2)'
        />
        <Buttons
          onClick={() => onUpdateClick(contrato)}
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

export default CardContractsBack
