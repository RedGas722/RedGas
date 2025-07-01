import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import CardEmployeesBack from './Get/CardEmployeesBack'
import { buscarEmpleadoPorCorreo } from './Get/Get'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Buttons } from '../../UI/Login_Register/Buttons'
import Paginator from '../../UI/Paginator/Paginator'

export const EmployeesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [empleados, setEmpleados] = useState([])
  const [empleadosEmails, setEmpleadosEmails] = useState([])
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
      setEmpleadosEmails(data.data || [])
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

  const buscarEmpleado = async (correo) => {
    setErrorBusqueda('')
    setEmpleadoBuscado(null)

    const correoFinal = (correo || correoBusqueda).trim()
    if (!correoFinal) {
      setErrorBusqueda('Por favor ingrese un correo válido')
      return
    }

    try {
      const resultado = await buscarEmpleadoPorCorreo(correoFinal)
      setEmpleadoBuscado(resultado)
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message || 'Empleado no encontrado')
    }
  }

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = empleadosEmails.filter((empleado) =>
      (empleado.correo_empleado || '').toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, empleadosEmails])

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([])
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setEmpleadoBuscado(null)
      setErrorBusqueda('')
    }
  }, [correoBusqueda])

  return (
    <section className="w-full h-full flex flex-col p-[5px_20px_10px_5px]">
      <BtnBack To='/Admin' />
      <div className="p-[10px_20px_10px_20px] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Empleado BACK-OFFICE</h1>

        <div className='NeoContainer_outset_TL flex gap-4 flex-wrap items-end w-fit p-[0_20px_10px_20px]'>
          <div ref={contenedorRef} className="relative">
            <InputLabel
              radius='10'
              type="1"
              ForID="correo_empleado_busqueda"
              placeholder="Buscar empleado"
              childLabel="Buscar empleado"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full pr-8"
              placeholderError={!!errorBusqueda}
            />

            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border w-[230px] border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow">
                {sugerencias.map((empleado) => (
                  <li
                    key={empleado.id_empleado}
                    onClick={() => {
                      setCorreoBusqueda(empleado.correo_empleado)
                      buscarEmpleado(empleado.correo_empleado)
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

          <div className="flex w-fit h-fit flex-wrap justify-center items-center gap-[20px]">
            <Buttons
              radius='10'
              nameButton='Registrar'
              textColor='var(--Font-Nav)'
              onClick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

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

        <Paginator
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={(nuevaPagina) => {
            if (nuevaPagina !== paginaActual) {
              setPaginaActual(nuevaPagina)
            }
          }}
        />

        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
          />
        )}

        {showUpdateModal && empleadoSeleccionado && (
          <UpdateModal
            onClose={cerrarModal}
            setRefrescar={setRefrescar}
            empleadoCarta={empleadoSeleccionado}
          />
        )}
      </div>
    </section>
  )
}

export default EmployeesBack
