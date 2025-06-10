import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import CardsFacturesBack from './Get/CardFacturesBack';
import Inputs from '../UI/Inputs/Inputs';
import { buscarFacturaPorID } from './Get/Get';

export const FacturesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [idBusqueda, setIdBusqueda] = useState('');
  const [facturaBuscada, setFacturaBuscada] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);

  const contenedorRef = useRef(null);

  const fetchFacturas = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/FacturaGetAll');
      const data = await res.json();
      setFacturas(data.data || []);
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

  const handleBuscarFactura = async () => {
    setErrorBusqueda('');
    setFacturaBuscada(null);

    if (!idBusqueda.trim()) {
      // Si el campo está vacío, solo mostramos todas las facturas
      setFacturaBuscada(null);
      setSugerencias([]);
      return;
    }

    try {
      const resultado = await buscarFacturaPorID(idBusqueda);
      setFacturaBuscada(resultado);
      setSugerencias([]);
    } catch (err) {
      setErrorBusqueda(err.message);
    }
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
      setFacturaBuscada(null);
      setErrorBusqueda('');
      setIdBusqueda('');
    }
  }, [refrescar]);

  useEffect(() => {
    if (!idBusqueda.trim()) {
      setSugerencias([]);
      return;
    }

    const filtradas = facturas.filter((f) =>
      f.id_factura.toString().includes(idBusqueda.trim())
    );
    setSugerencias(filtradas.slice(0, 5)); // máximo 5 sugerencias
  }, [idBusqueda, facturas]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([]);
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
          <BtnBack To='/Admin' className='btnDown' />
        </div>

        {/* Buscador con sugerencias */}
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <Inputs
              type="1"
              placeholder="ID de la factura"
              value={idBusqueda}
              onChange={(e) => setIdBusqueda(e.target.value)}
              className="outline-none"
            />
            <button
              onClick={handleBuscarFactura}
              aria-label="Buscar factura"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((factura) => (
                <li
                  key={factura.id_factura}
                  onClick={() => {
                    setFacturaBuscada(factura);
                    setIdBusqueda(factura.id_factura.toString());
                    setSugerencias([]);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  ID: {factura.id_factura}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {facturaBuscada ? (
          <CardsFacturesBack
            key={facturaBuscada.id_factura}
            factura={facturaBuscada}
            clientes={clientes}
            empleados={empleados}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          facturas.map((factura) => (
            <CardsFacturesBack
              key={factura.id_factura}
              factura={factura}
              clientes={clientes}
              empleados={empleados}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        )}
      </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onFacturaRegistrada={(nuevaFactura) => {
            setFacturas((prev) => [nuevaFactura, ...prev]);
          }}
          setRefrescar={setRefrescar}
        />
      )}

      {showUpdateModal && facturaSeleccionada && (
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
