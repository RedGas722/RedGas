import React, { useState, useRef, useEffect } from 'react';
import InputLabel from '../../../UI/Login_Register/InputLabel/InputLabel';

export const RegisterModal = ({ onClose, setRefrescar, admins = [], empleados = [] }) => {
  const [fechaContrato, setFechaContrato] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [duracionContrato, setDuracionContrato] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [salario, setSalario] = useState('');
  const [correoAdmin, setCorreoAdmin] = useState('');
  const [correoEmpleado, setCorreoEmpleado] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [sugerenciasAdmin, setSugerenciasAdmin] = useState([]);
  const [sugerenciasEmpleado, setSugerenciasEmpleado] = useState([]);

  const refAdmin = useRef(null);
  const refEmpleado = useRef(null);

  const URL = 'https://redgas.onrender.com/ContratoRegister';

  // Autocompletado para admin
  useEffect(() => {
    if (!correoAdmin.trim()) return setSugerenciasAdmin([]);
    const filtrados = admins.filter((admin) =>
      admin.correo_admin.toLowerCase().includes(correoAdmin.toLowerCase())
    );
    setSugerenciasAdmin(filtrados.slice(0, 5));
  }, [correoAdmin, admins]);

  // Autocompletado para empleado
  useEffect(() => {
    if (!correoEmpleado.trim()) return setSugerenciasEmpleado([]);
    const filtrados = empleados.filter((emp) =>
      emp.correo_empleado.toLowerCase().includes(correoEmpleado.toLowerCase())
    );
    setSugerenciasEmpleado(filtrados.slice(0, 5));
  }, [correoEmpleado, empleados]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refAdmin.current && !refAdmin.current.contains(event.target) &&
        refEmpleado.current && !refEmpleado.current.contains(event.target)
      ) {
        setSugerenciasAdmin([]);
        setSugerenciasEmpleado([]);
      }
    };
    document.addEventListener('click', handleClickOutside); // 👈 usamos 'click' en lugar de 'mousedown'
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fechaContrato.trim()) return setMensaje('Por favor, ingresa la fecha del contrato.');
    if (!duracionContrato.trim()) return setMensaje('Por favor, ingresa la duración del contrato.');
    if (!tipoContrato.trim()) return setMensaje('Por favor, ingresa el tipo de contrato.');
    if (!salario || isNaN(salario) || parseFloat(salario) <= 0) {
      return setMensaje('Por favor, ingresa un salario válido (mayor a 0).');
    }
    if (!correoAdmin.trim()) return setMensaje('Por favor, ingresa el correo del administrador.');
    if (!correoEmpleado.trim()) return setMensaje('Por favor, ingresa el correo del empleado.');

    const adminEncontrado = admins.find(
      (a) => a.correo_admin.toLowerCase() === correoAdmin.toLowerCase().trim()
    );
    const empleadoEncontrado = empleados.find(
      (e) => e.correo_empleado.toLowerCase() === correoEmpleado.toLowerCase().trim()
    );

    if (!adminEncontrado) return setMensaje('Administrador no encontrado con ese correo.');
    if (!empleadoEncontrado) return setMensaje('Empleado no encontrado con ese correo.');

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha_contrato: fechaContrato,
          duracion_contrato: duracionContrato,
          tipo_contrato: tipoContrato,
          salario: parseFloat(salario),
          id_admin: adminEncontrado.id_admin,
          id_empleado: empleadoEncontrado.id_empleado
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Error en el registro';
        try {
          const errorData = await res.json();
          if (errorData?.message) errorMsg = errorData.message;
        } catch {}
        throw new Error(errorMsg);
      }

      await res.json();
      setMensaje('Registro exitoso.');
      if (typeof setRefrescar === 'function') setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFechaContrato('');
    setDuracionContrato('');
    setTipoContrato('');
    setSalario('');
    setCorreoAdmin('');
    setCorreoEmpleado('');
    setMensaje('');
    setSugerenciasAdmin([]);
    setSugerenciasEmpleado([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">

        <h2 className="text-xl font-bold text-center">Registrar Contrato</h2>

        <InputLabel
          type="7"
          ForID="fechaContrato"
          placeholder="Fecha del contrato"
          childLabel="Fecha del contrato"
          value={fechaContrato}
          onChange={(e) => setFechaContrato(e.target.value)}
          className="w-full"
          min={new Date().toISOString().split('T')[0]} // 👈 esta línea limita a hoy o después
        />

        <InputLabel
          type="1"
          ForID="duracionContrato"
          placeholder="Duración del contrato"
          childLabel="Duración del contrato"
          value={duracionContrato}
          onChange={(e) => setDuracionContrato(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <InputLabel
          type="1"
          ForID="tipoContrato"
          placeholder="Tipo de contrato"
          childLabel="Tipo de contrato"
          value={tipoContrato}
          onChange={(e) => setTipoContrato(e.target.value)}
          required
        />
        <InputLabel
          type="5"
          ForID="salario"
          placeholder="Salario"
          childLabel="Salario"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          required
        />

        {/* Autocompletado ADMIN */}
        <div className="relative w-full" ref={refAdmin}>
          <InputLabel
            Type="2"
            ForID="correoAdmin"
            placeholder="Correo del administrador"
            childLabel="Correo del Administrador"
            value={correoAdmin}
            onChange={(e) => setCorreoAdmin(e.target.value)}
          />
          {sugerenciasAdmin.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[160px] overflow-y-auto w-full shadow">
              {sugerenciasAdmin.map((admin) => (
                <li
                  key={admin.id_admin}
                  onClick={() => {
                    setCorreoAdmin(admin.correo_admin);
                    setTimeout(() => setSugerenciasAdmin([]), 0); // 👈 ejecuta después del click
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {admin.nombre_admin} - {admin.correo_admin}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Autocompletado EMPLEADO */}
        <div className="relative w-full" ref={refEmpleado}>
          <InputLabel
            Type="2"
            ForID="correoEmpleado"
            placeholder="Correo del Empleado"
            childLabel="Correo del Empleado"
            value={correoEmpleado}
            onChange={(e) => setCorreoEmpleado(e.target.value)}
          />
          {sugerenciasEmpleado.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[160px] overflow-y-auto w-full shadow">
              {sugerenciasEmpleado.map((emp) => (
                <li
                  key={emp.id_empleado}
                  onClick={() => {
                    setCorreoEmpleado(emp.correo_empleado);
                    setTimeout(() => setSugerenciasEmpleado([]), 0); 
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {emp.nombre_empleado} - {emp.correo_empleado}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-between gap-2">
          <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleRegister} className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>

        {mensaje && (
          <p
            className={`text-center font-semibold ${
              mensaje.toLowerCase().includes('exito') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
