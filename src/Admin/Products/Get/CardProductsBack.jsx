import { Buttons } from '../../../UI/Login_Register/Buttons'
import { DeleteProduct } from '../Delete/Delete' // Asegúrate de que esta función esté implementada

const convertirFecha = (fechaConvertir) => {
  return fechaConvertir ? fechaConvertir.slice(0, 10) : ''
}

const convertirBase64AUrl = (imagen) => {
  if (!imagen) {
    console.warn("No hay imagen")
    return null
  }
  if (typeof imagen === 'string') {
    return `data:image/png;base64,${imagen}`
  }
  console.warn("Formato de imagen desconocido:", imagen)
  return null
}

const CardsProductsBack = ({ producto, setRefrescar, onUpdateClick }) => {
  const imageUrl = convertirBase64AUrl(producto.imagen)

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar el producto "${producto.nombre_producto}"?`)
    if (!confirmar) return

    const { success, message } = await DeleteProduct(producto.nombre_producto)

    if (success) {
      alert(message)
      setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="text-start items-center NeoContainer_outset_TL p-4 max-w-[450px] h-fit flex flex-col justify-start gap-2">
      <h2 className="text-[20px] font-semibold text-[var(--main-color)]">{producto.nombre_producto}</h2>
      <div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={producto.nombre_producto}
            className="w-full object-contain rounded-[20px]"
          />
        ) : (
          <div className="w-full h-[180px] flex justify-center items-center bg-gray-200 rounded-md text-gray-500">
            Imagen no disponible
          </div>
        )}

        <div className="text-[var(--main-color)] flex flex-col text-sm">
          <p className="font-medium flex flex-wrap gap-2">
            <span className="font-bold text-[15px]">Categoría:</span>
            <span className="break-words">{producto.categorias?.join(', ') || 'Sin categoría'}</span>
          </p>
          <p className="font-medium flex flex-wrap gap-2">
            <span className="font-bold text-[15px]">Stock:</span>
            <span className="break-words">{producto.stock}</span>
          </p>
          <p className="font-medium flex flex-wrap gap-2">
            {producto.descuento != 0 && (
              <>
                <span className="font-bold text-[15px]">Descuento:</span>
                <span className="break-words">{producto.descuento}%</span>
              </>
            )}
          </p>
          <p className="font-medium flex flex-wrap gap-2">
            {producto.descuento != 0 && (
              <>
                <span className="font-bold text-[15px]">Fecha Descuento:</span>
                <span className="break-words">{convertirFecha(producto.fecha_descuento)}</span>
              </>
            )}
          </p>
        </div>
        <p className="text-lg font-bold text-green-600">
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(producto.precio_producto || 0)}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Buttons onClick={handleDelete} nameButton='Eliminar' textColor='var(--Font-Nav2)' radius='12' borderWidth='1' borderColor='var(--Font-Nav2)' />
        <Buttons onClick={() => onUpdateClick(producto)} nameButton='Actualizar' textColor='var(--Font-Yellow)' radius='12' borderWidth='1' borderColor='var(--Font-Yellow)' />
      </div>
    </div>
  )
}

export default CardsProductsBack
