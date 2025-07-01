import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { buscarContratoPorEmpleado } from './Get/Get'
import { BtnBack } from '../../UI/Login_Register/BtnBack'
import ButtonBack from '../UI/ButtonBack/ButtonBack'
import CardContractsBack from './Get/CardContractsBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const ContractsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [contratos, setContratos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [admins, setAdmins] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [contratoBuscado, setContratoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const contenedorRef = useRef(null)
  const inputRef = useRef(null)

  const URL_EMPLEADOS = 'https://redgas.onrender.com/EmpleadoGetAll'
  const URL_ADMINS = 'https://redgas.onrender.com/AdminGetAll'
  const URL_CONTRATOS = 'https://redgas.onrender.com/ContratoGetAllPaginated'

  async function fetchEmpleados() {
    try {
      const res = await fetch(URL_EMPLEADOS)
      if (!res.ok) throw new Error('Error al obtener empleados')
      const data = await res.json()
      setEmpleados(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchAdmins() {
    try {
      const res = await fetch(URL_ADMINS)
      if (!res.ok) throw new Error('Error al obtener admins')
      const data = await res.json()
      setAdmins(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchContratos(pagina = 1) {
    try {
      const res = await fetch(`${URL_CONTRATOS}?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener contratos')
      const data = await res.json()
      const resultado = data.data

      setContratos(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchContratos(paginaActual)
    fetchEmpleados()
    fetchAdmins()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchContratos(1)
      setPaginaActual(1)
      setRefrescar(false)
      setContratoBuscado(null)
      setErrorBusqueda('')
      setCorreoBusqueda('')
    }
  }, [refrescar])

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      return
    }
    const filtrados = empleados.filter((empleado) =>
      empleado.correo_empleado.toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, empleados])

  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
        setSugerencias([])
      }
    }
    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setContratoBuscado(null)
      setErrorBusqueda('')
    }
  }, [correoBusqueda])

  const abrirModalActualizar = (contrato) => {
    setContratoSeleccionado(contrato)
    setShowUpdateModal(true)
  }

  const cerrarModal = () => {
    setShowUpdateModal(false)
    setContratoSeleccionado(null)
  }

  const buscarContrato = async () => {
    setErrorBusqueda('')
    setContratoBuscado(null)
    try {
      const empleado = empleados.find(
        (e) => e.correo_empleado.toLowerCase() === correoBusqueda.toLowerCase().trim()
      )
      if (!empleado) {
        setErrorBusqueda('Empleado no encontrado')
        return
      }
      const contrato = await buscarContratoPorEmpleado(empleado.id_empleado)
      setContratoBuscado(contrato)
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  const buscarContratoConEmpleado = async (empleado) => {
    setErrorBusqueda('')
    setContratoBuscado(null)
    try {
      if (!empleado) {
        setErrorBusqueda('Empleado no encontrado')
        return
      }
      const contrato = await buscarContratoPorEmpleado(empleado.id_empleado)
      setContratoBuscado(contrato)
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div>
          <h1 className="font-bold text-[20px]">Contrato BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin' />
          </div>
        </div>

        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
            <InputLabel
              type="1"
              ForID="contrato_busqueda"
              placeholder="Buscar contrato"
              childLabel="Buscar contrato"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full"
              placeholderError={!!errorBusqueda}
            />
            <button
              onClick={buscarContrato}
              aria-label="Buscar contrato"
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
                  onClick={async () => {
                    setCorreoBusqueda(empleado.correo_empleado)
                    setSugerencias([])
                    await buscarContratoConEmpleado(empleado)
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {empleado.nombre_empleado} - {empleado.correo_empleado}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contratoBuscado ? (
          Array.isArray(contratoBuscado) ? (
            contratoBuscado.map((contrato) => (
              <CardContractsBack
                key={contrato.id_contrato}
                contrato={contrato}
                setRefrescar={setRefrescar}
                onUpdateClick={abrirModalActualizar}
                empleados={empleados}
                admins={admins}
              />
            ))
          ) : (
            <CardContractsBack
              key={contratoBuscado.id_contrato}
              contrato={contratoBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
              empleados={empleados}
              admins={admins}
            />
          )
        ) : (
          contratos.map((contrato) => (
            <CardContractsBack
              key={contrato.id_contrato}
              contrato={contrato}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
              empleados={empleados}
              admins={admins}
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
          empleados={empleados}
          admins={admins}
        />
      )}
      {showUpdateModal && contratoSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          contratoCarta={contratoSeleccionado}
        />
      )}
    </div>
  )
}

export default ContractsBack
