import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { buscarEmpleadoPorCorreo } from './Get/Get'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardEmployeesBack from './Get/CardEmployeesBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const EmployeesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [empleados, setEmpleados] = useState([])
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

  useEffect(() => {
    fetchEmpleados(paginaActual)
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchEmpleados(1)
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

  // Autocompletado en vivo
  useEffect(() => {
    if ((correoBusqueda || '').trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = empleados.filter((empleado) =>
      (empleado.correo_empleado || '')
        .toLowerCase()
        .includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, empleados])

  // Cerrar sugerencias si se hace clic fuera
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
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div className='flex-col ali'>
          <h1 className="font-bold text-[20px]">Empleado BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin'  />
          </div>
        </div>
        {/* Barra de búsqueda para consultar empleado */}
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <InputLabel
              type="1"
              ForID="correo_empleado_busqueda"
              placeholder="Buscar empleado"
              childLabel="Buscar empleado"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full"
            />
            <button
              onClick={buscarEmpleado}
              aria-label="Buscar empleado"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((empleado) => (
                <li
                  key={empleado.id_empleado}
                  onClick={() => {
                    setEmpleadoBuscado(empleado)
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
      </div >

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {empleadoBuscado
          ? (
            <CardEmployeesBack
              key={empleadoBuscado.id_empleado}
              empleado={empleadoBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          )
          : empleados.map((empleado) => (
            <CardEmployeesBack
              key={empleado.id_empleado}
              empleado={empleado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        }
      </div>

      <Paginator
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={(nuevaPagina) => {
          if (nuevaPagina !== paginaActual) {
            setPaginaActual(nuevaPagina)
          }
        }}
      />

      {/* Modales */}
      {showRegisterModal && (
          <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
        )
      }

      {showUpdateModal && empleadoSeleccionado && (
          <UpdateModal
            onClose={cerrarModal}
            setRefrescar={setRefrescar}
            empleadoCarta={empleadoSeleccionado}
          />
        )
      }
    </div >
  )
}

export default EmployeesBack
