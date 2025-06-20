import { useState } from 'react';
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [fechaContrato, setFechaContrato] = useState('');
  const [duracionContrato, setDuracionContrato] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [salario, setSalario] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [mensaje, setMensaje] = useState('');

  const URL = 'https://redgas.onrender.com/ContratoRegister';

  const handleRegister = async (e) => {
    e.preventDefault();
    // Validaciones de frontend
    if (!fechaContrato.trim()) {
      setMensaje('Por favor, ingresa la fecha del contrato.');
      return;
    }
    if (!duracionContrato.trim()) {
      setMensaje('Por favor, ingresa la duración del contrato.');
      return;
    }
    if (!tipoContrato.trim()) {
      setMensaje('Por favor, ingresa el tipo de contrato.');
      return;
    }
    if (!salario || isNaN(salario) || parseFloat(salario) <= 0) {
      setMensaje('Por favor, ingresa un salario válido (mayor a 0).');
      return;
    }
    if (!idAdmin || isNaN(idAdmin) || parseInt(idAdmin) <= 0) {
      setMensaje('Por favor, ingresa un ID de administrador válido (mayor a 0).');
      return;
    }
    if (!idEmpleado || isNaN(idEmpleado) || parseInt(idEmpleado) <= 0) {
      setMensaje('Por favor, ingresa un ID de empleado válido (mayor a 0).');
      return;
    }
    try {
      console.log('registrando...');

      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha_contrato: fechaContrato,
          duracion_contrato: duracionContrato,
          tipo_contrato: tipoContrato,
          salario: parseFloat(salario),
          id_admin: parseInt(idAdmin),
          id_empleado: parseInt(idEmpleado)
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Error en el registro';
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch {
          // No se pudo extraer el mensaje del backend
        }
        throw new Error(errorMsg);
      }
      await res.json();
      setMensaje('Registro exitoso.');
      if (typeof setRefrescar === 'function') setRefrescar(true);
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  }

  const handleCancel = () => {
    setFechaContrato('');
    setDuracionContrato('');
    setTipoContrato('');
    setSalario('');
    setIdAdmin('');
    setIdEmpleado('');
    setMensaje('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">

        <h2 className="text-xl font-bold text-center">Registrar Contrato</h2>

        <InputLabel
          type="7"
          ForID="fechaContrato"
          placeholder="Fecha del contrato"
          childLabel="Fecha del contrato"
          value={fechaContrato}
          onChange={(e) => setFechaContrato(e.target.value)}
          required
          placeholderError={!!(mensaje && mensaje.toLowerCase().includes('fecha'))}
        />
        <InputLabel
          type="1"
          ForID="duracionContrato"
          placeholder="Duración del contrato"
          childLabel="Duración del contrato"
          value={duracionContrato}
          onChange={(e) => setDuracionContrato(e.target.value)}
          required
          placeholderError={!!(mensaje && mensaje.toLowerCase().includes('duración'))}
        />
        <InputLabel
          type="1"
          ForID="tipoContrato"
          placeholder="Tipo de contrato"
          childLabel="Tipo de contrato"
          value={tipoContrato}
          onChange={(e) => setTipoContrato(e.target.value)}
          required
          placeholderError={!!(mensaje && mensaje.toLowerCase().includes('tipo'))}
        />
        <InputLabel
          type="5"
          ForID="salario"
          placeholder="Salario"
          childLabel="Salario"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          required
          placeholderError={!!(mensaje && mensaje.toLowerCase().includes('salario'))}
        />
        <InputLabel
          type="5"
          ForID="idAdmin"
          placeholder="ID del administrador"
          childLabel="ID del administrador"
          value={idAdmin}
          onChange={(e) => setIdAdmin(e.target.value)}
          required
          placeholderError={!!(mensaje && mensaje.toLowerCase().includes('administrador'))}
        />
        <InputLabel
          type="5"
          ForID="idEmpleado"
          placeholder="ID del empleado"
          childLabel="ID del empleado"
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
          required
          placeholderError={!!(mensaje && mensaje.toLowerCase().includes('empleado'))}
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Registrar</button>
        </div>

        {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}
      </div>
    </div>
  );
};
