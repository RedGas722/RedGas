import React, { useState } from 'react';
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL_REGISTER = 'https://redgas.onrender.com/TecnicoRegister';
  const URL_GET = 'https://redgas.onrender.com/TecnicoGet';

  const validarCampos = () => {
    const errores = {};
    if (!nombre.trim()) errores.nombre = 'Nombre es requerido.';
    if (!apellido.trim()) errores.apellido = 'Apellido es requerido.';
    if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Correo inválido.';
    if (!telefono.trim() || !/^\d{10}$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos.';
    if (!contrasena.trim() || contrasena.length < 6) errores.contrasena = 'Contraseña debe tener al menos 6 caracteres.';
    if (!imagen) errores.imagen = 'Imagen es requerida.';
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
    setMensaje('');
    try {
      // Verificar si ya existe un técnico con ese correo
      const resCheck = await fetch(`${URL_GET}?correo_tecnico=${encodeURIComponent(correo)}`);
      if (resCheck.ok) {
        const dataCheck = await resCheck.json();
        if (dataCheck?.data) {
          setMensaje('Ya existe un técnico con ese correo.');
          return;
        }
      }
      const formData = new FormData();
      formData.append('nombre_tecnico', nombre + ' ' + apellido);
      formData.append('correo_tecnico', correo);
      formData.append('telefono_tecnico', telefono);
      formData.append('contrasena_tecnico', contrasena);
      formData.append('imagen', imagen);
      const res = await fetch(URL_REGISTER, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        setMensaje('Error al registrar: Datos inválidos.');
        return;
      }
      setMensaje('Técnico registrado exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const cancelarRegistro = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setContrasena('');
    setImagen(null);
    setErrores({});
    setMensaje('');
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file || null);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="NeoContainer_Admin_outset_TL p-6 w-[320px] flex flex-col gap-4 relative text-[var(--main-color)]">
        <button
          className="absolute top-2 right-3 text-[var(--main-color)] text-lg"
          onClick={onClose}
        >✕</button>
        <h2 className="text-xl font-bold text-center">Registrar Técnico</h2>
        <InputLabel type='1' placeholder='Nombre del Técnico' value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
        <InputLabel type='1' placeholder='Apellido del Técnico' value={apellido} onChange={(e) => setApellido(e.target.value)} />
        {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}
        <InputLabel type='2' placeholder='Correo del Técnico' value={correo} onChange={(e) => setCorreo(e.target.value)} />
        {errores.correo && <p className="text-red-600 text-sm">{errores.correo}</p>}
        <InputLabel type='6' placeholder='Teléfono del Técnico' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
        <InputLabel type='3' placeholder='Contraseña del Técnico' value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        {errores.contrasena && <p className="text-red-600 text-sm">{errores.contrasena}</p>}
        <InputLabel type='4' placeholder='Imagen del Técnico' value={imagen} onChange={handleImageChange} />
        {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen}</p>}
        <div className="flex justify-between gap-2">
          <button
            onClick={cancelarRegistro}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Cancelar</button>
          <button
            onClick={handleRegister}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Registrar</button>
        </div>
        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
