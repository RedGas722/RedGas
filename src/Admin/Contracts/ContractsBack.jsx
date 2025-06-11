import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { buscarContratoPorEmpleado } from './Get/Get';
import { BtnBack } from '../../UI/Login_Register/BtnBack';
import ButtonBack from '../UI/ButtonBack/ButtonBack';
import CardContractsBack from './Get/CardContractsBack';
import Inputs from '../UI/Inputs/Inputs';

export const ContractsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [idBusqueda, setIdBusqueda] = useState('');
  const [contratoBuscado, setContratoBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const contenedorRef = useRef(null);
  const inputRef = useRef(null);

  const URL = 'https://redgas.onrender.com/ContratoGet';

  async function fetchContratos() {
    try {
      const res = await fetch('https://redgas.onrender.com/ContratoGetAll');
      if (!res.ok) throw new Error('Error al obtener contratos');
      const data = await res.json();
      setContratos(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchContratos();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchContratos();
      setRefrescar(false);
      setContratoBuscado(null);
      setErrorBusqueda('');
      setIdBusqueda('');
    }
  }, [refrescar]);

  // 🧠 Autocomplete filtrando contratos localmente
  useEffect(() => {
    if (idBusqueda.trim() === '') {
      setSugerencias([]);
      return;
    }
    const filtrados = contratos.filter((contrato) =>
      contrato.id_empleado && contrato.id_empleado.toString().includes(idBusqueda)
    );
    setSugerencias(filtrados.slice(0, 5));
  }, [idBusqueda, contratos]);

  // 🧽 Cierre del dropdown si se hace clic fuera
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

  // Limpia contratoBuscado y errorBusqueda si el input queda vacío
  useEffect(() => {
    if (idBusqueda.trim() === '') {
      setContratoBuscado(null);
      setErrorBusqueda('');
    }
  }, [idBusqueda]);

  const abrirModalActualizar = (contrato) => {
    setContratoSeleccionado(contrato);
    setShowUpdateModal(true);
  };

  const cerrarModal = () => {
    setShowUpdateModal(false);
    setContratoSeleccionado(null);
  };

  const buscarContrato = async () => {
    setErrorBusqueda('');
    setContratoBuscado(null);
    try {
      const contrato = await buscarContratoPorEmpleado(idBusqueda);
      setContratoBuscado(contrato);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div>
          <h1 className="font-bold text-[20px]">Contrato BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin' />
          </div>
        </div>
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
            <Inputs
              type="1"
              placeholder="ID del empleado"
              value={idBusqueda}
              onChange={(e) => setIdBusqueda(e.target.value)}
              className="outline-none"
              ref={inputRef}
            />
            <button
              onClick={buscarContrato}
              aria-label="Buscar contrato"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>
          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((contrato) => (
                <li
                  key={contrato.id_contrato}
                  onClick={() => {
                    setContratoBuscado(contrato);
                    setIdBusqueda(contrato.id_empleado.toString());
                    setSugerencias([]);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {contrato.id_empleado}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contratoBuscado && (Array.isArray(contratoBuscado) ? contratoBuscado.length > 0 : contratoBuscado.id_contrato) ? (
          Array.isArray(contratoBuscado)
            ? contratoBuscado.map((contrato) => (
              <CardContractsBack
                key={contrato.id_contrato}
                contrato={contrato}
                setRefrescar={setRefrescar}
                onUpdateClick={abrirModalActualizar}
              />
            ))
            : <CardContractsBack
              key={contratoBuscado.id_contrato}
              contrato={contratoBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
        ) : contratoBuscado && (Array.isArray(contratoBuscado) ? contratoBuscado.length === 0 : !contratoBuscado.id_contrato) ? (
          <div className="col-span-full text-yellow-700 bg-yellow-100 p-4 rounded text-center font-semibold">
            No se encontró contrato para este empleado.
          </div>
        ) : (
          contratos.map((contrato) => (
            <CardContractsBack
              key={contrato.id_contrato}
              contrato={contrato}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        )}
      </div>
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}
      {showUpdateModal && contratoSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          contratoCarta={contratoSeleccionado}
        />
      )}
    </div>
  );
};

export default ContractsBack;
