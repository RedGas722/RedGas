import React, { useState, useEffect } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar, adminCarta }) => {
  const [admin, setAdmin] = useState(null);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  const validarCampos = () => {
    const errores = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio';
    if (!apellido.trim()) errores.apellido = 'El apellido es obligatorio';

    if (!nuevoCorreo.trim()) {
      errores.nuevoCorreo = 'El correo es obligatorio.';
    } else if (!correoRegex.test(nuevoCorreo)) {
      errores.nuevoCorreo = 'Correo inválido.';
    }

    if (!admin?.telefono_admin?.trim()) {
      errores.telefono_admin = 'El teléfono es obligatorio.';
    } else if (
      admin.telefono_admin.length !== 10 ||
      !/^\d+$/.test(admin.telefono_admin)
    ) {
      errores.telefono_admin = 'Teléfono debe tener 10 dígitos numéricos.';
    }

    return errores;
  };

  useEffect(() => {
    if (adminCarta) {
      setAdmin(adminCarta);
      setNuevoCorreo(adminCarta.correo_admin);
      setCorreoParaBusqueda(adminCarta.correo_admin);

      const partes = adminCarta.nombre_admin.trim().split(/\s+/);
      const nombre = partes.slice(0, 2).join(' ');
      const apellido = partes.slice(2).join(' ');
      setNombre(nombre || '');
      setApellido(apellido || '');
    }
  }, [adminCarta]);

  const actualizarAdmin = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    setErrores({});
    setMensaje('');

    const body = {
      nombre_admin: `${nombre.trim()} ${apellido.trim()}`,
      new_correo_admin: nuevoCorreo, // 🔧 Nombre corregido
      telefono_admin: admin.telefono_admin,
      correo_admin: correoParaBusqueda,
    };

    try {
      const res = await fetch('https://redgas.onrender.com/AdminDataUpdate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMensaje('Administrador actualizado exitosamente.');
        setRefrescar && setRefrescar(true);
        if (correoParaBusqueda !== nuevoCorreo) {
          setCorreoParaBusqueda(nuevoCorreo);
        }
      } else {
        const data = await res.json();
        setMensaje(data.errorInfo || 'Error al actualizar administrador.');
      }
    } catch {
      setMensaje('Error de red al actualizar.');
    }
  };

  const cancelarEdicion = () => {
    setAdmin(null);
    setNuevoCorreo('');
    setCorreoParaBusqueda('');
    setMensaje('');
    setErrores({});
    setNombre('');
    setApellido('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Administrador</h2>
        {admin && (
          <>
            <Inputs
              Type="1"
              Place="Nombre"
              Value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full"
            />
            {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
            <Inputs
              Type="1"
              Place="Apellido"
              Value={apellido}
              onChange={e => setApellido(e.target.value)}
              className="w-full"
            />
            {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}
            <Inputs
              Type="2"
              Place="Nuevo correo"
              Value={nuevoCorreo}
              onChange={e => {
                setNuevoCorreo(e.target.value);
                setErrores(prev => ({ ...prev, nuevoCorreo: null }));
              }}
              className="w-full"
            />
            {errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}
            <Inputs
              Type="6"
              Place="Teléfono"
              Value={admin.telefono_admin}
              onChange={e => setAdmin({ ...admin, telefono_admin: e.target.value })}
              className="w-full"
            />
            {errores.telefono_admin && <p className="text-red-600 text-sm">{errores.telefono_admin}</p>}
            <div className="flex justify-between gap-2">
              <button
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarAdmin}
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
