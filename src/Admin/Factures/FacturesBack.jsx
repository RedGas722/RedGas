import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import CardsFacturesBack from './Get/CardFacturesBack';
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';
import { useBuscarFacturas } from './Get/Get';
import { ProductsModal } from './Get/ProductsModal';

export const FacturesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [facturasOriginal, setFacturasOriginal] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [facturaParaProductos, setFacturaParaProductos] = useState(null);

  const fetchFacturas = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/FacturaGetAll');
      const data = await res.json();
      setFacturas(data.data || []);
      setFacturasOriginal(data.data || []);
    } catch (error) {
      console.error('Error al obtener facturas', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/ClienteGetAll');
      const data = await res.json();
      setClientes(data.data || []);
    } catch (error) {
      console.error('Error al obtener clientes', error);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/EmpleadoGetAll');
      const data = await res.json();
      setEmpleados(data.data || []);
    } catch (error) {
      console.error('Error al obtener empleados', error);
    }
  };

  const {
    clienteCorreoBusqueda, empleadoBusqueda,
    clienteSugerencias, empleadoSugerencias,
    handleClienteInput, handleEmpleadoInput,
    handleBuscar, handleLimpiar,
    contenedorRefCliente, contenedorRefEmpleado,
    setClienteCorreoBusqueda, setEmpleadoBusqueda
  } = useBuscarFacturas(clientes, empleados, facturasOriginal, setFacturas);

  const abrirModalActualizar = (factura) => {
    setFacturaSeleccionada(factura);
    setShowUpdateModal(true);
  };

  const cerrarModalActualizar = () => {
    setFacturaSeleccionada(null);
    setShowUpdateModal(false);
  };

  useEffect(() => {
    fetchFacturas();
    fetchClientes();
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchFacturas();
      setRefrescar(false);
      handleLimpiar();
    }
  }, [refrescar]);

    const abrirModalProductos = (factura) => {
    setFacturaParaProductos(factura);
    setShowProductsModal(true);
  };

  const cerrarModalProductos = () => {
    setShowProductsModal(false);
    setFacturaParaProductos(null);
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <div>
          <h1 className="font-bold text-[20px]">Factura BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin' />
          </div>
        </div>

        {/* Autocompletado cliente */}
        <div className="relative" ref={contenedorRefCliente}>
          <InputLabel
            type="1"
            ForID="clienteBusqueda"
            placeholder="Buscar por cliente"
            childLabel="Buscar por cliente"
            value={clienteCorreoBusqueda}
            onChange={(e) => handleClienteInput(e.target.value)}
            placeholderError={!!errorBusquedaCliente}
          />
          {clienteSugerencias.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow w-full">
              {clienteSugerencias.map(cliente => (
                <div
                  key={cliente.id_cliente}
                  onClick={() => {
                    setClienteCorreoBusqueda(cliente.correo_cliente);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {cliente.nombre_cliente} - {cliente.correo_cliente}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Autocompletado empleado */}
        <div className="relative" ref={contenedorRefEmpleado}>
          <InputLabel
            type="1"
            ForID="empleadoBusqueda"
            placeholder="Buscar por empleado"
            childLabel="Buscar por empleado"
            value={empleadoBusqueda}
            onChange={(e) => handleEmpleadoInput(e.target.value)}
            placeholderError={!!errorBusquedaEmpleado}
          />
          {empleadoSugerencias.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow w-full">
              {empleadoSugerencias.map(empleado => (
                <div
                  key={empleado.id_empleado}
                  onClick={() => {
                    setEmpleadoBusqueda(empleado.correo_empleado);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {empleado.nombre_empleado} - {empleado.correo_empleado}
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
        {facturas.map((factura) => (
          <CardsFacturesBack
            key={factura.id_factura}
            factura={factura}
            clientes={clientes}
            empleados={empleados}
            onUpdateClick={abrirModalActualizar}
            onViewProductsClick={abrirModalProductos} // 🔥 Nuevo handler
          />
        ))}
      </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
          clientes={clientes}
          empleados={empleados}
        />
      )}

      {showUpdateModal && (
        <UpdateModal
          onClose={cerrarModalActualizar}
          setRefrescar={setRefrescar}
          facturaCarta={facturaSeleccionada}
        />
      )}
      {showProductsModal && facturaParaProductos && (
        <ProductsModal factura={facturaParaProductos} onClose={cerrarModalProductos} />
      )}
    </div>
  );
};

export default FacturesBack;
