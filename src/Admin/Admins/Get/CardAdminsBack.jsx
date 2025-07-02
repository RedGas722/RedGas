import { DeleteAdmin } from '../Delete/Delete'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardAdminsBack = ({ admin, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${admin.nombre_admin}?`)
    if (!confirmar) return

    const { success, message } = await DeleteAdmin(admin.correo_admin)

    if (success) {
      alert(message)
      setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="text-center z-[2] items-center NeoContainer_outset_TL w-[300px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] truncate w-full break-words">
        {admin.nombre_admin}
      </h2>

      <div className="flex flex-col text-sm text-[var(--main-color)]">
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">ID:</span>
          <span className="break-words">{admin.id_admin}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Correo:</span>
          <span className="break-words">{admin.correo_admin}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Teléfono:</span>
          <span className="break-words">{admin.telefono_admin}</span>
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
          onClick={() => onUpdateClick(admin)}
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

export default CardAdminsBack
