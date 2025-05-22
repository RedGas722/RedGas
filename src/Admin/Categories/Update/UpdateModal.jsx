import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);

  // Variable local para manejar la búsqueda
  let nombreBusquedaConsulta = nombreBusqueda;

  const URL_GET = 'http://localhost:10101/CategoriaGet';
  const URL_UPDATE = 'http://localhost:10101/CategoriaUpdate';

  const validarCampos = () => {
    const errores = {};
    if (!categoria?.nuevo_nombre_categoria?.trim()) {
      errores.nuevoNombre = 'El nombre es obligatorio';
    } else if (/^\d+$/.test(categoria.nuevo_nombre_categoria.trim())) {
      errores.nuevoNombre = 'El nombre no puede ser solo números';
    }
    return errores;
  };

  const handleBuscar = async () => {
    setMensaje('');
    setErrores({});

    if (!nombreBusqueda.trim()) {
      setErrores({ nombreBusqueda: 'El nombre de la categoría es obligatorio' });
      return;
    }

    try {
      const res = await fetch(`${URL_GET}?nombre_categoria=${encodeURIComponent(nombreBusquedaConsulta)}`);
      if (!res.ok) throw new Error('Categoría no encontrada');

      const data = await res.json();
      if (!data.data || data.data.length === 0) throw new Error('Categoría no existe');

      const c = data.data[0];

      setCategoria({
        nombre_categoria: c.nombre_categoria,
        nuevo_nombre_categoria: c.nombre_categoria,
      });
      setEditando(true);
    } catch (error) {
      setMensaje('Error al buscar categoría: ' + error.message);
    }
  };

  const handleActualizar = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    setErrores({});
    setMensaje('');

    try {
      // Validar que nuevo nombre no exista salvo que sea igual al original
      if (categoria.nuevo_nombre_categoria.trim().toLowerCase() !== categoria.nombre_categoria.trim().toLowerCase()) {
        const resCheck = await fetch(`${URL_GET}?nombre_categoria=${encodeURIComponent(categoria.nuevo_nombre_categoria.trim())}`);
        const dataCheck = await resCheck.json();

        if (resCheck.ok && dataCheck.data && dataCheck.data.length > 0) {
          setMensaje('Error: El nuevo nombre ya existe.');
          return;
        }
      }

      // Actualizar
      const res = await fetch(URL_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_categoria: categoria.nombre_categoria,
          nuevo_nombre_categoria: categoria.nuevo_nombre_categoria.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error en la actualización');
      }

      if (setRefrescar) setRefrescar(true);

      // Actualizamos la variable local y el input para seguir editando con el nuevo nombre
      nombreBusquedaConsulta = categoria.nuevo_nombre_categoria.trim();
      setNombreBusqueda(categoria.nuevo_nombre_categoria.trim());

      // Volvemos a buscar para refrescar la data en edición
      await handleBuscar();

      setMensaje('Actualización exitosa.');
    } catch (error) {
      setMensaje('Error al actualizar: ' + error.message);
    }
  };

  const handleCancelar = () => {
    setNombreBusqueda('');
    setCategoria(null);
    setEditando(false);
    setMensaje('');
    setErrores({});
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

        <h2 className="text-xl font-bold text-center">Actualizar Categoría</h2>

        {!editando && (
          <>
            <Inputs
              Type="1"
              Place="Nombre de la categoría"
              Value={nombreBusqueda}
              onChange={(e) => setNombreBusqueda(e.target.value)}
            />
            {errores.nombreBusqueda && (
              <p className="text-red-600 text-sm">{errores.nombreBusqueda}</p>
            )}
            <button
              onClick={handleBuscar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {editando && categoria && (
          <>
            <Inputs
              Type="1"
              Place="Nuevo nombre de la categoría"
              Value={categoria.nuevo_nombre_categoria}
              onChange={(e) => setCategoria({ ...categoria, nuevo_nombre_categoria: e.target.value })}
            />
            {errores.nuevoNombre && (
              <p className="text-red-600 text-sm">{errores.nuevoNombre}</p>
            )}

            <div className="flex justify-between gap-2">
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
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitosa') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
