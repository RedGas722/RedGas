import React, { useState, useRef, useEffect } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, setRefrescar, clientes, empleados }) => {
  const [clienteCorreo, setClienteCorreo] = useState('');
  const [empleadoCorreo, setEmpleadoCorreo] = useState('');
  const [IDcliente, setIDcliente] = useState('');
  const [IDempleado, setIDempleado] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [totalFactura, setTotalFactura] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [sugerenciasCliente, setSugerenciasCliente] = useState([]);
  const [sugerenciasEmpleado, setSugerenciasEmpleado] = useState([]);

  const URL = 'https://redgas.onrender.com/FacturaRegister';

  const validarCampos = () => {
    const errores = {};
    if (!IDcliente) errores.IDcliente = 'Debe seleccionar un cliente.';
    if (!IDempleado) errores.IDempleado = 'Debe seleccionar un empleado.';
    if (!fecha.trim()) errores.fecha = 'La fecha es obligatoria.';
    if (!totalFactura.trim() || parseFloat(totalFactura) <= 0) errores.total = 'Debe ingresar un total válido.';
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
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: parseInt(IDcliente),
          id_empleado: parseInt(IDempleado),
          fecha_factura: fecha,
          total: parseFloat(totalFactura)
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.msg || 'Error en la solicitud');
      }

      setMensaje('Factura registrada exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const cancelarRegistro = () => {
    setClienteCorreo('');
    setEmpleadoCorreo('');
    setIDcliente('');
    setIDempleado('');
    setFecha(new Date().toISOString().slice(0, 10));
    setTotalFactura('');
    setMensaje('');
    setErrores({});
    setSugerenciasCliente([]);
    setSugerenciasEmpleado([]);
    onClose();
  };

  const buscarCliente = (texto) => {
    setClienteCorreo(texto);
    const sugerencias = clientes.filter(c => c.correo_cliente.toLowerCase().includes(texto.toLowerCase()));
    setSugerenciasCliente(sugerencias);
  };

  const buscarEmpleado = (texto) => {
    setEmpleadoCorreo(texto);
    const sugerencias = empleados.filter(e => e.correo_empleado.toLowerCase().includes(texto.toLowerCase()));
    setSugerenciasEmpleado(sugerencias);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[350px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Factura</h2>

        {/* Autocompletar Cliente */}
        <Inputs
          Type="2"
          Place="Correo del cliente"
          Value={clienteCorreo}
          onChange={(e) => buscarCliente(e.target.value)}
        />
        {errores.IDcliente && <p className="text-red-600 text-sm">{errores.IDcliente}</p>}
        {sugerenciasCliente.length > 0 && (
          <div className="border p-2 bg-white shadow rounded">
            {sugerenciasCliente.map(cliente => (
              <div
                key={cliente.id_cliente}
                onClick={() => {
                  setClienteCorreo(cliente.correo_cliente);
                  setIDcliente(cliente.id_cliente);
                  setSugerenciasCliente([]);
                }}
                className="cursor-pointer hover:bg-gray-100 p-1"
              >
                {cliente.correo_cliente}
              </div>
            ))}
          </div>
        )}

        {/* Autocompletar Empleado */}
        <Inputs
          Type="2"
          Place="Correo del empleado"
          Value={empleadoCorreo}
          onChange={(e) => buscarEmpleado(e.target.value)}
        />
        {errores.IDempleado && <p className="text-red-600 text-sm">{errores.IDempleado}</p>}
        {sugerenciasEmpleado.length > 0 && (
          <div className="border p-2 bg-white shadow rounded">
            {sugerenciasEmpleado.map(empleado => (
              <div
                key={empleado.id_empleado}
                onClick={() => {
                  setEmpleadoCorreo(empleado.correo_empleado);
                  setIDempleado(empleado.id_empleado);
                  setSugerenciasEmpleado([]);
                }}
                className="cursor-pointer hover:bg-gray-100 p-1"
              >
                {empleado.correo_empleado}
              </div>
            ))}
          </div>
        )}

        <Inputs
          Type="7"
          Place="Fecha de la factura"
          Value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        {errores.fecha && <p className="text-red-600 text-sm">{errores.fecha}</p>}

        <Inputs
          Type="5"
          Place="Total de la factura"
          Value={totalFactura}
          onChange={(e) => setTotalFactura(e.target.value)}
        />
        {errores.total && <p className="text-red-600 text-sm">{errores.total}</p>}

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
