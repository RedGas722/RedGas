import { useState, useEffect } from 'react';
import CardsFacturesBack from './Get/CardFacturesBack';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';

export const FacturesBack = () => {
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false); // Aquí se maneja el refresco

  const fetchFacturas = async () => {
    try {
      const res = await fetch('http://localhost:10101/FacturaGetAll');
      const data = await res.json();
      setFacturas(data.data || []);
    } catch (error) {
      console.error('Error al obtener facturas', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch('http://localhost:10101/ClienteGetAll');
      const data = await res.json();
      setClientes(data.data || []);
    } catch (error) {
      console.error('Error al obtener clientes', error);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('http://localhost:10101/EmpleadoGetAll');
      const data = await res.json();
      setEmpleados(data.data || []);
    } catch (error) {
      console.error('Error al obtener empleados', error);
    }
  };

  useEffect(() => {
    fetchFacturas();
    fetchClientes();
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchFacturas(); // Recarga las facturas cuando se activa el refresco
      setRefrescar(false); // Resetea el refresco para evitar recargas continuas
    }
  }, [refrescar]);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Factura BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
      </div>

      <div className="flex flex-wrap gap-4">
        {facturas.map(factura => (
            <CardsFacturesBack key={factura.id_factura} factura={factura} clientes={clientes} empleados={empleados} />
        ))}
        </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onFacturaRegistrada={(nuevaFactura) => {
            setFacturas(prev => [nuevaFactura, ...prev]);
          }}
          setRefrescar={setRefrescar}
        />
      )}

      {showGetModal && (
        <GetModal
          onClose={() => setShowGetModal(false)}
          clientes={clientes}
          empleados={empleados}
        />
      )}

      {showUpdateModal && (
        <UpdateModal onClose={() => setShowUpdateModal(false)} setRefrescar={setRefrescar} />
      )}
    </div>
  );
};

export default FacturesBack;
