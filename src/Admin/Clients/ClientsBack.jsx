import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardClientsBack from './Get/CardClientsBack';
import { buscarClientePorCorreo } from './Get/Get';

export const ClientsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  // Estado para el cliente que se va a actualizar
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Estado para la búsqueda de cliente por correo
  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [clienteBuscado, setClienteBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const URL = 'https://redgas.onrender.com/ClienteGet';

  async function fetchClientes() {
    try {
      const res = await fetch('https://redgas.onrender.com/ClienteGetAll');
      if (!res.ok) throw new Error('Error al obtener clientes');
      const data = await res.json();
      setClientes(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchClientes();
      setRefrescar(false);
      // Al refrescar la lista, limpiamos la búsqueda y error para mostrar todas las tarjetas
      setClienteBuscado(null);
      setErrorBusqueda('');
      setCorreoBusqueda('');
    }
  }, [refrescar]);

  // Función para abrir el modal de actualización con cliente seleccionado
  const abrirModalActualizar = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowUpdateModal(true);
  };

  // Función para cerrar modal actualización y limpiar estado
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
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Cliente BACK-OFFICE</h1>
          {/* Barra de búsqueda para consultar cliente */}
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
            <input
              type="text"
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
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />        
      </div>

      {/* Mostrar mensaje de error */}
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      {/* Sección de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clienteBuscado
          ? (
            <CardClientsBack
              key={clienteBuscado.id_cliente}
              cliente={clienteBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          )
          : clientes.map((cliente) => (
              <CardClientsBack
                key={cliente.id_cliente}
                cliente={cliente}
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
