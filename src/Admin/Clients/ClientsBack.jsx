import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardClientsBack from './Get/CardClientsBack';
import { buscarClientePorCorreo } from './Get/Get';
import Inputs from '../UI/Inputs/Inputs';

export const ClientsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [clienteBuscado, setClienteBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);

  const contenedorRef = useRef(null);

  const fetchClientes = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/ClienteGetAll');
      if (!res.ok) throw new Error('Error al obtener clientes');
      const data = await res.json();
      setClientes(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchClientes();
      setRefrescar(false);
      setClienteBuscado(null);
      setErrorBusqueda('');
      setCorreoBusqueda('');
    }
  }, [refrescar]);

  const abrirModalActualizar = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowUpdateModal(true);
  };

  const cerrarModal = () => {
    setShowUpdateModal(false);
    setClienteSeleccionado(null);
  };

  const buscarCliente = async () => {
    setErrorBusqueda('');
    setClienteBuscado(null);

    try {
      const resultado = await buscarClientePorCorreo(correoBusqueda);
      setClienteBuscado(resultado);
      setSugerencias([]);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  // 🧠 Autocomplete filtrando localmente
  useEffect(() => {
  if ((correoBusqueda || '').trim() === '') {
    setSugerencias([]);
    return;
  }

  const filtrados = clientes.filter((cliente) =>
    (cliente.correo_cliente || '').toLowerCase().includes(correoBusqueda.toLowerCase())
  );
  setSugerencias(filtrados.slice(0, 5));
  }, [correoBusqueda, clientes]);

  // 🧽 Cerrar sugerencias si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target)
      ) {
        setSugerencias([]);
      }
    };

    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <h1 className="font-bold text-[20px]">Cliente BACK-OFFICE</h1>

        {/* Búsqueda con autocomplete */}
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <Inputs
              type="1"
              placeholder="Correo del cliente"
              value={correoBusqueda}
              onChange={(e) => setCorreoBusqueda(e.target.value)}
              className="outline-none"
            />
            <button
              onClick={buscarCliente}
              aria-label="Buscar cliente"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((cliente) => (
                <li
                  key={cliente.id_cliente}
                  onClick={() => {
                    setClienteBuscado(cliente);
                    setCorreoBusqueda(cliente.correo_cliente);
                    setSugerencias([]);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {cliente.correo_cliente}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clienteBuscado ? (
          <CardClientsBack
            key={clienteBuscado.id_cliente}
            cliente={clienteBuscado}
            setRefrescar={setRefrescar}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          clientes.map((cliente) => (
            <CardClientsBack
              key={cliente.id_cliente}
              cliente={cliente}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        )}
      </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
        />
      )}

      {showUpdateModal && clienteSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          clienteCarta={clienteSeleccionado}
        />
      )}
    </div>
  );
};

export default ClientsBack;
