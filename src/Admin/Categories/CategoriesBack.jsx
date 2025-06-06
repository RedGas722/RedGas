import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardCategoriesBack from './Get/CardCategoriesBack';
import { buscarCategoriaPorNombre } from './Get/Get';
import Inputs from '../UI/Inputs/Inputs';

export const CategoriesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  // Estado para el categoria que se va a actualizar
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Estado para la búsqueda de categoria por correo
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [categoriaBuscada, setCategoriaBuscada] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const URL = 'https://redgas.onrender.com/CategoriaGet';

  async function fetchCategorias() {
    try {
      const res = await fetch('https://redgas.onrender.com/CategoriaGetAll');
      if (!res.ok) throw new Error('Error al obtener categorias');
      const data = await res.json();
      setCategorias(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchCategorias();
      setRefrescar(false);
      // Al refrescar la lista, limpiamos la búsqueda y error para mostrar todas las tarjetas
      setCategoriaBuscada(null);
      setErrorBusqueda('');
      setNombreBusqueda('');
    }
  }, [refrescar]);

  // Función para abrir el modal de actualización con categoria seleccionado
  const abrirModalActualizar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setShowUpdateModal(true);
  };

  // Función para cerrar modal actualización y limpiar estado
  const cerrarModal = () => {
    setShowUpdateModal(false);
    setCategoriaSeleccionada(null);
  };

  const buscarCategoria = async () => {
    setErrorBusqueda('');
    setCategoriaBuscada(null);

    try {
      const resultado = await buscarCategoriaPorNombre(nombreBusqueda);
      setCategoriaBuscada(resultado);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Categoria BACK-OFFICE</h1>
          {/* Barra de búsqueda para consultar categoria */}
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
            <Inputs
              type="1"
              placeholder="Nombre de la categoría"
              value={nombreBusqueda}
              onChange={(e) => setNombreBusqueda(e.target.value)}
              className="outline-none"
            />
            <button
              onClick={buscarCategoria}
              aria-label="Buscar categoria"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />        
      </div>

      {/* Mostrar mensaje de error */}
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      {/* Sección de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoriaBuscada
          ? (
            <CardCategoriesBack
              key={categoriaBuscada.id_categoria}
              categoria={categoriaBuscada}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          )
          : categorias.map((categoria) => (
              <CardCategoriesBack
                key={categoria.id_categoria}
                categoria={categoria}
                setRefrescar={setRefrescar}
                onUpdateClick={abrirModalActualizar}
              />
            ))
        }
      </div>

      {/* Modales */}
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
  );
};

export default CategoriesBack;
