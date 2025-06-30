import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { buscarEmpleadoPorCorreo } from './Get/Get'
import { BtnBack } from '../../UI/Login_Register/BtnBack'
import CardEmployeesBack from './Get/CardEmployeesBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const EmployeesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [empleados, setEmpleados] = useState([])
  const [correosEmpleados, setCorreosEmpleados] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [empleadoBuscado, setEmpleadoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const contenedorRef = useRef(null)

  const fetchEmpleados = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/EmpleadoGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener empleados')
      const data = await res.json()
      const resultado = data.data

      setEmpleados(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCorreosEmpleados = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/EmpleadoGetAllEmails')
      if (!res.ok) throw new Error('Error al obtener correos')
      const data = await res.json()
      setCorreosEmpleados(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchEmpleados(paginaActual)
    fetchCorreosEmpleados()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchEmpleados(1)
      fetchCorreosEmpleados()
      setPaginaActual(1)
      setRefrescar(false)
      setEmpleadoBuscado(null)
      setErrorBusqueda('')
      setCorreoBusqueda('')
    }
  }, [refrescar])

  const abrirModalActualizar = (empleado) => {
    setEmpleadoSeleccionado(empleado)
    setShowUpdateModal(true)
  }

  const cerrarModal = () => {
    setShowUpdateModal(false)
    setEmpleadoSeleccionado(null)
  }

  const buscarEmpleado = async () => {
    setErrorBusqueda('')
    setEmpleadoBuscado(null)

    try {
      const resultado = await buscarEmpleadoPorCorreo(correoBusqueda)
      setEmpleadoBuscado(resultado)
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      setEmpleadoBuscado(null)
      setErrorBusqueda('')
      return
    }

    const filtrados = correosEmpleados.filter((empleado) =>
      (empleado.correo_empleado || '').toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, correosEmpleados])

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([])
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  return (
    <div className="p-5 flex flex-col gap-5">
        <BtnBack To="/Admin" />
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Empleado BACK-OFFICE</h1>
      </div>

      {/* Búsqueda y Registro */}
      <div className="NeoContainer_outset_TL flex items-center gap-4 bg-white p-4 rounded-xl shadow" ref={contenedorRef}>
        <div className="relative w-full">
          <InputLabel
            radius="10"
            type="1"
            ForID="correo_empleado_busqueda"
            placeholder="Buscar empleado"
            childLabel="Buscar empleado"
            value={correoBusqueda}
            onChange={e => setCorreoBusqueda(e.target.value)}
            className="w-full"
            placeholderError={!!errorBusqueda}
          />
          <FontAwesomeIcon
            icon={faSearch}
            onClick={buscarEmpleado}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Font-Nav)] cursor-pointer"
          />
          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((empleado) => (
                <li
                  key={empleado.id_empleado}
                  onClick={() => {
                    setCorreoBusqueda(empleado.correo_empleado)
                    setSugerencias([])
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {empleado.correo_empleado}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {/* Mensaje de error */}
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      {/* Grid de empleados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {empleadoBuscado ? (
          <CardEmployeesBack
            key={empleadoBuscado.id_empleado}
            empleado={empleadoBuscado}
            setRefrescar={setRefrescar}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          empleados.map((empleado) => (
            <CardEmployeesBack
              key={empleado.id_empleado}
              empleado={empleado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        )}
      </div>

      {/* Paginador */}
      {!empleadoBuscado && (
        <Paginator
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={(nuevaPagina) => {
            if (nuevaPagina !== paginaActual) {
              setPaginaActual(nuevaPagina)
            }
          }}
        />
      )}

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}

      {showUpdateModal && empleadoSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          empleadoCarta={empleadoSeleccionado}
        />
      )}
    </div>
  )
}

export default EmployeesBack
