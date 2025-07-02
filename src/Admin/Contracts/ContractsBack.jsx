import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { BtnBack } from '../../UI/Login_Register/BtnBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import CardContractsBack from './Get/CardContractsBack'
import { buscarContratoPorEmpleado } from './Get/Get'
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'

export const ContractsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [contratos, setContratos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [admins, setAdmins] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [contratoBuscado, setContratoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const contenedorRef = useRef(null)

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/EmpleadoGetAll')
      if (!res.ok) throw new Error('Error al obtener empleados')
      const data = await res.json()
      setEmpleados(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAdmins = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/AdminGetAll')
      if (!res.ok) throw new Error('Error al obtener admins')
      const data = await res.json()
      setAdmins(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchContratos = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/ContratoGetAllPaginated?page=${pagina}`)
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
    const filtrados = empleados.filter(empleado =>
      empleado.correo_empleado.toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, empleados])

  useEffect(() => {
    const manejarClickFuera = e => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([])
      }
    }
    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  useEffect(() => {
      if (correoBusqueda.trim() === '') {
        // Cuando el input esté vacío, limpiar la búsqueda y mostrar todos los contratos
        setContratoBuscado(null)
        setErrorBusqueda('')
        fetchContratos(1)
        setPaginaActual(1)
      }
    }, [correoBusqueda])

  const buscarContrato = async (correo) => {
    setErrorBusqueda('')
    setContratoBuscado(null)

    try {
      const empleado = empleados.find(e => e.correo_empleado.toLowerCase() === correo.toLowerCase().trim())
      if (!empleado) {
        setErrorBusqueda('Empleado no encontrado')
        return
      }
      const contrato = await buscarContratoPorEmpleado(empleado.id_empleado)
      if (contrato) {
        setContratoBuscado(contrato)
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró contrato para ese empleado.')
      }
    } catch (error) {
      setErrorBusqueda('Error al buscar contrato.')
    }
  }

  const handleUpdateClick = (contrato) => setShowUpdateModal(contrato)

  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To="/Admin" />

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl z-[2] text-[var(--main-color)]">Contratos</h1>

        <div className="NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]">
          <div className="relative" ref={contenedorRef}>
            <InputLabel
              radius="10"
              type="1"
              ForID="correo_empleado_busqueda"
              placeholder="Buscar contrato por correo"
              childLabel="Buscar contrato"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full"
              placeholderError={!!errorBusqueda}
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow w-[230px]">
                {sugerencias.map(emp => (
                  <li
                    key={emp.id_empleado}
                    onClick={() => {
                      setCorreoBusqueda(emp.correo_empleado)
                      buscarContrato(emp.correo_empleado)
                      setSugerencias([])
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {emp.nombre_empleado} - {emp.correo_empleado}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex w-fit h-fit flex-wrap justify-center items-center gap-[20px]">
            <Buttons
              radius="10"
              nameButton="Registrar"
              textColor="var(--Font-Nav)"
              Onclick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

        <div className="flex flex-wrap items-center gap-6">
          {(contratoBuscado
            ? Array.isArray(contratoBuscado) ? contratoBuscado : [contratoBuscado]
            : contratos
          ).map(contrato => (
            <CardContractsBack
              key={contrato.id_contrato}
              contrato={contrato}
              setRefrescar={setRefrescar}
              onUpdateClick={handleUpdateClick}
              empleados={empleados}
              admins={admins}
            />
          ))}
        </div>

        {!contratoBuscado && (
          <Paginator
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={nuevaPagina => {
              if (nuevaPagina !== paginaActual) {
                setPaginaActual(nuevaPagina)
              }
            }}
          />
        )}

        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
            empleados={empleados}
            admins={admins}
          />
        )}

        {showUpdateModal && (
          <UpdateModal
            onClose={() => setShowUpdateModal(false)}
            setRefrescar={setRefrescar}
            contratoCarta={showUpdateModal}
          />
        )}
      </div>
    </section>
  )
}

export default ContractsBack
