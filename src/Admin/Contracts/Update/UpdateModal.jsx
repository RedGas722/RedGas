import React, { useState, useEffect } from 'react';
import Inputs from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar, idEmpleado }) => {
  const [idBusqueda, setIdBusqueda] = useState(idEmpleado || '');
  const [contrato, setContrato] = useState({
    fecha_contrato: '',
    duracion_contrato: '',
    tipo_contrato: '',
    salario: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);

  const URL_GET = 'https://redgas.onrender.com/ContratoGet';
  const URL_UPDATE = 'https://redgas.onrender.com/ContratoDataUpdate';

  useEffect(() => {
    if (idEmpleado) {
      setIdBusqueda(idEmpleado);
      buscarContrato(idEmpleado);
    }
  }, [idEmpleado]);

  const buscarContrato = async (id) => {
    setMensaje('');
    setErrores({});
    setEditando(false);
    setContrato({
      fecha_contrato: '',
      duracion_contrato: '',
      tipo_contrato: '',
      salario: '',
    });

    if (!id || isNaN(id) || Number(id) <= 0) {
      setErrores({ idBusqueda: 'El ID debe ser un número mayor a 0' });
      return;
    }

    try {
      const res = await fetch(`${URL_GET}?id_empleado=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Contrato no encontrado');
      const data = await res.json();

      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Contrato no existe');
      }

      const c = data.data[0];
      
      setContrato({
        fecha_contrato: c.fecha_contrato ? c.fecha_contrato.split('T')[0] : '',
        duracion_contrato: c.duracion_contrato || '',
        tipo_contrato: c.tipo_contrato || '',
        salario: c.salario ? c.salario.toString() : '',
      });
      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar contrato: ' + err.message);
      setContrato({
        fecha_contrato: '',
        duracion_contrato: '',
        tipo_contrato: '',
        salario: '',
      });
      setEditando(false);
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!contrato.fecha_contrato) nuevosErrores.fecha_contrato = 'La fecha del contrato es obligatoria';
    if (!contrato.duracion_contrato) nuevosErrores.duracion_contrato = 'La duración del contrato es obligatoria';
    if (!contrato.tipo_contrato) nuevosErrores.tipo_contrato = 'El tipo de contrato es obligatorio';
    if (!contrato.salario || isNaN(contrato.salario) || Number(contrato.salario) <= 0) nuevosErrores.salario = 'El salario debe ser un número mayor a 0';
    return nuevosErrores;
  };

  const handleActualizar = async () => {
  const erroresValidos = validarCampos();
  if (Object.keys(erroresValidos).length > 0) {
    setErrores(erroresValidos);
    return;
  }
  setErrores({});
  setMensaje('');

  const jsonData = {
    fecha_contrato: contrato.fecha_contrato || null,
    duracion_contrato: contrato.duracion_contrato || null,
    tipo_contrato: contrato.tipo_contrato || null,
    salario: contrato.salario !== '' && !isNaN(contrato.salario) ? parseFloat(contrato.salario) : null,
  };


  try {
    const res = await fetch(URL_UPDATE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrato: jsonData, id_empleado: idBusqueda }),
    });
    const result = await res.json();
    if (!res.ok) {
      const text = typeof result === 'string' ? result : JSON.stringify(result);
      throw new Error(text || 'Error al actualizar');
    }

    if (result && (result.success || result.updated || result.message === 'Contrato actualizado')) {
      setMensaje('Contrato actualizado exitosamente.');
    } else {
      setMensaje('Actualización completada, pero sin confirmación explícita del backend.');
    }
    setTimeout(() => setMensaje(''), 2500);
    if (setRefrescar) setRefrescar(true);
    await buscarContrato(idBusqueda);
  } catch (err) {
    setMensaje('Error al actualizar: ' + err.message);
  }
};


  const handleCancelar = () => {
    setIdBusqueda('');
    setContrato({
      fecha_contrato: '',
      duracion_contrato: '',
      tipo_contrato: '',
      salario: '',
    });
    setEditando(false);
    setMensaje('');
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button className="absolute top-2 right-3 text-gray-600 text-lg" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold text-center">Actualizar Contrato</h2>

        {!editando && (
          <>
            <Inputs
              Type="5"
              Place="ID del empleado"
              Value={idBusqueda}
              onChange={e => setIdBusqueda(e.target.value)}
            />
            {errores.idBusqueda && <p className="text-red-600 text-sm">{errores.idBusqueda}</p>}
            <button
              onClick={() => buscarContrato(idBusqueda)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {editando && (
          <>
            <Inputs
              Type="7"
              Place="Fecha del contrato"
              Value={contrato.fecha_contrato}
              onChange={e => setContrato({ ...contrato, fecha_contrato: e.target.value })}
              className={errores.fecha_contrato ? 'border-red-500' : ''}
            />
            {errores.fecha_contrato && <p className="text-red-600 text-xs font-semibold">{errores.fecha_contrato}</p>}

            <Inputs
              Type="1"
              Place="Duración del contrato"
              Value={contrato.duracion_contrato}
              onChange={e => setContrato({ ...contrato, duracion_contrato: e.target.value })}
              className={errores.duracion_contrato ? 'border-red-500' : ''}
            />
            {errores.duracion_contrato && <p className="text-red-600 text-xs font-semibold">{errores.duracion_contrato}</p>}

            <Inputs
              Type="1"
              Place="Tipo de contrato"
              Value={contrato.tipo_contrato}
              onChange={e => setContrato({ ...contrato, tipo_contrato: e.target.value })}
              className={errores.tipo_contrato ? 'border-red-500' : ''}
            />
            {errores.tipo_contrato && <p className="text-red-600 text-xs font-semibold">{errores.tipo_contrato}</p>}

            <Inputs
              Type="5"
              Place="Salario"
              Value={contrato.salario}
              onChange={e => setContrato({ ...contrato, salario: e.target.value })}
              className={errores.salario ? 'border-red-500' : ''}
            />
            {errores.salario && <p className="text-red-600 text-xs font-semibold">{errores.salario}</p>}

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
          <p className={`text-center font-semibold ${mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
