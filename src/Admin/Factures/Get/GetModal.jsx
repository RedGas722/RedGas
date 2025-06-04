import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const GetModal = ({ onClose, clientes, empleados }) => {
  const [IDfactura, setIDfactura] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});

  const URL = 'https://redgas.onrender.com/FacturaGet';

  const validarCampos = () => {
    const errores = {};

    if (!IDfactura.trim()) {
      errores.id_factura = 'El ID de la factura es obligatorio.';
    } else if (!/^\d+$/.test(IDfactura)) {
      errores.id_factura = 'El ID de la factura debe ser un número entero positivo.';
    }

    return errores;
  };

  const handleGet = async (e) => {
    e.preventDefault();

    const erroresValidacion = validarCampos();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      setMensaje(null);
      return;
    }

    setErrores({});
    try {
      const res = await fetch(`${URL}?id_factura=${encodeURIComponent(IDfactura)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.errors?.[0]?.msg || 'Error al consultar la factura.';
        setMensaje({ error: errorMsg });
        return;
      }

      if (!data?.data || data.data.length === 0) {
        setMensaje({ error: 'Factura no encontrada con ese ID.' });
        return;
      }

      setMensaje({ ...data, data: data.data[0] });
    } catch (err) {
      console.error(err);
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setIDfactura('');
    setMensaje(null);
    setErrores({});
  };

  // Buscar nombre y correo
  const getClienteInfo = (id) => {
    const cliente = clientes?.find(c => c.id_cliente === id);
    return {
      nombre: cliente?.nombre_cliente || 'Desconocido',
      correo: cliente?.correo_cliente || 'No disponible',
    };
  };

  const getEmpleadoInfo = (id) => {
    const empleado = empleados?.find(e => e.id_empleado === id);
    return {
      nombre: empleado?.nombre_empleado || 'Desconocido',
      correo: empleado?.correo_empleado || 'No disponible',
    };
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Consultar Factura</h2>

        <Inputs
          Type='5'
          Place='ID de la factura'
          Value={IDfactura}
          onChange={(e) => setIDfactura(e.target.value)}
        />
        {errores.id_factura && <p className="text-red-600 text-sm">{errores.id_factura}</p>}

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleGet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Consultar
          </button>
        </div>

        {mensaje && mensaje.error && (
          <p className="text-red-600 text-center font-semibold text-sm mt-2">{mensaje.error}</p>
        )}

        {mensaje && mensaje.data && (
        <div className="bg-gray-100 p-3 rounded mt-2 text-sm space-y-2">

          <p><strong>ID Factura:</strong> {mensaje.data.id_factura}</p>

          {/* Sección Cliente */}
          <hr className="my-2 border-gray-300" />
          <h3 className="font-semibold text-gray-700">Datos del Cliente</h3>
          <p><strong>Nombre:</strong> {getClienteInfo(mensaje.data.id_cliente).nombre}</p>
          <p><strong>Correo:</strong> {getClienteInfo(mensaje.data.id_cliente).correo}</p>

          {/* Sección Empleado */}
          <hr className="my-2 border-gray-300" />
          <h3 className="font-semibold text-gray-700">Datos del Empleado</h3>
          <p><strong>Nombre:</strong> {getEmpleadoInfo(mensaje.data.id_empleado).nombre}</p>
          <p><strong>Correo:</strong> {getEmpleadoInfo(mensaje.data.id_empleado).correo}</p>

          {/* Otros campos */}
          <hr className="my-2 border-gray-300" />
          <p><strong>Fecha Factura:</strong> {mensaje.data.fecha_factura}</p>
          <p><strong>Estado Factura:</strong> {mensaje.data.estado_factura}</p>
          <p><strong>Total:</strong> ${mensaje.data.total}</p>
        </div>
      )}
      </div>
    </div>
  );
};
