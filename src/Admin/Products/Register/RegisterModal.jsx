import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL = 'http://localhost:10101/ProductoRegister';

  const validarCampos = () => {
    const errores = {};
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 8 * 1024 * 1024; // 8MB

    if (!nombre.trim()) {
      errores.nombre = 'El nombre es obligatorio.';
    } else if (nombre.length > 100) {
      errores.nombre = 'El nombre debe tener como máximo 100 caracteres.';
    }

    if (!precio.trim()) {
      errores.precio = 'El precio es obligatorio.';
    } else if (isNaN(precio) || !/^\d+(\.\d{1,2})?$/.test(precio)) {
      errores.precio = 'El precio debe ser un número decimal válido.';
    }

    if (!descripcion.trim()) {
      errores.descripcion = 'La descripción es obligatoria.';
    }

    if (!stock.trim()) {
      errores.stock = 'El stock es obligatorio.';
    } else if (!/^\d+$/.test(stock) || parseInt(stock) <= 0) {
      errores.stock = 'El stock debe ser un número entero mayor que 0.';
    }

    if (!imagen) {
      errores.imagen = 'La imagen es obligatoria.';
    } else {
      if (!tiposPermitidos.includes(imagen.type)) {
        errores.imagen = 'Tipo de imagen no permitido. Solo JPG, PNG o WEBP.';
      }
      if (imagen.size > maxSize) {
        errores.imagen = 'La imagen no debe superar los 8MB.';
      }
    }

    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const erroresValidados = validarCampos();

    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    setErrores({});
    const formData = new FormData();
    formData.append('nombre_producto', nombre);
    formData.append('precio_producto', parseFloat(precio));
    formData.append('descripcion_producto', descripcion);
    formData.append('stock', parseInt(stock));
    formData.append('imagen', imagen);

    try {
      const res = await fetch(URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMensaje('Error al registrar: ' + (errorData?.errors?.[0]?.msg || 'Datos inválidos'));
        return;
      }

      await res.json();
      setMensaje('Producto registrado exitosamente.');
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setStock('');
    setImagen(null);
    setMensaje('');
    setErrores({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Registrar Producto</h2>

        <Inputs Type='1' Place='Nombre del Producto' Value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

        <Inputs Type='5' Place='Precio del Producto' Value={precio} onChange={(e) => setPrecio(e.target.value)} />
        {errores.precio && <p className="text-red-600 text-sm">{errores.precio}</p>}

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border rounded p-2"
        />
        {errores.descripcion && <p className="text-red-600 text-sm">{errores.descripcion}</p>}

        <Inputs Type='5' Place='Stock' Value={stock} onChange={(e) => setStock(e.target.value)} />
        {errores.stock && <p className="text-red-600 text-sm">{errores.stock}</p>}

        <Inputs Type='4' Place='Imagen del Producto' onChange={handleImageChange} />
        {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen}</p>}

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
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
