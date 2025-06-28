import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import CardClientsBack from './Get/CardClientsBack';
import { buscarClientePorCorreo } from './Get/Get';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';
import { Buttons } from '../../UI/Login_Register/Buttons';

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
    <section className="w-full h-full flex flex-col p-[5px_20px_10px_5px]">
      <BtnBack To='/Admin' />
      <div className="p-[10px_20px_10px_20px] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Cliente BACK-OFFICE</h1>
        <div className="p-[0_20px_10px_20px] w-fit flex flex-col gap-2 NeoContainer_outset_TL">
          {/* Búsqueda con autocomplete */}
          <div className="" ref={contenedorRef}>
            <div className="flex w-fit items-end gap-4 bg-white">
              <InputLabel
                type="1"
                ForID="correo_cliente_busqueda"
                placeholder="Buscar cliente"
                radius='10'
                className='relative'
                childLabel="Buscar cliente"
                value={correoBusqueda}
                onChange={e => setCorreoBusqueda(e.target.value)}
                placeholderError={!!errorBusqueda}
              />
              <FontAwesomeIcon onClick={buscarCliente} icon={faSearch} className="absolute left-[10px] top-[9px] text-[var(--Font-Nav)]" />
              <Buttons radius='10' nameButton='Registrar' textColor='var(--Font-Nav)' onClick={() => setShowRegisterModal(true)} />
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
    </section>
  );
};

export default ClientsBack;
