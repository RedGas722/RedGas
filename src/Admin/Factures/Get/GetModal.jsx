import React, { useState } from 'react';
<<<<<<< HEAD
=======
import { Inputs } from '../../UI/Inputs/Inputs';
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18

export const GetModal = ({ onClose }) => {
  const [IDfactura, setIDfactura] = useState('');
  const [mensaje, setMensaje] = useState(null);
<<<<<<< HEAD

  const URL = 'http://localhost:10101/FacturaGet';

  const handleGet = async (e) => {
    e.preventDefault();
=======
  const [errores, setErrores] = useState({});

  const URL = 'http://localhost:10101/FacturaGet';

  // Función para validar que el ID de la factura no esté vacío y sea un número entero positivo
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
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
    try {
      console.log('Consultando...');
      const res = await fetch(`${URL}?id_factura=${encodeURIComponent(IDfactura)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

<<<<<<< HEAD
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
        setMensaje(data);
        console.log('Completado!');
    } catch (err) {
=======
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
      console.log('Completado!');
    } catch (err) {
      console.error(err);
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setIDfactura('');
<<<<<<< HEAD
    setMensaje('');
=======
    setMensaje(null);
    setErrores({});
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
<<<<<<< HEAD
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Cliente</h2>

        <input
          type="number"
          placeholder="ID de la factura"
          value={IDfactura}
          onChange={(e) => setIDfactura(e.target.value)}
          className="border rounded p-2"
        />
=======
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
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
<<<<<<< HEAD
          >Cancelar</button>
          <button
            onClick={handleGet}
            className="bg-blue-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Consultar</button>
        </div>

        {mensaje && mensaje.data && mensaje.data.length > 0 && (
        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>id_factura:</strong> {mensaje.data[0].id_factura}</p>
            <p><strong>id_cliente:</strong> {mensaje.data[0].id_cliente}</p>
            <p><strong>id_empleado:</strong> {mensaje.data[0].id_empleado}</p>
            <p><strong>fecha_factura:</strong> {mensaje.data[0].fecha_factura}</p>
            <p><strong>estado_factura:</strong> {mensaje.data[0].estado_factura}</p>
            <p><strong>total:</strong> {mensaje.data[0].total}</p>
        </div>
=======
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
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>ID Factura:</strong> {mensaje.data.id_factura}</p>
            <p><strong>ID Cliente:</strong> {mensaje.data.id_cliente}</p>
            <p><strong>ID Empleado:</strong> {mensaje.data.id_empleado}</p>
            <p><strong>Fecha Factura:</strong> {mensaje.data.fecha_factura}</p>
            <p><strong>Estado Factura:</strong> {mensaje.data.estado_factura}</p>
            <p><strong>Total:</strong> {mensaje.data.total}</p>
          </div>
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
        )}
      </div>
    </div>
  );
};
