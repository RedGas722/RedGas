import { DeleteTechnician } from '../Delete/Delete'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const convertirBase64AUrl = (imagen) => {
  if (!imagen) return null

  if (typeof imagen === 'string') {
    return `data:image/png;base64,${imagen}`
  }

  if (imagen.type === 'Buffer' && Array.isArray(imagen.data)) {
    const binary = imagen.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    const base64 = btoa(binary)
    return `data:image/png;base64,${base64}`
  }

  return null
}

const CardTechniciansBack = ({ tecnico, setRefrescar, onUpdateClick }) => {
  const imageUrl = convertirBase64AUrl(tecnico.imagen)

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar al técnico ${tecnico.nombre_tecnico}?`)
    if (!confirmar) return

    const { success, message } = await DeleteTechnician(tecnico.correo_tecnico)

    if (success) {
      alert(message)
      setRefrescar && setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="text-center items-center NeoContainer_outset_TL w-[300px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] truncate w-full">{tecnico.nombre_tecnico}</h2>

      <div className="w-full flex justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tecnico.nombre_tecnico}
            className="w-[180px] h-[180px] object-cover rounded-[20px] border"
          />
        ) : (
          <div className="w-[180px] h-[180px] flex justify-center items-center bg-gray-200 rounded-[20px] text-[var(--main-color-sub)] text-sm">
            Sin foto
          </div>
        )}
      </div>

      <div className="flex flex-col text-sm text-[var(--main-color)]">
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">ID:</span>
          <span className="break-words">{tecnico.id_tecnico}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">CC:</span>
          <span className="break-words">{tecnico.cc_tecnico}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Correo:</span>
          <span className="break-words">{tecnico.correo_tecnico}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Teléfono:</span>
          <span className="break-words">{tecnico.telefono_tecnico}</span>
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
        {onUpdateClick && (
          <Buttons
            onClick={() => onUpdateClick(tecnico)}
            nameButton='Actualizar'
            textColor='var(--Font-Yellow)'
            radius='12'
            borderWidth='1'
            borderColor='var(--Font-Yellow)'
          />
        )}
      </div>
    </div>
  )
}

export default CardTechniciansBack
