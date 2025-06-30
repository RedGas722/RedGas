import React, { useState, useRef } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [erroresActivos, setErroresActivos] = useState({})
  const errorTimeouts = useRef({})

  const URL = 'https://redgas.onrender.com/CategoriaRegister'

  // Validación del campo en el frontend
  const validarCampos = () => {
    const errores = {}
    if (!nombre.trim()) {
      errores.nombre = 'El nombre de la categoría es obligatorio.'
    } else if (/^\d+$/.test(nombre)) {
      errores.nombre = 'El nombre no puede ser solo números.'
    }
    return errores
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      setMensaje('')
      setErroresActivos(erroresValidados)
      Object.keys(erroresValidados).forEach((key) => {
        if (errorTimeouts.current[key]) clearTimeout(errorTimeouts.current[key])
        errorTimeouts.current[key] = setTimeout(() => {
          setErroresActivos((prev) => ({ ...prev, [key]: undefined }))
        }, 2000)
      })
      return
    }
    setErrores({})
    setErroresActivos({})
    setMensaje("")
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_categoria: nombre }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 500 && data.errorInfo?.includes('Duplicate')) {
          setMensaje('La categoría ya existe.')
          return
        }
        const errorMsg = data?.errors?.[0]?.msg || 'Error al registrar categoría.'
        throw new Error(errorMsg)
      }
      setMensaje('Registro exitoso.')
      setRefrescar(true) 
    } catch (err) {
      setMensaje('Error: ' + err.message)
    }
  }

  const cancelarRegistro = () => {
    setNombre("")
    setErrores({})
    setErroresActivos({})
    setMensaje("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Categoría</h2>
        <InputLabel
          type="1"
          placeholder={erroresActivos.nombre || 'Nombre de la categoría'}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholderError={!!erroresActivos.nombre}
        />
        <div className="flex justify-between gap-2">
          <button
            onClick={cancelarRegistro}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrar
          </button>
        </div>
        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
