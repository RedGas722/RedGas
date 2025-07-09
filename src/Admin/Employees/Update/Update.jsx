import { useState, useEffect } from "react"
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ open, onClose, setRefrescar, empleadoCarta }) => {
  const [empleado, setEmpleado] = useState(null)
  const [nuevoCorreo, setNuevoCorreo] = useState("")
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [errores, setErrores] = useState({})
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")

  useEffect(() => {
    if (empleadoCarta) {
      setEmpleado(empleadoCarta)
      setNuevoCorreo(empleadoCarta.correo_empleado)
      setCorreoParaBusqueda(empleadoCarta.correo_empleado)

      const partesNombre = empleadoCarta.nombre_empleado.split(' ')
      const nombrePart = partesNombre.slice(0, Math.ceil(partesNombre.length / 2)).join(' ')
      const apellidoPart = partesNombre.slice(Math.ceil(partesNombre.length / 2)).join(' ')

      setNombre(nombrePart || "")
      setApellido(apellidoPart || "")
    }
  }, [empleadoCarta])

  const validarCampos = () => {
    const errores = {}
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!empleado?.cc_empleado || empleado.cc_empleado.length < 10 || empleado.cc_empleado.length > 15) {
      errores.cc_empleado = "Cédula entre 10 y 15 caracteres obligatoria."
    }
    if (!nombre.trim()) errores.nombre = "El nombre es obligatorio"
    if (!apellido.trim()) errores.apellido = "El apellido es obligatorio"
    if (!nuevoCorreo.trim()) errores.nuevoCorreo = "El correo es obligatorio"
    else if (!correoRegex.test(nuevoCorreo)) errores.nuevoCorreo = "Correo inválido"
    if (!empleado?.telefono_empleado?.trim()) errores.telefono_empleado = "El teléfono es obligatorio"
    else if (empleado.telefono_empleado.length !== 10 || !/^\d+$/.test(empleado.telefono_empleado)) {
      errores.telefono_empleado = "Teléfono debe tener 10 dígitos numéricos"
    }

    return errores
  }

  const actualizarEmpleado = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }

    setErrores({})
    setMensaje("")

    const direccionActualizada = (empleado?.direccion_empleado || '').trim() === "" ? "sin direccion" : empleado.direccion_empleado

    const body = {
      cc_empleado: empleado.cc_empleado,
      nombre_empleado: `${nombre.trim()} ${apellido.trim()}`,
      nuevo_correo_empleado: nuevoCorreo,
      telefono_empleado: empleado.telefono_empleado,
      direccion_empleado: direccionActualizada,
      correo_empleado: correoParaBusqueda,
    }

    try {
      const res = await fetch("https://redgas.onrender.com/EmpleadoDataUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setMensaje("Empleado actualizado exitosamente.")
        setRefrescar(true)
        if (correoParaBusqueda !== nuevoCorreo) setCorreoParaBusqueda(nuevoCorreo)
      } else {
        const data = await res.json()
        setMensaje(data.errorInfo || "Error al actualizar empleado.")
      }
    } catch {
      setMensaje("Error de red al actualizar.")
    }
  }

  const cancelarEdicion = () => {
    setEmpleado(null)
    setNuevoCorreo("")
    setCorreoParaBusqueda("")
    setMensaje("")
    setErrores({})
    setNombre("")
    setApellido("")
    onClose()
  }

  return (
    <Modal open={open} onClose={cancelarEdicion}>
      <Box
        className="bg-white w-[90%] md:w-[400px] max-h-[90vh] overflow-y-auto p-6 rounded-xl relative shadow-lg"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <IconButton onClick={cancelarEdicion} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="font-bold text-center text-[var(--main-color)] mb-4">
          Actualizar Empleado
        </Typography>

        {empleado && (
          <div className="flex flex-col gap-3 text-[var(--main-color)]">
            <InputLabel
              type="5"
              ForID="cc"
              placeholder="Cédula"
              childLabel="CC"
              value={empleado.cc_empleado}
              onChange={(e) => setEmpleado({ ...empleado, cc_empleado: e.target.value })}
              placeholderError={!!errores.cc_empleado}
            />
            {errores.cc_empleado && <p className="text-red-600 text-sm">{errores.cc_empleado}</p>}

            <InputLabel
              type="1"
              ForID="nombre_empleado"
              placeholder="Nombre"
              childLabel="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholderError={!!errores.nombre}
            />
            {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

            <InputLabel
              type="1"
              ForID="apellido_empleado"
              placeholder="Apellido"
              childLabel="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholderError={!!errores.apellido}
            />
            {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}

            <InputLabel
              type="2"
              ForID="correo_empleado"
              placeholder="Correo"
              childLabel="Correo"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              placeholderError={!!errores.nuevoCorreo}
            />
            {errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}

            <InputLabel
              type="6"
              ForID="telefono_empleado"
              placeholder="Teléfono"
              childLabel="Teléfono"
              value={empleado.telefono_empleado || ''}
              onChange={(e) => setEmpleado({ ...empleado, telefono_empleado: e.target.value })}
              placeholderError={!!errores.telefono_empleado}
            />
            {errores.telefono_empleado && <p className="text-red-600 text-sm">{errores.telefono_empleado}</p>}

            <InputLabel
              type="1"
              ForID="direccion_empleado"
              placeholder="Dirección"
              childLabel="Dirección"
              value={empleado.direccion_empleado || ''}
              onChange={(e) => setEmpleado({ ...empleado, direccion_empleado: e.target.value })}
            />

            <div className="flex justify-between mt-4 gap-2">
              <Button variant="outlined" onClick={cancelarEdicion} color="inherit" fullWidth>
                Cancelar
              </Button>
              <Button variant="contained" onClick={actualizarEmpleado} color="warning" fullWidth>
                Actualizar
              </Button>
            </div>

            {mensaje && (
              <Typography
                variant="body2"
                className={`text-center font-semibold mt-3 ${mensaje.includes("exitosamente") ? "text-green-600" : "text-red-600"}`}
              >
                {mensaje}
              </Typography>
            )}
          </div>
        )}
      </Box>
    </Modal>
  )
}

export default UpdateModal
