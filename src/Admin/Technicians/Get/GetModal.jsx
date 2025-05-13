import React, { useState } from 'react';

export const GetModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [imagenURL, setImagenURL] = useState(null); // Estado para la URL de la imagen

  const URL = 'http://localhost:10101/TecnicoGet';

  const handleGet = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}?correo_tecnico=${encodeURIComponent(correo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();  
      if (data.data) {
        const tecnico = data.data;
  
        if (tecnico.imagen) {
          const imagenBase64 = tecnico.imagen;
          setImagenURL(`data:image/jpeg;base64,${imagenBase64}`);
        }
  
        setMensaje({ ...data, data: tecnico });
      }
    } catch (err) {
      console.error(err);
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };    

  const handleCancel = () => {
    setCorreo('');
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

        <h2 className="text-xl font-bold text-center">Consultar Tecnico</h2>

        <input
          type="text"
          placeholder="Correo del tecnico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
            <p><strong>Nombre:</strong> {mensaje.data.nombre_tecnico}</p>
            <p><strong>telefono:</strong> {mensaje.data.telefono_tecnico}</p>
            <p><strong>Correo:</strong> {mensaje.data.correo_tecnico}</p>            
            {mensaje.data.imagen && (
            <img
                src={`data:image/jpeg;base64,${mensaje.data.imagen}`}
                alt="Tecnico"
                className="mt-2 w-fit h-fit rounded shadow"
            />
            )}
        </div>
        )}
      </div>
    </div>
  );
};
