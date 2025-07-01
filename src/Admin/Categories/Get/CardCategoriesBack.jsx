import { DeleteCategory } from '../Delete/Delete'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardCategoriesBack = ({ categoria, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${categoria.nombre_categoria}?`)
    if (!confirmar) return

    const { success, message } = await DeleteCategory(categoria.nombre_categoria)

    if (success) {
      alert(message)
      setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="text-center items-center NeoContainer_outset_TL w-[300px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] truncate w-full">{categoria.nombre_categoria}</h2>

      <div className="flex flex-col text-sm text-[var(--main-color)]">
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">ID:</span>
          <span className="break-words">{categoria.id_categoria}</span>
        </p>
        {/* Si deseas agregar más campos, aquí puedes agregarlos siguiendo este formato */}
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
          onClick={() => onUpdateClick(categoria)}
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

export default CardCategoriesBack
