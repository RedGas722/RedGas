import { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [estadoFactura, setEstadoFactura] = useState('inactiva');
  const [IDfactura, setIDfactura] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  
  // Variable para manejar la búsqueda de la factura (idBusqueda).
  let idBusqueda = IDfactura;

  const URL = 'http://localhost:10101/FacturaUpdate';

  const validarCampos = () => {
    const errores = {};
    if (!IDfactura.trim()) {
      errores.id_factura = 'El ID de la factura es obligatorio.';
    } else if (!/^\d+$/.test(IDfactura) || parseInt(IDfactura) <= 0) {
      errores.id_factura = 'Debe ser un número entero positivo.';
    }
    return errores;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      return;
    }

    setErrores({});
    
    try {
      console.log('Actualizando...');
      const res = await fetch(URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_factura: IDfactura,
          estado_factura: estadoFactura
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar la factura.');
      const data = await res.json();
      setMensaje('Actualización exitosa.');
      
      // Después de la actualización, refrescamos la lista de facturas
      if (setRefrescar) setRefrescar(true);  // Esto indica que se debe refrescar los datos
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setEstadoFactura('inactiva');
    setIDfactura('');
    setMensaje('');
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Actualizar Factura</h2>
        <Inputs
          Type='5'
          Place='ID de la factura'
          Value={IDfactura}
          onChange={(e) => setIDfactura(e.target.value)}
        />
        {errores.id_factura && <p className="text-red-600 text-sm">{errores.id_factura}</p>}

        <select
          value={estadoFactura}
          onChange={(e) => setEstadoFactura(e.target.value)}
          className="border rounded p-2"
        >
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
        </select>

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >Actualizar</button>
        </div>

        {mensaje && (
          <p className={`text-center font-semibold text-sm mt-2 ${mensaje.startsWith('Error') || mensaje.startsWith('No se') ? 'text-red-600' : 'text-green-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
