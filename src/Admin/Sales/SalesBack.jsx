import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import CardSalesBack from './Get/CardSalesBack';
import Inputs from '../UI/Inputs/Inputs';
import { useBuscarSales } from './Get/Get';

export const SalesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [ventasOriginal, setVentasOriginal] = useState([]);
  const [productos, setProductos] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  const fetchVentas = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/PedidoProductoGetAll');
      const data = await res.json();
      setVentas(data.data || []);
      setVentasOriginal(data.data || []);
    } catch (error) {
      console.error('Error al obtener ventas', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/ProductoGetAll');
      const data = await res.json();
      setProductos(Array.isArray(data.data.productos) ? data.data.productos : []);
    } catch (error) {
      console.error('Error al obtener productos', error);
    }
  };

  const {
    productoBusqueda, productoSugerencias,
    handleProductoInput, handleBuscar, handleLimpiar,
    contenedorRefProducto, setProductoBusqueda
  } = useBuscarSales(productos, ventasOriginal, setVentas);

  useEffect(() => {
    fetchVentas();
    fetchProductos();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchVentas();
      setRefrescar(false);
      handleLimpiar();
    }
  }, [refrescar]);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <div>
          <h1 className="font-bold text-[20px]">Ventas BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin' />
          </div>
        </div>

        <div className="relative" ref={contenedorRefProducto}>
          <Inputs
            Type="1"
            Place="Buscar por producto"
            Value={productoBusqueda}
            onChange={(e) => handleProductoInput(e.target.value)}
          />
          {productoSugerencias.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow w-full">
              {productoSugerencias.map(prod => (
                <div
                  key={prod.id_producto}
                  onClick={() => setProductoBusqueda(prod.nombre_producto)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {prod.nombre_producto}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleBuscar} className="bg-blue-500 text-white px-4 py-2 rounded">
          Buscar
        </button>
        <button onClick={handleLimpiar} className="bg-gray-300 px-4 py-2 rounded">
          Limpiar
        </button>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ventas.map((venta) => (
          <CardSalesBack
            key={venta.id_pedidoProducto}
            venta={venta}
            productos={productos}
          />
        ))}
      </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
        />
      )}
    </div>
  );
};

export default SalesBack;
