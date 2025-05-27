import React, { useState, useEffect } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, onProductoRegistrado, setRefrescar }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL_REGISTER = 'http://localhost:10101/ProductoRegister';
  const URL_GET = 'http://localhost:10101/ProductoGet';
  const URL_CATEGORIAS = 'http://localhost:10101/CategoriaGetAll';
  const URL_SE_ENCUENTRA = 'http://localhost:10101/SeEncuentraRegister';

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(URL_CATEGORIAS);
        if (res.ok) {
          const data = await res.json();
          setCategorias(data?.data || []);
        } else {
          console.warn('Error al obtener categorías:', res.status);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

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

    if (!categoriaId) {
      errores.categoria = 'Debe seleccionar una categoría.';
    }

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
      const resCheck = await fetch(`${URL_GET}?nombre_producto=${encodeURIComponent(nombre)}`);
      if (resCheck.ok) {
        const dataCheck = await resCheck.json();
        if (dataCheck?.data?.length > 0) {
          setMensaje('Ya existe un producto con ese nombre.');
          return;
        }
      }

      const formData = new FormData();
      formData.append('nombre_producto', nombre);
      formData.append('precio_producto', parseFloat(precio));
      formData.append('descripcion_producto', descripcion);
      formData.append('stock', parseInt(stock));
      formData.append('imagen', imagen);

      const resRegister = await fetch(URL_REGISTER, {
        method: 'POST',
        body: formData,
      });

      if (!resRegister.ok) {
        if (resRegister.status === 500) {
          setMensaje('Error: Ya existe un producto con ese nombre.');
        } else {
          const errorData = await resRegister.json();
          setMensaje('Error al registrar: ' + (errorData?.errors?.[0]?.msg || 'Datos inválidos.'));
        }
        return;
      }

      const resNuevo = await fetch(`${URL_GET}?nombre_producto=${encodeURIComponent(nombre)}`);
      if (resNuevo.ok) {
        const dataNuevo = await resNuevo.json();
        if (onProductoRegistrado && dataNuevo?.data) {
          const producto = dataNuevo.data;
          const idProducto = producto.id_producto;

          // Registrar relación en SeEncuentra
          try {
            const resSeEncuentra = await fetch(URL_SE_ENCUENTRA, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_producto: idProducto,
                id_categoria: parseInt(categoriaId),
              }),
            });

            if (!resSeEncuentra.ok) {
              console.warn('Error al registrar en SeEncuentra:', resSeEncuentra.status);
            }
          } catch (error) {
            console.error('Error de red al registrar en SeEncuentra:', error);
          }

          onProductoRegistrado(producto);
        }
      } else if (resNuevo.status === 404) {
        console.warn('Producto registrado, pero no se pudo obtener con GET (404).');
      } else {
        console.warn('Error inesperado al obtener el producto:', resNuevo.status);
      }

      setMensaje('Producto registrado exitosamente.');
      if (setRefrescar) setRefrescar(true);
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
    setCategoriaId('');
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
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Registrar Producto</h2>

        <Inputs Type="1" Place="Nombre del Producto" Value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

        <Inputs Type="5" Place="Precio del Producto" Value={precio} onChange={(e) => setPrecio(e.target.value)} />
        {errores.precio && <p className="text-red-600 text-sm">{errores.precio}</p>}

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border rounded p-2"
        />
        {errores.descripcion && <p className="text-red-600 text-sm">{errores.descripcion}</p>}

        <Inputs Type="5" Place="Stock" Value={stock} onChange={(e) => setStock(e.target.value)} />
        {errores.stock && <p className="text-red-600 text-sm">{errores.stock}</p>}

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>
        {errores.categoria && <p className="text-red-600 text-sm">{errores.categoria}</p>}

        <Inputs Type="4" Place="Imagen del Producto" onChange={handleImageChange} />
        {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen}</p>}

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrar
          </button>
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
