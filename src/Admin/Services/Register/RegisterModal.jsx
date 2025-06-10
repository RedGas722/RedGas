import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombreServicio, setNombreServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

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
      return;
    }
    setErrores({});
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
        <Inputs Type='1' Place='Nombre del Servicio' Value={nombreServicio} onChange={(e) => setNombreServicio(e.target.value)} />
        {errores.nombreServicio && <p className="text-red-600 text-sm">{errores.nombreServicio}</p>}
        <textarea
          placeholder="Descripción del Servicio"
          value={descripcionServicio}
          onChange={(e) => setDescripcionServicio(e.target.value)}
          className="border rounded p-2"
        />
        {errores.descripcionServicio && <p className="text-red-600 text-sm">{errores.descripcionServicio}</p>}
        <Inputs Type='5' Place='Precio del Servicio' Value={precioServicio} onChange={(e) => setPrecioServicio(e.target.value)} />
        {errores.precioServicio && <p className="text-red-600 text-sm">{errores.precioServicio}</p>}
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
