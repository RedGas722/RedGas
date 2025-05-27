import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [admin, setAdmin] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  let CorreoBusqueda = correoBusqueda;

  const URL_GET = 'http://localhost:10101/AdminGet';
  const URL_UPDATE = 'http://localhost:10101/AdminDataUpdate'; 

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const validarCampos = () => {
    const errores = {};
    if (!admin.nuevoNombre.trim()) errores.nuevoNombre = 'Nombre es obligatorio';
    if (!admin.nuevoCorreo.trim() || !validarCorreo(admin.nuevoCorreo)) errores.nuevoCorreo = 'Correo válido obligatorio';
    if (!admin.telefono.trim() || !/^\d{10}$/.test(admin.telefono)) errores.telefono = 'Teléfono válido (10 dígitos) obligatorio';
    return errores;
  };

  const handleBuscar = async () => {
    setMensaje('');
    setErrores({});
    setCorreoBusqueda(CorreoBusqueda);
    if (!correoBusqueda.trim()) {
      setErrores({ correoBusqueda: 'El correo es obligatorio' });
      return;
    }
    if (!validarCorreo(correoBusqueda)) {
      setErrores({ correoBusqueda: 'Correo no válido' });
      return;
    }
    try {
      const res = await fetch(`${URL_GET}?correo_admin=${encodeURIComponent(CorreoBusqueda)}`);
      if (!res.ok) throw new Error('Administrador no encontrado');
      const data = await res.json();
      if (!data.data) throw new Error('Administrador no existe');
      // Aquí llenamos el estado con los datos traídos
      setAdmin({
        nuevoCorreo: data.data.correo_admin,
        nuevoNombre: data.data.nombre_admin,
        telefono: data.data.telefono_admin,
      });
      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar administrador: ' + err.message);
    }
  };

  const handleActualizar = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }
    setErrores({});

    const jsonData = {
      correo_admin: CorreoBusqueda,
      new_correo_admin: admin.nuevoCorreo,
      nombre_admin: admin.nuevoNombre,
      telefono_admin: admin.telefono,
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
        if (text.includes('Duplicate entry') && text.includes('correo_admin')) {
          throw new Error('El correo ya está registrado.');
        }
        const data = JSON.parse(text);
        throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar');
      }
      if (setRefrescar) setRefrescar(true);
      setMensaje('Administrador actualizado exitosamente.');
      CorreoBusqueda = admin.nuevoCorreo;
      await handleBuscar();
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancelar = () => {
    setCorreoBusqueda('');
    setAdmin(null);
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
        <h2 className="text-xl font-bold text-center">Actualizar Administrador</h2>

        {!editando && (
          <>
            <Inputs
              Type="2"
              Place="Correo del Administrador"
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

        {editando && admin && (
          <>
            <Inputs
              Type="1"
              Place="Nombre"
              Value={admin.nuevoNombre}
              onChange={(e) => setAdmin({ ...admin, nuevoNombre: e.target.value })}
              className={errores.nuevoNombre ? 'border-red-500' : ''}
            />
            {errores.nuevoNombre && <p className="text-red-600 text-xs font-semibold mb-1">{errores.nuevoNombre}</p>}

            <Inputs
              Type="2"
              Place="Correo"
              Value={admin.nuevoCorreo}
              onChange={(e) => setAdmin({ ...admin, nuevoCorreo: e.target.value })}
              className={errores.nuevoCorreo ? 'border-red-500' : ''}
            />
            {errores.nuevoCorreo && <p className="text-red-600 text-xs font-semibold mb-1">{errores.nuevoCorreo}</p>}

            <Inputs
              Type="6"
              Place="Teléfono"
              Value={admin.telefono}
              onChange={(e) => setAdmin({ ...admin, telefono: e.target.value })}
              className={errores.telefono ? 'border-red-500' : ''}
            />
            {errores.telefono && <p className="text-red-600 text-xs font-semibold mb-1">{errores.telefono}</p>}

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
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
