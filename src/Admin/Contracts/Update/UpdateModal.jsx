import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [idBusqueda, setIdBusqueda] = useState(''); // id_empleado para buscar
  const [idContrato, setIdContrato] = useState(null); // id_contrato real para actualizar
  const [contrato, setContrato] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);

  const URL_GET = 'http://localhost:10101/ContratoGet';
  const URL_UPDATE = 'http://localhost:10101/ContratoDataUpdate';

  const validarCampos = () => {
    const errores = {};
    if (!contrato.fecha_contrato?.trim()) errores.fecha_contrato = 'Fecha es obligatoria';
    if (!contrato.duracion_contrato?.trim()) errores.duracion_contrato = 'Duración es obligatoria';
    if (!contrato.tipo_contrato?.trim()) errores.tipo_contrato = 'Tipo es obligatorio';
    if (!contrato.salario || isNaN(contrato.salario) || parseFloat(contrato.salario) <= 0) errores.salario = 'Salario válido obligatorio';
    if (!contrato.id_admin || isNaN(contrato.id_admin) || parseInt(contrato.id_admin) <= 0) errores.id_admin = 'ID admin válido obligatorio';
    if (!contrato.id_empleado || isNaN(contrato.id_empleado) || parseInt(contrato.id_empleado) <= 0) errores.id_empleado = 'ID empleado válido obligatorio';
    return errores;
  };

  const handleBuscar = async () => {
    setMensaje('');
    setErrores({});
    if (!idBusqueda.trim() || isNaN(idBusqueda) || parseInt(idBusqueda) <= 0) {
      setErrores({ idBusqueda: 'El ID es obligatorio y debe ser un número mayor a 0' });
      return;
    }
    try {
      const res = await fetch(`${URL_GET}?id_empleado=${encodeURIComponent(idBusqueda)}`);
      if (!res.ok) throw new Error('Contrato no encontrado');
      const data = await res.json();

      if (!data.data) throw new Error('Contrato no existe');

      // Guardar id_contrato para actualización
      setIdContrato(data.data.id_contrato);

      setContrato({
        fecha_contrato: data.data.fecha_contrato || '',
        duracion_contrato: data.data.duracion_contrato || '',
        tipo_contrato: data.data.tipo_contrato || '',
        salario: data.data.salario?.toString() || '',
        id_admin: data.data.id_admin?.toString() || '',
        id_empleado: data.data.id_empleado?.toString() || '',
      });
      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar contrato: ' + err.message);
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
      id_contrato: idContrato,
      fecha_contrato: contrato.fecha_contrato,
      duracion_contrato: contrato.duracion_contrato,
      tipo_contrato: contrato.tipo_contrato,
      salario: parseFloat(contrato.salario),
      id_admin: parseInt(contrato.id_admin),
      id_empleado: parseInt(contrato.id_empleado),
    };

    try {
      const res = await fetch(URL_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al actualizar');
      }

      if (setRefrescar) setRefrescar(true);
      setMensaje('Contrato actualizado exitosamente.');
      await handleBuscar(); // recarga datos
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancelar = () => {
    setIdBusqueda('');
    setIdContrato(null);
    setContrato(null);
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
        <h2 className="text-xl font-bold text-center">Actualizar Contrato</h2>

        {!editando && (
          <>
            <Inputs
              Type="5"
              Place="ID del empleado (búsqueda)"
              Value={idBusqueda}
              onChange={(e) => setIdBusqueda(e.target.value)}
            />
            {errores.idBusqueda && (
              <p className="text-red-600 text-sm">{errores.idBusqueda}</p>
            )}
            <button
              onClick={handleBuscar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {editando && contrato && (
          <>
            <Inputs
              Type="7"
              Place="Fecha del contrato"
              Value={contrato.fecha_contrato}
              onChange={(e) => setContrato({ ...contrato, fecha_contrato: e.target.value })}
              className={errores.fecha_contrato ? 'border-red-500' : ''}
            />
            {errores.fecha_contrato && (
              <p className="text-red-600 text-xs font-semibold mb-1">{errores.fecha_contrato}</p>
            )}

            <Inputs
              Type="1"
              Place="Duración del contrato"
              Value={contrato.duracion_contrato}
              onChange={(e) => setContrato({ ...contrato, duracion_contrato: e.target.value })}
              className={errores.duracion_contrato ? 'border-red-500' : ''}
            />
            {errores.duracion_contrato && (
              <p className="text-red-600 text-xs font-semibold mb-1">{errores.duracion_contrato}</p>
            )}

            <Inputs
              Type="1"
              Place="Tipo de contrato"
              Value={contrato.tipo_contrato}
              onChange={(e) => setContrato({ ...contrato, tipo_contrato: e.target.value })}
              className={errores.tipo_contrato ? 'border-red-500' : ''}
            />
            {errores.tipo_contrato && (
              <p className="text-red-600 text-xs font-semibold mb-1">{errores.tipo_contrato}</p>
            )}

            <Inputs
              Type="5"
              Place="Salario"
              Value={contrato.salario}
              onChange={(e) => setContrato({ ...contrato, salario: e.target.value })}
              className={errores.salario ? 'border-red-500' : ''}
            />
            {errores.salario && (
              <p className="text-red-600 text-xs font-semibold mb-1">{errores.salario}</p>
            )}

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
