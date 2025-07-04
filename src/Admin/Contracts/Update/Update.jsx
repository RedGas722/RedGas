import { useState, useEffect } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ onClose, setRefrescar, contratoCarta }) => {
  // Estados individuales para cada campo
  const [fechaContrato, setFechaContrato] = useState('')
  const [duracionContrato, setDuracionContrato] = useState('')
  const [tipoContrato, setTipoContrato] = useState('')
  const [salario, setSalario] = useState('')
  const [idAdmin, setIdAdmin] = useState('')
  const [idEmpleado, setIdEmpleado] = useState('')
  const [idContrato, setIdContrato] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (contratoCarta) {
      setIdContrato(contratoCarta.id_contrato || '')
      setFechaContrato(contratoCarta.fecha_contrato || '')
      setDuracionContrato(contratoCarta.duracion_contrato || '')
      setTipoContrato(contratoCarta.tipo_contrato || '')
      setSalario(contratoCarta.salario || '')
      setIdAdmin(contratoCarta.id_admin || '')
      setIdEmpleado(contratoCarta.id_empleado || '')
    }
  }, [contratoCarta])

  const validarCampos = () => {
    const errores = {}
    if (!fechaContrato || fechaContrato.trim() === '') errores.fechaContrato = 'La fecha es obligatoria'
    if (!duracionContrato || duracionContrato.trim() === '') errores.duracionContrato = 'La duración es obligatoria'
    if (!tipoContrato || tipoContrato.trim() === '') errores.tipoContrato = 'El tipo es obligatorio'
    if (!salario || isNaN(salario) || Number(salario) <= 0) errores.salario = 'El salario debe ser un número mayor a 0'
    if (!idAdmin || isNaN(idAdmin) || Number(idAdmin) <= 0) errores.idAdmin = 'ID Admin obligatorio y mayor a 0'
    if (!idEmpleado || isNaN(idEmpleado) || Number(idEmpleado) <= 0) errores.idEmpleado = 'ID Empleado obligatorio y mayor a 0'
    return errores
  }

  const actualizarContrato = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }
    setErrores({})
    setMensaje('')
    const body = {
      contrato: {
        fecha_contrato: fechaContrato ? fechaContrato.split('T')[0] : '',
        duracion_contrato: duracionContrato,
        tipo_contrato: tipoContrato,
        salario: salario ? Number(salario) : 0,
      },
      id_empleado: idEmpleado ? Number(idEmpleado) : null,
    }
    try {
      const res = await fetch('https://redgas.onrender.com/ContratoDataUpdate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setMensaje('Contrato actualizado exitosamente.')
        setRefrescar && setRefrescar(true)
      } else {
        const data = await res.json()
        setMensaje(data.errorInfo || 'Error al actualizar contrato.')
      }
    } catch {
      setMensaje('Error de red al actualizar.')
    }
  }

  const cancelarEdicion = () => {
    setFechaContrato('')
    setDuracionContrato('')
    setTipoContrato('')
    setSalario('')
    setIdAdmin('')
    setIdEmpleado('')
    setIdContrato('')
    setMensaje('')
    setErrores({})
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Contrato</h2>
        <>
          <InputLabel
            type="7"
            ForID="fecha_contrato"
            placeholder="Fecha"
            childLabel="Fecha"
            value={fechaContrato}
            onChange={e => setFechaContrato(e.target.value)}
            className="w-full"
            placeholderError={!!errores.fechaContrato}
          />
          {errores.fechaContrato && <p className="text-red-600 text-sm">{errores.fechaContrato}</p>}
          <InputLabel
            type="1"
            ForID="duracion_contrato"
            placeholder="Duración"
            childLabel="Duración"
            value={duracionContrato}
            onChange={e => setDuracionContrato(e.target.value)}
            className="w-full"
            placeholderError={!!errores.duracionContrato}
          />
          {errores.duracionContrato && <p className="text-red-600 text-sm">{errores.duracionContrato}</p>}
          <InputLabel
            type="1"
            ForID="tipo_contrato"
            placeholder="Tipo"
            childLabel="Tipo"
            value={tipoContrato}
            onChange={e => setTipoContrato(e.target.value)}
            className="w-full"
            placeholderError={!!errores.tipoContrato}
          />
          {errores.tipoContrato && <p className="text-red-600 text-sm">{errores.tipoContrato}</p>}
          <InputLabel
            type="5"
            ForID="salario"
            placeholder="Salario"
            childLabel="Salario"
            value={salario}
            onChange={e => setSalario(e.target.value)}
            className="w-full"
            placeholderError={!!errores.salario}
          />
          {errores.salario && <p className="text-red-600 text-sm">{errores.salario}</p>}
          <InputLabel
            type="1"
            ForID="id_admin"
            placeholder="ID Admin"
            childLabel="ID Admin"
            value={idAdmin}
            onChange={e => setIdAdmin(e.target.value)}
            className="w-full"
            placeholderError={!!errores.idAdmin}
          />
          {errores.idAdmin && <p className="text-red-600 text-sm">{errores.idAdmin}</p>}
          <InputLabel
            type="1"
            ForID="id_empleado"
            placeholder="ID Empleado"
            childLabel="ID Empleado"
            value={idEmpleado}
            onChange={e => setIdEmpleado(e.target.value)}
            className="w-full"
            placeholderError={!!errores.idEmpleado}
          />
          {errores.idEmpleado && <p className="text-red-600 text-sm">{errores.idEmpleado}</p>}
          <div className="flex justify-between gap-2">
            <button
              onClick={cancelarEdicion}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={actualizarContrato}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Actualizar
            </button>
          </div>
        </>
        {mensaje && (
          <p
            className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
