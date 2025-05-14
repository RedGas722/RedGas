import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose }) => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [producto, setProducto] = useState(null); 
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  const [imagenNueva, setImagenNueva] = useState(null); 
  const [imagenActual, setImagenActual] = useState(null); 

  const URL_GET = 'http://localhost:10101/ProductoGet';
  const URL_UPDATE = 'http://localhost:10101/ProductoUpdateNI'; // Ruta para actualizar datos sin imagen
  const URL_UPDATE_IMAGEN = 'http://localhost:10101/ProductoUpdate'; // Ruta para actualizar el producto con imagen

  // Función para validar los campos
  const validarCampos = () => {
    const errores = {};

    if (!producto.nuevoNombre.trim()) errores.nuevoNombre = 'Nuevo nombre es obligatorio';
    if (!producto.precio || producto.precio <= 0) errores.precio = 'Precio debe ser mayor que 0';
    if (!producto.descripcion.trim()) errores.descripcion = 'Descripción es obligatoria';
    if (!producto.stock || producto.stock < 0) errores.stock = 'Stock no puede ser negativo';

    return errores;
  };

  // Función para buscar el producto
  const handleBuscar = async () => {
    setMensaje('');
    setErrores({});

    if (!nombreProducto.trim()) {
      setErrores({ nombreProducto: 'El nombre del producto es obligatorio' });
      return;
    }

    try {
      const res = await fetch(`${URL_GET}?nombre_producto=${encodeURIComponent(nombreProducto)}`);
      if (!res.ok) throw new Error('Producto no encontrado');

      const data = await res.json();
      if (!data.data) throw new Error('Producto no existe');

      setProducto({
        nombreProducto: data.data.nombre_producto,
        nuevoNombre: data.data.nombre_producto,
        precio: data.data.precio_producto,
        descripcion: data.data.descripcion_producto,
        stock: data.data.stock,
      });

      // Cargar imagen actual desde base64
      if (data.data.imagen) {
        setImagenActual(`data:image/jpeg;base64,${data.data.imagen}`); 
        setImagenNueva(null); 
      }

      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar producto: ' + err.message);
    }
  };

  // Función para actualizar el producto
  const handleActualizar = async () => {
  const erroresValidados = validarCampos();
  if (Object.keys(erroresValidados).length > 0) {
    setErrores(erroresValidados);
    return;
  }

  setErrores({});
  const hayImagen = !!imagenNueva;

  if (hayImagen) {
    // Si hay imagen, enviar con FormData
    const formData = new FormData();
    formData.append('nombre_producto', producto.nombreProducto);
    formData.append('nuevo_nombre_producto', producto.nuevoNombre);
    formData.append('precio_producto', parseFloat(producto.precio));
    formData.append('descripcion_producto', producto.descripcion);
    formData.append('stock', parseInt(producto.stock));
    formData.append('imagen', imagenNueva);

    try {
      const res = await fetch(URL_UPDATE_IMAGEN, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar con imagen');
      }

      setMensaje('Producto e imagen actualizados exitosamente.');
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  } else {
    // Si no hay imagen, enviar como JSON
    const jsonData = {
      nombre_producto: producto.nombreProducto,
      nuevo_nombre_producto: producto.nuevoNombre,
      precio_producto: parseFloat(producto.precio),
      descripcion_producto: producto.descripcion,
      stock: parseInt(producto.stock),
    };

    try {
      const res = await fetch(URL_UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar sin imagen');
      }

      setMensaje('Producto actualizado exitosamente.');
      } catch (err) {
        setMensaje('Error al actualizar: ' + err.message);
      }
    }
  };

  // Función para cancelar la actualización
  const handleCancelar = () => {
    setNombreProducto('');
    setProducto(null);
    setEditando(false);
    setMensaje('');
    setErrores({});
    setImagenActual(null);
    setImagenNueva(null);
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenNueva(file); 
    } else {
      setImagenNueva(null); 
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Actualizar Producto</h2>

        {!editando && (
          <>
            <Inputs
              Type="1"
              Place="Nombre del Producto"
              Value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
            />
            {errores.nombreProducto && (
              <p className="text-red-600 text-sm">{errores.nombreProducto}</p>
            )}

            <button
              onClick={handleBuscar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {editando && producto && (
          <>
            <Inputs
              Type="1"
              Place="Nuevo Nombre del Producto"
              Value={producto.nuevoNombre}
              onChange={(e) => setProducto({ ...producto, nuevoNombre: e.target.value })}
            />
            {errores.nuevoNombre && <p className="text-red-600 text-sm">{errores.nuevoNombre}</p>}
            <Inputs
              Type="5"
              Place="Nuevo Precio del Producto"
              Value={producto.precio}
              onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
            />
            {errores.precio && <p className="text-red-600 text-sm">{errores.precio}</p>}
            <textarea
              placeholder="Descripción"
              value={producto.descripcion}
              onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
              className="border rounded p-2"
            />
            {errores.descripcion && <p className="text-red-600 text-sm">{errores.descripcion}</p>}
            <Inputs
              Type="5"
              Place="Nuevo Stock del Producto"
              Value={producto.stock}
              onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
            />
            {errores.stock && <p className="text-red-600 text-sm">{errores.stock}</p>}
            {imagenActual && (
              <div className="mt-2 flex flex-col items-center">
                <p>Imagen Actual:</p>
                <img
                  src={imagenActual}
                  alt="Producto"
                  className="w-[200px] h-[200px] object-cover rounded shadow mt-2"
                />
              </div>
            )}
            <label className="mt-2">Seleccionar Nueva Imagen:</label>
            <Inputs
              Type="4"
              Place="Seleccionar Nueva Imagen"
              onChange={handleImageChange}
            />
            {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen}</p>}
            <div className="flex justify-between gap-2">
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
              mensaje.includes('exitosa') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
