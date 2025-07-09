import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardFacturesBack = ({ factura, clientes, empleados, onUpdateClick, onViewProductsClick }) => {
  const cliente = clientes.find(c => c.id_cliente === factura.id_cliente)
  const empleado = empleados.find(e => e.id_empleado === factura.id_empleado)

  const fechaISO = factura.fecha_factura
  const fecha = new Date(fechaISO)
  const fechaSolo = fecha.toLocaleDateString('en-GB')

  return (
    <div className="text-center z-[2] items-center NeoContainer_outset_TL w-[450px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] truncate w-full">Factura #{factura.id_factura}</h2>

      <div className="flex flex-col text-sm text-[var(--main-color)] w-full text-left">
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Cliente:</span>
          <span className="truncate">{cliente?.correo_cliente || 'Desconocido'}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Empleado:</span>
          <span className="break-words">{empleado?.correo_empleado || 'Desconocido'}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Fecha:</span>
          <span className="break-words">{fechaSolo}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Estado:</span>
          <span className="break-words">{factura.estado_factura}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Total:</span>
          <span className="break-words">${factura.total}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Buttons
          onClick={() => onViewProductsClick(factura)}
          nameButton="Ver Productos"
          textColor="var(--Font-Nav2)"
          radius="12"
          borderWidth="1"
          borderColor="var(--Font-Nav2)"
        />
        <Buttons
          onClick={() => onUpdateClick(factura)}
          nameButton="Actualizar Estado"
          textColor="var(--Font-Yellow)"
          radius="12"
          borderWidth="1"
          borderColor="var(--Font-Yellow)"
        />
      </div>
    </div>
  )
}

export default CardFacturesBack
