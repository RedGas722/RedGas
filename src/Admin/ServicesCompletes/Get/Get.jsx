import { useState, useRef, useEffect } from 'react'

export const useBuscarServices = (clientes, serviciosOriginal, setServicios) => {
  const [clienteBusqueda, setClienteBusqueda] = useState('')
  const [clienteSugerencias, setClienteSugerencias] = useState([])
  const contenedorRefCliente = useRef(null)

  const handleClienteInput = (texto) => {
    setClienteBusqueda(texto)
    const sugerencias = clientes.filter(c =>
      c.correo_cliente.toLowerCase().includes(texto.toLowerCase())
    )
    setClienteSugerencias(sugerencias.slice(0, 5))
  }

  const handleBuscar = (correoCliente) => {
    const clienteFiltrado = clientes.find(c =>
      c.correo_cliente.toLowerCase() === correoCliente.toLowerCase()
    )

    if (!clienteFiltrado) {
      setServicios([])
      return
    }

    const filtrados = serviciosOriginal.filter(
      s => String(s.id_cliente) === String(clienteFiltrado.id_cliente)
    )

    setServicios(filtrados)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contenedorRefCliente.current && !contenedorRefCliente.current.contains(e.target)) {
        setClienteSugerencias([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return {
    clienteBusqueda,
    clienteSugerencias,
    handleClienteInput,
    handleBuscar,
    contenedorRefCliente,
    setClienteBusqueda
  }
}
