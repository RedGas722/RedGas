import React, { useState } from 'react';

export const GetModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [imagenURL, setImagenURL] = useState(null); // Estado para la URL de la imagen

  const URL = 'http://localhost:10101/ProductoGet';

  const handleGet = async (e) => {
    e.preventDefault();
    try {
      console.log('Consultando...');
      const res = await fetch(`${URL}?nombre_producto=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();  
      if (data.data) {
        const producto = data.data;
  
        if (producto.imagen) {
          const imagenBase64 = producto.imagen;
          setImagenURL(`data:image/jpeg;base64,${imagenBase64}`);
        }
  
        setMensaje({ ...data, data: producto });
        console.log('Completado!');
      }
    } catch (err) {
      console.error(err);
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };    

  const handleCancel = () => {
    setNombre('');
    setMensaje(null);
    setImagenURL(null); 
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Producto</h2>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleGet}
            className="bg-blue-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Consultar</button>
        </div>

        {mensaje && mensaje.data && (
        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>Nombre:</strong> {mensaje.data.nombre_producto}</p>
            <p><strong>Precio:</strong> {mensaje.data.precio_producto}</p>
            <p><strong>Descripción:</strong> {mensaje.data.descripcion_producto}</p>
            <p><strong>Stock:</strong> {mensaje.data.stock}</p>
            {mensaje.data.imagen && (
            <img
                src={`data:image/jpeg;base64,${mensaje.data.imagen}`}
                alt="Producto"
                className="mt-2 w-full w-fit h-fit rounded shadow"
            />
            )}
        </div>
        )}
      </div>
    </div>
  );
};
