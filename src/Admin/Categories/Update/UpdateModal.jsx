import { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [categoriaEncontrada, setCategoriaEncontrada] = useState(false);

  const URL_GET = 'http://localhost:10101/CategoriaGet';
  const URL_UPDATE = 'http://localhost:10101/CategoriaUpdate';

  const validarNombre = () => {
    const errores = {};
    if (!nombre.trim()) {
      errores.nombre = 'El nombre de la categoría es obligatorio.';
    } else if (/^\d+$/.test(nombre.trim())) {
      errores.nombre = 'El nombre no puede ser solo números.';
    }
    return errores;
  };

  const handleBuscar = async () => {
    const erroresValidados = validarNombre();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      return;
    }

    setErrores({});
    try {
      const res = await fetch(`${URL_GET}?nombre_categoria=${encodeURIComponent(nombre)}`);
      const data = await res.json();

      if (!res.ok || !data.data || data.data.length === 0) {
        throw new Error('Categoría no encontrada.');
      }

      // Establecer nuevoNombre con el valor actual de la categoría
      setNuevoNombre(data.data[0].nombre_categoria);
      setCategoriaEncontrada(true);
      setMensaje('');
    } catch (err) {
      setMensaje('Error: ' + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setErrores({ nuevoNombre: 'El nuevo nombre no puede estar vacío.' });
      return;
    }

    setErrores({});
    try {
      const res = await fetch(URL_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_categoria: nombre,
          nuevo_nombre_categoria: nuevoNombre
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar');

      setMensaje('Actualización exitosa.');
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setCategoriaEncontrada(false);
    setNombre('');
    setNuevoNombre('');
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

        {!categoriaEncontrada && (
          <>
            <Inputs
              Type="1"
              Place="Nombre de la categoría"
              Value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && (
              <p className="text-red-600 text-sm">{errores.nombre}</p>
            )}
            <button
              onClick={handleBuscar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {categoriaEncontrada && (
          <>
            <Inputs
              Type="1"
              Place="Nuevo nombre de la categoría"
              Value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            {errores.nuevoNombre && (
              <p className="text-red-600 text-sm">{errores.nuevoNombre}</p>
            )}
            <div className="flex justify-between gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
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
