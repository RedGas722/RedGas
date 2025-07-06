import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import CardEmployeesBack from './Get/CardEmployeesBack'
import { buscarEmpleadoPorCorreo } from './Get/Get'
import { Backdrop, CircularProgress } from '@mui/material';
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'

export const EmployeesBack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [empleados, setEmpleados] = useState([])
  const [correosEmpleados, setCorreosEmpleados] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [empleadoBuscado, setEmpleadoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const contenedorRef = useRef(null)

  const fetchEmpleados = async (pagina = 1) => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false);
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

  const handleUpdateClick = (empleado) => setShowUpdateModal(empleado)

  const buscarEmpleado = async (correo) => {
    setErrorBusqueda('')
    setEmpleadoBuscado(null)

    if (!correo.trim()) {
      fetchEmpleados(1)
      setPaginaActual(1)
      return
    }

    try {
      const resultado = await buscarEmpleadoPorCorreo(correo.trim())
      if (resultado) {
        setEmpleadoBuscado(resultado)
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró un empleado con ese correo.')
      }
    } catch (error) {
      setErrorBusqueda('Error al buscar empleado.')
    }
  }

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      setEmpleadoBuscado(null)
      return
    }

    const filtrados = correosEmpleados.filter(emp =>
      emp.correo_empleado?.toLowerCase().includes(correoBusqueda.toLowerCase())
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
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To='/Admin' />

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold z-[2] text-3xl text-[var(--main-color)]">Empleados</h1>

        <div className='NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>
          <div className="relative" ref={contenedorRef}>
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
            {sugerencias.length > 0 && (
              <ul className="absolute z-[10] bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow w-[230px]">
                {sugerencias.map((emp) => (
                  <li
                    key={emp.id_empleado}
                    onClick={() => {
                      setCorreoBusqueda(emp.correo_empleado)
                      buscarEmpleado(emp.correo_empleado)
                      setSugerencias([])
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {emp.correo_empleado}
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
              Onclick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {/* Lista de empleados */}
        <div className="flex flex-wrap items-center gap-6">
          {(empleadoBuscado ? [empleadoBuscado] : empleados).map((empleado) => (
            <CardEmployeesBack
              key={empleado.id_empleado}
              empleado={empleado}
              setRefrescar={setRefrescar}
              onUpdateClick={handleUpdateClick}
            />
          ))}
        </div>

        {/* Paginador */}
          <Paginator
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={(nuevaPagina) => {
              if (nuevaPagina !== paginaActual) {
                setPaginaActual(nuevaPagina);
              }
            }}
            disabled={isLoading}
          />

        {/* Modales */}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
          />
        )}

        {typeof showUpdateModal === 'object' && showUpdateModal && (
          <UpdateModal
            onClose={() => setShowUpdateModal(false)}
            setRefrescar={setRefrescar}
            empleadoCarta={showUpdateModal}
          />
        )}
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  )
}

export default EmployeesBack
