import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import CardsFacturesBack from './Get/CardFacturesBack';
import Inputs from '../UI/Inputs/Inputs';

export const FacturesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [facturasOriginal, setFacturasOriginal] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const [clienteCorreoBusqueda, setClienteCorreoBusqueda] = useState('');
  const [empleadoBusqueda, setEmpleadoBusqueda] = useState('');
  const [clienteSugerencias, setClienteSugerencias] = useState([]);
  const [empleadoSugerencias, setEmpleadoSugerencias] = useState([]);

  // Usamos dos refs separados
  const contenedorRefCliente = useRef(null);
  const contenedorRefEmpleado = useRef(null);

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

  const handleClienteInput = (texto) => {
    setClienteCorreoBusqueda(texto);
    if (texto.trim() === '') {
      setClienteSugerencias([]);
      return;
    }
    const sugerencias = clientes.filter(c =>
      c.correo_cliente.toLowerCase().includes(texto.toLowerCase()) ||
      c.nombre_cliente.toLowerCase().includes(texto.toLowerCase())
    );
    setClienteSugerencias(sugerencias.slice(0, 5));
  };

  const handleEmpleadoInput = (texto) => {
    setEmpleadoBusqueda(texto);
    if (texto.trim() === '') {
      setEmpleadoSugerencias([]);
      return;
    }
    const sugerencias = empleados.filter(e =>
      e.nombre_empleado.toLowerCase().includes(texto.toLowerCase()) ||
      e.correo_empleado.toLowerCase().includes(texto.toLowerCase())
    );
    setEmpleadoSugerencias(sugerencias.slice(0, 5));
  };

  const handleBuscar = () => {
    let resultado = [...facturasOriginal];

    if (clienteCorreoBusqueda.trim() !== '') {
      const clienteEncontrado = clientes.find(
        (c) =>
          c.correo_cliente.toLowerCase() === clienteCorreoBusqueda.trim().toLowerCase() ||
          c.nombre_cliente.toLowerCase() === clienteCorreoBusqueda.trim().toLowerCase()
      );
      if (clienteEncontrado) {
        resultado = resultado.filter((f) => f.id_cliente === clienteEncontrado.id_cliente);
      } else {
        resultado = [];
      }
    }

    if (empleadoBusqueda.trim() !== '') {
      const empleadoEncontrado = empleados.find(
        (e) =>
          e.nombre_empleado.toLowerCase() === empleadoBusqueda.trim().toLowerCase() ||
          e.correo_empleado.toLowerCase() === empleadoBusqueda.trim().toLowerCase()
      );
      if (empleadoEncontrado) {
        resultado = resultado.filter((f) => f.id_empleado === empleadoEncontrado.id_empleado);
      } else {
        resultado = [];
      }
    }

    setFacturas(resultado);
  };

  const handleLimpiar = () => {
    setClienteCorreoBusqueda('');
    setEmpleadoBusqueda('');
    setClienteSugerencias([]);
    setEmpleadoSugerencias([]);
    setFacturas(facturasOriginal);
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        contenedorRefCliente.current &&
        !contenedorRefCliente.current.contains(e.target)
      ) {
        setClienteSugerencias([]);
      }
      if (
        contenedorRefEmpleado.current &&
        !contenedorRefEmpleado.current.contains(e.target)
      ) {
        setEmpleadoSugerencias([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Inputs
            Type="1"
            Place="Buscar por cliente"
            Value={clienteCorreoBusqueda}
            onChange={(e) => handleClienteInput(e.target.value)}
          />
          {clienteSugerencias.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow w-full">
              {clienteSugerencias.map(cliente => (
                <div
                  key={cliente.id_cliente}
                  onClick={() => {
                    setClienteCorreoBusqueda(cliente.correo_cliente);
                    setClienteSugerencias([]);
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
          <Inputs
            Type="1"
            Place="Buscar por empleado"
            Value={empleadoBusqueda}
            onChange={(e) => handleEmpleadoInput(e.target.value)}
          />
          {empleadoSugerencias.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow w-full">
              {empleadoSugerencias.map(empleado => (
                <div
                  key={empleado.id_empleado}
                  onClick={() => {
                    setEmpleadoBusqueda(empleado.nombre_empleado);
                    setEmpleadoSugerencias([]);
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
    </div>
  );
};

export default FacturesBack;
