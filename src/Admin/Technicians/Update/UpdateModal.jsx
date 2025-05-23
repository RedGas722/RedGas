import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [tecnico, setTecnico] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  let correoActualBusqueda = correoBusqueda;

  const URL_GET = 'http://localhost:10101/TecnicoGet';
  const URL_UPDATE = 'http://localhost:10101/TecnicoDataUpdateNI'; // Actualizar sin imagen
  const URL_UPDATE_IMAGEN = 'http://localhost:10101/TecnicoDataUpdate'; // Actualizar con imagen

  // Validar campos
  const validarCampos = () => {
    const errores = {};
    if (!tecnico.nuevoNombre.trim()) errores.nuevoNombre = 'Nuevo nombre es obligatorio';
    if (!tecnico.nuevoCorreo.trim() || !validarCorreo(tecnico.nuevoCorreo)) errores.nuevoCorreo = 'Correo válido obligatorio';
    if (!tecnico.telefono.trim() || !/^\d{10}$/.test(tecnico.telefono)) errores.telefono = 'Teléfono válido (10 dígitos) obligatorio';
    return errores;
  };

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleBuscar = async () => {
    if (!editando) setMensaje('');
    setErrores({});
    if (!correoBusqueda.trim()) {
      setErrores({ correoBusqueda: 'El correo es obligatorio' });
      return;
    }
    if (!validarCorreo(correoBusqueda)) {
      setErrores({ correoBusqueda: 'Correo no válido' });
      return;
    }
    try {
      const res = await fetch(`${URL_GET}?correo_tecnico=${encodeURIComponent(correoActualBusqueda)}`);
      if (!res.ok) throw new Error('Técnico no encontrado');
      const data = await res.json();
      if (!data.data) throw new Error('Técnico no existe');
      setTecnico({
        correoActual: data.data.correo_tecnico,
        nuevoCorreo: data.data.correo_tecnico,
        nuevoNombre: data.data.nombre_tecnico,
        telefono: data.data.telefono_tecnico,
      });
      if (data.data.imagen) {
        setImagenActual(`data:image/jpeg;base64,${data.data.imagen}`);
        setImagenNueva(null);
      }
      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar técnico: ' + err.message);
    }
  };

  const handleActualizar = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }
    setErrores({});
    const hayImagen = !!imagenNueva;
    if (hayImagen) {
      const formData = new FormData();
      formData.append('correo_tecnico', tecnico.correoActual);
      formData.append('nuevo_correo_tecnico', tecnico.nuevoCorreo);
      formData.append('nombre_tecnico', tecnico.nuevoNombre);
      formData.append('telefono_tecnico', tecnico.telefono);
      formData.append('imagen', imagenNueva);
      try {
        const res = await fetch(URL_UPDATE_IMAGEN, {
          method: 'PUT',
          body: formData,
        });
        if (!res.ok) {
          const text = await res.text();
          if (text.includes('Duplicate entry') && text.includes('correo_tecnico')) {
            throw new Error('El correo ya está registrado.');
          }
          const data = JSON.parse(text);
          throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar con imagen');
        }
        if (setRefrescar) setRefrescar(true);
        correoActualBusqueda = tecnico.nuevoCorreo;
        await handleBuscar();
        setMensaje('Técnico e imagen actualizados exitosamente.');
      } catch (err) {
        setMensaje('Error al actualizar: ' + err.message);
      }
    } else {
      const jsonData = {
        correo_tecnico: tecnico.correoActual,
        nuevo_correo_tecnico: tecnico.nuevoCorreo,
        nombre_tecnico: tecnico.nuevoNombre,
        telefono_tecnico: tecnico.telefono,
      };
      try {
        const res = await fetch(URL_UPDATE, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });
        if (!res.ok) {
          const text = await res.text();
          if (text.includes('Duplicate entry') && text.includes('correo_tecnico')) {
            throw new Error('El correo ya está registrado.');
          }
          const data = JSON.parse(text);
          throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar sin imagen');
        }
        if (setRefrescar) setRefrescar(true);
        correoActualBusqueda = tecnico.nuevoCorreo;
        await handleBuscar();
        setMensaje('Técnico actualizado exitosamente.');
      } catch (err) {
        setMensaje('Error al actualizar: ' + err.message);
      }
    }
  };

  const handleCancelar = () => {
    setCorreoBusqueda('');
    setTecnico(null);
    setEditando(false);
    setMensaje('');
    setErrores({});
    setImagenActual(null);
    setImagenNueva(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenNueva(file);
    } else {
      setImagenNueva(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>
        <h2 className="text-xl font-bold text-center">Actualizar Técnico</h2>
        {!editando && (
          <>
            <Inputs
              Type="2"
              Place="Correo del Técnico"
              Value={correoBusqueda}
              onChange={(e) => setCorreoBusqueda(e.target.value)}
            />
            {errores.correoBusqueda && (
              <p className="text-red-600 text-sm">{errores.correoBusqueda}</p>
            )}
            <button
              onClick={handleBuscar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}
        {editando && tecnico && (
          <>
            <Inputs
              Type="1"
              Place="Nuevo Nombre"
              Value={tecnico.nuevoNombre}
              onChange={(e) => setTecnico({ ...tecnico, nuevoNombre: e.target.value })}
            />
            {errores.nuevoNombre && <p className="text-red-600 text-sm">{errores.nuevoNombre}</p>}
            <Inputs
              Type="2"
              Place="Nuevo Correo del Técnico"
              Value={tecnico.nuevoCorreo}
              onChange={(e) => setTecnico({ ...tecnico, nuevoCorreo: e.target.value })}
            />
            {errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}
            <Inputs
              Type="6"
              Place="Nuevo Teléfono del Técnico"
              Value={tecnico.telefono}
              onChange={(e) => setTecnico({ ...tecnico, telefono: e.target.value })}
            />
            {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
            {imagenActual && (
              <div className="mt-2 flex flex-col items-center">
                <p>Imagen Actual:</p>
                <img
                  src={imagenActual}
                  alt="Técnico"
                  className="w-[200px] h-[200px] object-cover rounded shadow mt-2"
                />
              </div>
            )}
            <label className="mt-2">Seleccionar Nueva Imagen:</label>
            <Inputs
              Type="4"
              Place="Seleccionar Nueva Imagen"
              onChange={handleImageChange}
            />
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
