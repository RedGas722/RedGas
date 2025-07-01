import { DeleteTechnician } from '../Delete/Delete';
import { Buttons } from '../../../UI/Login_Register/Buttons';

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
    <div className="text-center items-center NeoContainer_outset_TL p-4 w-[250px] h-fit flex flex-col justify-start gap-2">
      <h2 className="text-[20px] font-semibold text-[var(--main-color)] ">{tecnico.nombre_tecnico}</h2>
      <div className="">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tecnico.nombre_tecnico}
            className="w-full h-full object-contain rounded-[20px]"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-md text-[var(--main-color-sub)]">
            Foto no disponible
          </div>
        )}
      </div>

      <div className="text-[var(--main-color)] flex flex-col text-sm">
        <p className="font-medium flex flex-wrap gap-2">
          <span className="font-bold text-[15px]">ID:</span>
          <span className="break-words">{tecnico.id_tecnico}</span>
        </p>
        <p className="font-medium flex flex-wrap gap-2">
          <span className="font-bold text-[15px]">CC:</span>
          <span className="break-words">{tecnico.cc_tecnico}</span>
        </p>
        <p className="font-medium flex flex-wrap gap-2">
          <span className="font-bold text-[15px]">Correo:</span>
          <span className="break-words">{tecnico.correo_tecnico}</span>
        </p>
        <p className="font-medium flex flex-wrap gap-2">
          <span className="font-bold text-[15px]">Teléfono:</span>
          <span className="break-words">{tecnico.telefono_tecnico}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Buttons onClick={handleDelete} nameButton='Eliminar' textColor='var(--Font-Nav2)' radius='12' borderWidth='1' borderColor='var(--Font-Nav2)' />
        {onUpdateClick && (
          <Buttons onClick={() => onUpdateClick(tecnico)} nameButton='Actualizar' textColor='var(--Font-Yellow)' radius='12' borderWidth='1' borderColor='var(--Font-Yellow)' />
        )}
      </div>
    </div>
  )
}

export default CardTechniciansBack
