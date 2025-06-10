import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/UpdateModal';
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

  const URL = 'http://localhost:10101/ContratoGet';

  async function fetchContratos() {
    try {
      const res = await fetch('http://localhost:10101/ContratoGetAll');
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
      if (!idBusqueda.trim()) throw new Error('Ingrese un ID de empleado');
      const res = await fetch(`${URL}?id_empleado=${encodeURIComponent(idBusqueda)}`);
      if (!res.ok) throw new Error('No se encontró el contrato');
      const data = await res.json();
      if (!data.data) throw new Error('No se encontró el contrato');
      setContratoBuscado(data.data);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Contrato BACK-OFFICE</h1>
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
          <Inputs
            type="1"
            placeholder="ID del empleado"
            value={idBusqueda}
            onChange={(e) => setIdBusqueda(e.target.value)}
            className="outline-none"
          />
          <button
            onClick={buscarContrato}
            aria-label="Buscar contrato"
            className="text-gray-600 hover:text-gray-900"
          >
            🔍
          </button>
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
