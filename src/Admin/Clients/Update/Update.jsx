import { useState, useEffect } from "react"
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { InputLabel } from "../../../UI/Login_Register/InputLabel/InputLabel"

export const UpdateModal = ({ open, onClose, setRefrescar, clienteCarta }) => {
  const [cliente, setCliente] = useState(null)
  const [nuevoCorreo, setNuevoCorreo] = useState("")
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [errores, setErrores] = useState({})
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")

  useEffect(() => {
    if (clienteCarta) {
      setCliente(clienteCarta)
      setNuevoCorreo(clienteCarta.correo_cliente)
      setCorreoParaBusqueda(clienteCarta.correo_cliente)

      const partes = (clienteCarta?.nombre_cliente || "").trim().split(/\s+/)
      const nombre = partes.slice(0, 2).join(" ")
      const apellido = partes.slice(2).join(" ")

      setNombre(nombre || "")
      setApellido(apellido || "")
    }
  }, [clienteCarta])

  const validarCampos = () => {
    const errores = {}
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!nombre.trim()) errores.nombre = "El nombre es obligatorio"
    if (!apellido.trim()) errores.apellido = "El apellido es obligatorio"
    if (!nuevoCorreo.trim()) errores.nuevoCorreo = "El correo es obligatorio."
    else if (!correoRegex.test(nuevoCorreo)) errores.nuevoCorreo = "Correo inválido."

    if (!cliente?.telefono_cliente?.trim()) {
      errores.telefono_cliente = "El teléfono es obligatorio."
    } else if (
      cliente.telefono_cliente.length !== 10 ||
      !/^\d+$/.test(cliente.telefono_cliente)
    ) {
      errores.telefono_cliente = "Teléfono debe tener 10 dígitos numéricos."
    }

    return errores
  }

  const actualizarCliente = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }

    setErrores({})
    setMensaje("")

    const direccionActualizada =
      cliente.direccion_cliente?.trim() === "" ? "sin direccion" : cliente.direccion_cliente

    const body = {
      nombre_cliente: `${nombre.trim()} ${apellido.trim()}`,
      nuevo_correo_cliente: nuevoCorreo,
      telefono_cliente: cliente.telefono_cliente,
      direccion_cliente: direccionActualizada,
      correo_cliente: correoParaBusqueda
    }

    try {
      const res = await fetch("https://redgas.onrender.com/ClienteDataUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setMensaje("Cliente actualizado exitosamente.")
        setRefrescar(true)

        if (correoParaBusqueda !== nuevoCorreo) {
          setCorreoParaBusqueda(nuevoCorreo)
        }
      } else {
        const data = await res.json()
        setMensaje(data.errorInfo || "Error al actualizar cliente.")
      }
    } catch {
      setMensaje("Error de red al actualizar.")
    }
  }

  const cancelarEdicion = () => {
    setCliente(null)
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
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <IconButton onClick={cancelarEdicion} sx={{ position: "absolute", top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="font-bold text-center text-[var(--main-color)] mb-4">
          Actualizar Cliente
        </Typography>

        {cliente && (
          <div className="flex flex-col gap-3 text-[var(--main-color)]">
            <InputLabel
              type="1"
              ForID="nombre_cliente"
              placeholder="Nombre"
              childLabel="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholderError={!!errores.nombre}
            />
            {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

            <InputLabel
              type="1"
              ForID="apellido_cliente"
              placeholder="Apellido"
              childLabel="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholderError={!!errores.apellido}
            />
            {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}

            <InputLabel
              type="2"
              ForID="correo_cliente"
              placeholder="Nuevo correo"
              childLabel="Correo"
              value={nuevoCorreo}
              onChange={(e) => {
                setNuevoCorreo(e.target.value)
                setErrores((prev) => ({ ...prev, nuevoCorreo: null }))
              }}
              placeholderError={!!errores.nuevoCorreo}
            />
            {errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}

            <InputLabel
              type="6"
              ForID="telefono_cliente"
              placeholder="Teléfono"
              childLabel="Teléfono"
              value={cliente.telefono_cliente}
              onChange={(e) =>
                setCliente({ ...cliente, telefono_cliente: e.target.value })
              }
              placeholderError={!!errores.telefono_cliente}
            />
            {errores.telefono_cliente && (
              <p className="text-red-600 text-sm">{errores.telefono_cliente}</p>
            )}

            <InputLabel
              type="1"
              ForID="direccion_cliente"
              placeholder="Dirección"
              childLabel="Dirección"
              value={cliente.direccion_cliente}
              onChange={(e) =>
                setCliente({ ...cliente, direccion_cliente: e.target.value })
              }
            />

            <div className="flex justify-between mt-4 gap-2">
              <Button variant="outlined" onClick={cancelarEdicion} color="inherit" fullWidth>
                Cancelar
              </Button>
              <Button variant="contained" onClick={actualizarCliente} color="warning" fullWidth>
                Actualizar
              </Button>
            </div>
          </div>
        )}

        {mensaje && (
          <Typography
            variant="body2"
            className={`text-center font-semibold mt-3 ${mensaje.includes("exitosamente") ? "text-green-600" : "text-red-600"
              }`}
          >
            {mensaje}
          </Typography>
        )}
      </Box>
    </Modal>
  )
}
export default UpdateModal