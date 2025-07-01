import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import CardCategoriesBack from './Get/CardCategoriesBack'
import { buscarCategoriaPorNombre } from './Get/Get'
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'

export const CategoriesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false) // Aquí guardaremos la categoría seleccionada (objeto) o false
  const [categorias, setCategorias] = useState([])
  const [nombresCategorias, setNombresCategorias] = useState([]) // [{id_categoria, nombre_categoria}]
  const [refrescar, setRefrescar] = useState(false)
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
      if (!res.ok) throw new Error('Error al obtener categorías')
      const data = await res.json()
      const resultado = data.data

      setCategorias(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchNombresCategorias = async () => {
    try {
      const res = await fetch(`https://redgas.onrender.com/CategoriaGetAllNames`)
      if (!res.ok) throw new Error('Error al obtener nombres de categorías')
      const data = await res.json()
      setNombresCategorias(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategorias(paginaActual)
    fetchNombresCategorias()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchCategorias(1)
      fetchNombresCategorias()
      setPaginaActual(1)
      setRefrescar(false)
      setCategoriaBuscada(null)
      setErrorBusqueda('')
      setNombreBusqueda('')
    }
  }, [refrescar])

  const handleUpdateClick = (categoria) => setShowUpdateModal(categoria)

  const buscarCategoria = async (nombre) => {
    setErrorBusqueda('')
    setCategoriaBuscada(null)

    if (!nombre.trim()) {
      fetchCategorias(1)
      setPaginaActual(1)
      return
    }

    try {
      const resultado = await buscarCategoriaPorNombre(nombre.trim())
      if (resultado) {
        setCategoriaBuscada(resultado)
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró una categoría con ese nombre.')
      }
    } catch (error) {
      setErrorBusqueda('Error al buscar categoría.')
    }
  }

  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([])
      setCategoriaBuscada(null)
      return
    }

    const filtradas = nombresCategorias.filter(cat =>
      cat.nombre_categoria?.toLowerCase().includes(nombreBusqueda.toLowerCase())
    )
    setSugerencias(filtradas.slice(0, 5))
  }, [nombreBusqueda, nombresCategorias])

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
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Categorías</h1>

        <div className='NeoContainer_outset_TL flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>
          <div className="relative" ref={contenedorRef}>
            <InputLabel
              radius="10"
              type="1"
              ForID="nombre_categoria_busqueda"
              placeholder="Buscar categoría"
              childLabel="Buscar categoría"
              value={nombreBusqueda}
              onChange={e => setNombreBusqueda(e.target.value)}
              className="w-full"
              placeholderError={!!errorBusqueda}
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow w-[230px]">
                {sugerencias.map(cat => (
                  <li
                    key={cat.id_categoria}
                    onClick={() => {
                      setNombreBusqueda(cat.nombre_categoria)
                      buscarCategoria(cat.nombre_categoria)
                      setSugerencias([])
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {cat.nombre_categoria}
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

        {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

        <div className="flex flex-wrap items-center gap-6">
          {(categoriaBuscada ? [categoriaBuscada] : categorias).map((categoria) => (
            <CardCategoriesBack
              key={categoria.id_categoria}
              categoria={categoria}
              setRefrescar={setRefrescar}
              onUpdateClick={handleUpdateClick}
            />
          ))}
        </div>

        {!categoriaBuscada && (
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
            categoriaCarta={showUpdateModal}
          />
        )}
      </div>
    </section>
  )
}

export default CategoriesBack
