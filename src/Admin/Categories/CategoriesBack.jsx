import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { buscarCategoriaPorNombre } from './Get/Get'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardCategoriesBack from './Get/CardCategoriesBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const CategoriesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [categoriaBuscada, setCategoriaBuscada] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const contenedorRef = useRef(null)

  const fetchCategorias = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/CategoriaGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener categorias')
      const data = await res.json()
      const resultado = data.data

      setCategorias(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategorias(paginaActual)
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchCategorias(1)
      setPaginaActual(1)
      setRefrescar(false)
      setCategoriaBuscada(null)
      setErrorBusqueda('')
      setNombreBusqueda('')
    }
  }, [refrescar])

  const abrirModalActualizar = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setShowUpdateModal(true)
  }

  const cerrarModal = () => {
    setShowUpdateModal(false)
    setCategoriaSeleccionada(null)
  }

  const buscarCategoria = async () => {
    setErrorBusqueda('')
    setCategoriaBuscada(null)

    try {
      const resultado = await buscarCategoriaPorNombre(nombreBusqueda)
      setCategoriaBuscada(resultado)
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  useEffect(() => {
    if ((nombreBusqueda || '').trim() === '') {
      setSugerencias([])
      return
    }

    const filtradas = categorias.filter((cat) =>
      (cat.nombre_categoria || '').toLowerCase().includes(nombreBusqueda.toLowerCase())
    )
    setSugerencias(filtradas.slice(0, 5))
  }, [nombreBusqueda, categorias])

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
      <div className="flex items-center gap-[20px] flex-wrap">
        <div>
          <h1 className="font-bold text-[20px]">Categoría BACK-OFFICE</h1>
           <div className='btnDown'>
            <BtnBack To='/Admin'  />
          </div>
        </div>

        {/* Input de búsqueda con sugerencias */}
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <InputLabel
              type="1"
              ForID="nombre_categoria_busqueda"
              placeholder="Buscar categoría"
              childLabel="Buscar categoría"
              value={nombreBusqueda}
              onChange={e => setNombreBusqueda(e.target.value)}
              className="w-full"
            />
            <button
              onClick={buscarCategoria}
              aria-label="Buscar categoría"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((categoria) => (
                <li
                  key={categoria.id_categoria}
                  onClick={() => {
                    setCategoriaBuscada(categoria)
                    setNombreBusqueda(categoria.nombre_categoria)
                    setSugerencias([])
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {categoria.nombre_categoria}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoriaBuscada ? (
          <CardCategoriesBack
            key={categoriaBuscada.id_categoria}
            categoria={categoriaBuscada}
            setRefrescar={setRefrescar}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          categorias.map((categoria) => (
            <CardCategoriesBack
              key={categoria.id_categoria}
              categoria={categoria}
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
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}

      {showUpdateModal && categoriaSeleccionada && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          categoriaCarta={categoriaSeleccionada}
        />
      )}
    </div>
  )
}

export default CategoriesBack
