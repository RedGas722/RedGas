import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardsProductsBack from './Get/CardProductsBack';
import Inputs from '../UI/Inputs/Inputs';
import { buscarProductoPorNombre } from './Get/Get'; // <-- Importación agregada

export const ProductsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Estados para búsqueda por nombre
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [productoBuscado, setProductoBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const URL_ALL = 'https://redgas.onrender.com/ProductoGetAll';

  async function fetchProductos() {
    try {
      const res = await fetch(URL_ALL);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProductos(data.data.productos || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchProductos();
      setRefrescar(false);
      setProductoBuscado(null);
      setErrorBusqueda('');
      setNombreBusqueda('');
    }
  }, [refrescar]);

  const abrirModalActualizar = (producto) => {
    setProductoSeleccionado(producto);
    setShowUpdateModal(true);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setShowUpdateModal(false);
  };

  const buscarProducto = async () => {
    setErrorBusqueda('');
    setProductoBuscado(null);

    try {
      const resultado = await buscarProductoPorNombre(nombreBusqueda);
      setProductoBuscado(resultado);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <h1 className="font-bold text-[20px]">Producto BACK-OFFICE</h1>

        {/* Búsqueda por nombre */}
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
          <Inputs
            type="1"
            placeholder="Nombre del producto"
            value={nombreBusqueda}
            onChange={(e) => setNombreBusqueda(e.target.value)}
            className="outline-none"
          />
          <button
            onClick={buscarProducto}
            aria-label="Buscar producto"
            className="text-gray-600 hover:text-gray-900"
          >
            🔍
          </button>
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {/* Mensaje de error */}
      {errorBusqueda && (
        <p className="text-red-600 text-sm">{errorBusqueda}</p>
      )}

      {/* Mensaje de reset */}
      {mensaje && (
        <div className="mt-2 text-sm text-center text-green-600 font-semibold">
          {mensaje}
        </div>
      )}

      {/* Tarjetas de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productoBuscado ? (
          <CardsProductsBack
            key={productoBuscado.id_producto}
            producto={productoBuscado}
            setRefrescar={setRefrescar}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          productos.map((producto) => (
            <CardsProductsBack
              key={producto.id_producto}
              producto={producto}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        )}
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
        />
      )}

      {showUpdateModal && productoSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          productoCarta={productoSeleccionado}
        />
      )}
    </div>
  );
};

export default ProductsBack;
