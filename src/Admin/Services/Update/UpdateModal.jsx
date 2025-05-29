import React, { useState, useEffect } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar, nombreServicioInicial }) => {
  const [nombreServicio, setNombreServicio] = useState(nombreServicioInicial || '');
  const [nuevoNombreServicio, setNuevoNombreServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});

  const URL_GET = 'http://localhost:10101/ServicioGet';  // Endpoint para obtener info del servicio
  const URL_UPDATE = 'http://localhost:10101/ServicioUpdate';  // Endpoint para actualizar

  useEffect(() => {
    if (nombreServicioInicial) {
      buscarServicio(nombreServicioInicial);
    }
  }, [nombreServicioInicial]);

  const buscarServicio = async (nombre) => {
    setMensaje('');
    setErrores({});
    setEditando(false);
    setNuevoNombreServicio('');
    setDescripcionServicio('');
    setPrecioServicio('');

    if (!nombre.trim()) {
      setErrores({ nombreServicio: 'El nombre del servicio es obligatorio para buscar.' });
      return;
    }

    try {
      const res = await fetch(`${URL_GET}?nombre_servicio=${encodeURIComponent(nombre)}`);
      if (!res.ok) throw new Error('Servicio no encontrado');
      const data = await res.json();

      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Servicio no existe');
      }

      const s = data.data[0];

      setNombreServicio(s.nombre_servicio || '');
      setNuevoNombreServicio(s.nombre_servicio || '');  // Por defecto el mismo nombre actual
      setDescripcionServicio(s.descripcion_servicio || '');
      setPrecioServicio(s.precio_servicio ? s.precio_servicio.toString() : '');
      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar servicio: ' + err.message);
      setEditando(false);
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nuevoNombreServicio.trim()) nuevosErrores.nuevoNombreServicio = 'El nuevo nombre es obligatorio';
    if (!descripcionServicio.trim()) nuevosErrores.descripcionServicio = 'La descripción es obligatoria';
    if (!precioServicio || isNaN(precioServicio) || Number(precioServicio) <= 0) nuevosErrores.precioServicio = 'El precio debe ser un número mayor a 0';
    return nuevosErrores;
  };

  const handleActualizar = async () => {
    const erroresValidos = validarCampos();
    if (Object.keys(erroresValidos).length > 0) {
      setErrores(erroresValidos);
      return;
    }
    setErrores({});
    setMensaje('');

    const jsonData = {
      nombre_servicio: nombreServicio,
      nuevo_nombre_servicio: nuevoNombreServicio,
      descripcion_servicio: descripcionServicio,
      precio_servicio: parseFloat(precioServicio),
    };

    try {
      const res = await fetch(URL_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      if (!res.ok) {
        const text = typeof result === 'string' ? result : JSON.stringify(result);
        throw new Error(text || 'Error al actualizar');
      }

      setMensaje('Servicio actualizado exitosamente.');
      if (typeof setRefrescar === 'function') setRefrescar(true);

      // Refrescar datos después de actualizar
      await buscarServicio(nuevoNombreServicio);
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancelar = () => {
    setNombreServicio('');
    setNuevoNombreServicio('');
    setDescripcionServicio('');
    setPrecioServicio('');
    setMensaje('');
    setEditando(false);
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Actualizar Servicio</h2>

        {!editando && (
          <>
            <Inputs
              Type="1"
              Place="Nombre del Servicio"
              Value={nombreServicio}
              onChange={(e) => setNombreServicio(e.target.value)}
              className={errores.nombreServicio ? 'border-red-500' : ''}
            />
            {errores.nombreServicio && <p className="text-red-600 text-xs font-semibold">{errores.nombreServicio}</p>}

            <button
              onClick={() => buscarServicio(nombreServicio)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {editando && (
          <>
            <Inputs
              Type="1"
              Place="Nuevo Nombre del Servicio"
              Value={nuevoNombreServicio}
              onChange={(e) => setNuevoNombreServicio(e.target.value)}
              className={errores.nuevoNombreServicio ? 'border-red-500' : ''}
            />
            {errores.nuevoNombreServicio && <p className="text-red-600 text-xs font-semibold">{errores.nuevoNombreServicio}</p>}

            <textarea
              placeholder="Descripción del Servicio"
              value={descripcionServicio}
              onChange={(e) => setDescripcionServicio(e.target.value)}
              className={`border rounded p-2 ${errores.descripcionServicio ? 'border-red-500' : ''}`}
            />
            {errores.descripcionServicio && <p className="text-red-600 text-xs font-semibold">{errores.descripcionServicio}</p>}

            <Inputs
              Type="5"
              Place="Precio del Servicio"
              Value={precioServicio}
              onChange={(e) => setPrecioServicio(e.target.value)}
              className={errores.precioServicio ? 'border-red-500' : ''}
            />
            {errores.precioServicio && <p className="text-red-600 text-xs font-semibold">{errores.precioServicio}</p>}

            <div className="flex justify-between gap-2 mt-2">
              <button
                onClick={handleCancelar}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleActualizar}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Actualizar
              </button>
            </div>
          </>
        )}

        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
