import React, { useState, useEffect } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose, setRefrescar, clientes, empleados }) => {
  const [clienteCorreo, setClienteCorreo] = useState('')
  const [empleadoCorreo, setEmpleadoCorreo] = useState('')
  const [IDcliente, setIDcliente] = useState('')
  const [IDempleado, setIDempleado] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [totalFactura, setTotalFactura] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  const URL = 'https://redgas.onrender.com/FacturaRegister'

  const validarCampos = () => {
    const errores = {}
    if (!IDcliente) errores.IDcliente = 'Debe seleccionar un cliente.'
    if (!IDempleado) errores.IDempleado = 'Debe seleccionar un empleado.'
    if (!fecha.trim()) errores.fecha = 'La fecha es obligatoria.'
    if (!totalFactura.trim() || parseFloat(totalFactura) <= 0) errores.total = 'Debe ingresar un total válido.'
    return errores
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      setMensaje('')
      return
    }

    setErrores({})
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: parseInt(IDcliente),
          id_empleado: parseInt(IDempleado),
          fecha_factura: fecha,
          total: parseFloat(totalFactura)
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.errors?.[0]?.msg || 'Error en la solicitud')
      }

      setMensaje('Factura registrada exitosamente.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message)
    }
  }

  const cancelarRegistro = () => {
    setClienteCorreo('')
    setEmpleadoCorreo('')
    setIDcliente('')
    setIDempleado('')
    setFecha(new Date().toISOString().slice(0, 10))
    setTotalFactura('')
    setMensaje('')
    setErrores({})
    onClose()
  }

  return (
    <Modal open onClose={cancelarRegistro}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <IconButton
          onClick={cancelarRegistro}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Registrar Factura
        </Typography>

        <Autocomplete
          options={clientes}
          getOptionLabel={(c) => c.correo_cliente || ''}
          value={clientes.find(c => c.id_cliente === IDcliente) || null}
          onChange={(e, value) => {
            setClienteCorreo(value?.correo_cliente || '')
            setIDcliente(value?.id_cliente || '')
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Correo del cliente"
              error={!!errores.IDcliente}
              helperText={errores.IDcliente}
            />
          )}
        />

        <Autocomplete
          options={empleados}
          getOptionLabel={(e) => e.correo_empleado || ''}
          value={empleados.find(e => e.id_empleado === IDempleado) || null}
          onChange={(e, value) => {
            setEmpleadoCorreo(value?.correo_empleado || '')
            setIDempleado(value?.id_empleado || '')
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Correo del empleado"
              error={!!errores.IDempleado}
              helperText={errores.IDempleado}
            />
          )}
        />

        <TextField
          type="date"
          label="Fecha de la factura"
          InputLabelProps={{ shrink: true }}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          error={!!errores.fecha}
          helperText={errores.fecha}
        />

        <TextField
          type="number"
          label="Total de la factura"
          value={totalFactura}
          onChange={(e) => setTotalFactura(e.target.value)}
          error={!!errores.total}
          helperText={errores.total}
        />

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Button onClick={cancelarRegistro} variant="contained" color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleRegister} variant="contained" color="success">
            Registrar
          </Button>
        </Box>

        {mensaje && (
          <Typography
            textAlign="center"
            fontWeight="bold"
            color={mensaje.includes('exitosamente') ? 'green' : 'error'}
          >
            {mensaje}
          </Typography>
        )}
      </Box>
    </Modal>
  )
}
export default RegisterModal