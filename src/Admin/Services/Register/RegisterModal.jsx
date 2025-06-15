import React, { useState, useRef } from 'react';
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombreServicio, setNombreServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [erroresActivos, setErroresActivos] = useState({});
  const errorTimeouts = useRef({});

  const URL_REGISTER = 'https://redgas.onrender.com/ServicioRegister';
  const URL_GET = 'https://redgas.onrender.com/ServicioGet';

  const validarCampos = () => {
    const errores = {};
    if (!nombreServicio.trim()) errores.nombreServicio = 'Nombre del servicio es requerido.';
    if (!descripcionServicio.trim()) errores.descripcionServicio = 'Descripción es requerida.';
    if (!precioServicio || isNaN(precioServicio) || parseFloat(precioServicio) <= 0) errores.precioServicio = 'Precio debe ser un número mayor a 0.';
    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      setErroresActivos(erroresValidados);
      Object.keys(erroresValidados).forEach((key) => {
        if (errorTimeouts.current[key]) clearTimeout(errorTimeouts.current[key]);
        errorTimeouts.current[key] = setTimeout(() => {
          setErroresActivos((prev) => ({ ...prev, [key]: undefined }));
        }, 2000);
      });
      return;
    }
    setErrores({});
    setErroresActivos({});
    setMensaje('');
    try {
      // Verificar si ya existe un servicio con ese nombre
      const resCheck = await fetch(`${URL_GET}?nombre_servicio=${encodeURIComponent(nombreServicio)}`);
      if (resCheck.ok) {
        const dataCheck = await resCheck.json();
        if (dataCheck?.data?.length > 0) {
          setMensaje('Ya existe un servicio con ese nombre.');
          return;
        }
      }
      const res = await fetch(URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_servicio: nombreServicio,
          descripcion_servicio: descripcionServicio,
          precio_servicio: precioServicio,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setMensaje('Error al registrar: ' + (errorData?.errors?.[0]?.msg || 'Datos inválidos.'));
        return;
      }
      setMensaje('Servicio registrado exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const cancelarRegistro = () => {
    setNombreServicio('');
    setDescripcionServicio('');
    setPrecioServicio('');
    setErrores({});
    setMensaje('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Servicio</h2>
        <InputLabel type='1' placeholder={erroresActivos.nombreServicio || 'Nombre del Servicio'} value={nombreServicio} onChange={(e) => setNombreServicio(e.target.value)} placeholderError={!!erroresActivos.nombreServicio} />
        <InputLabel type='1' placeholder={erroresActivos.descripcionServicio || 'Descripción del Servicio'} value={descripcionServicio} onChange={(e) => setDescripcionServicio(e.target.value)} placeholderError={!!erroresActivos.descripcionServicio} />
        <InputLabel type='5' placeholder={erroresActivos.precioServicio || 'Precio del Servicio'} value={precioServicio} onChange={(e) => setPrecioServicio(e.target.value)} placeholderError={!!erroresActivos.precioServicio} />
        <div className="flex justify-between gap-2">
          <button onClick={cancelarRegistro} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Registrar</button>
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
