import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [IDcliente, setIDcliente] = useState('');
  const [IDempleado, setIDempleado] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [totalFactura, setTotalFactura] = useState(0)
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL = 'https://redgas.onrender.com/FacturaRegister';

  const validarCampos = () => {
    const errores = {};

    if (!IDcliente.trim()) {
      errores.IDcliente = 'El ID del cliente es obligatorio.';
    } else if (!/^\d+$/.test(IDcliente) || parseInt(IDcliente) <= 0) {
      errores.IDcliente = 'Debe ser un número entero positivo.';
    }

    if (!IDempleado.trim()) {
      errores.IDempleado = 'El ID del empleado es obligatorio.';
    } else if (!/^\d+$/.test(IDempleado) || parseInt(IDempleado) <= 0) {
      errores.IDempleado = 'Debe ser un número entero positivo.';
    }

    if (!fecha.trim()) {
      errores.fecha = 'La fecha es obligatoria.';
    } else if (isNaN(Date.parse(fecha))) {
      errores.fecha = 'Debe ser una fecha válida.';
    }

    if (!total.trim()) {
      errores.total = 'El total es obligatorio.';
    } else if (parseInt(total) <= 0) {
      errores.total = 'Debe ser un numero positivo';
    }

    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      return;
    }

    setErrores({});
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: parseInt(IDcliente),
          id_empleado: parseInt(IDempleado),
          fecha_factura: fecha,
          total: parseFloat(totalFactura)
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.msg || 'Error en la solicitud');
      }

      setMensaje('Factura registrada exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const cancelarRegistro = () => {
    setIDcliente('');
    setIDempleado('');
    setFecha(new Date().toISOString().slice(0, 10));
    setMensaje('');
    setErrores({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Factura</h2>

        <Inputs
          Type="5"
          Place="ID del cliente"
          Value={IDcliente}
          onChange={(e) => setIDcliente(e.target.value)}
        />
        {errores.IDcliente && (
          <p className="text-red-600 text-sm">{errores.IDcliente}</p>
        )}

        <Inputs
          Type="5"
          Place="ID del empleado"
          Value={IDempleado}
          onChange={(e) => setIDempleado(e.target.value)}
        />
        {errores.IDempleado && (
          <p className="text-red-600 text-sm">{errores.IDempleado}</p>
        )}

        <Inputs
          Type="7"
          Place="Fecha de la factura"
          Value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        {errores.fecha && (
          <p className="text-red-600 text-sm">{errores.fecha}</p>
        )}

        <Inputs
          Type="5"
          Place="Total de la factura"
          Value={totalFactura}
          onChange={(e) => setTotalFactura(e.target.value)}
        />
        {errores.total && (
          <p className="text-red-600 text-sm">{errores.total}</p>
        )}

        <div className="flex justify-between gap-2">
          <button
            onClick={cancelarRegistro}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrar
          </button>
        </div>

        {mensaje && (
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
