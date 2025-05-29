import { useState } from 'react';
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel';

export const GetModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [imagenURL, setImagenURL] = useState(null); // Estado para la URL de la imagen
  const [errorCorreo, setErrorCorreo] = useState(''); // Estado para errores en el correo

  const URL = 'https://redgas.onrender.com/TecnicoGet';

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleGet = async (e) => {
    e.preventDefault();

    if (!validarCorreo(correo)) {
      setErrorCorreo('Por favor, ingresa un correo válido.');
      return;
    }

    setErrorCorreo(''); // Limpiar errores si el correo es válido

    try {
      const res = await fetch(`${URL}?correo_tecnico=${encodeURIComponent(correo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();

      if (!data.data) {
        setMensaje({ error: 'El correo no se encuentra registrado.' });
        return;
      }

      const tecnico = data.data;

      if (tecnico.imagen) {
        const imagenBase64 = tecnico.imagen;
        setImagenURL(`data:image/jpeg;base64,${imagenBase64}`);
      }

      setMensaje({ ...data, data: tecnico });
    } catch (err) {
      console.error(err);
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setCorreo('');
    setMensaje(null);
    setImagenURL(null);
    setErrorCorreo(''); // Limpiar errores al cancelar
  };

  return (
    <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Tecnico</h2>
        <InputLabel type='2' placeholder='Correo del tecnico' value={correo} onChange={(e) => setCorreo(e.target.value)} />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Cancelar</button>
          <button
            onClick={handleGet}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
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

        {mensaje && mensaje.error && (
          <p className="text-red-500 text-sm mt-2">{mensaje.error}</p>
        )}
      </div>
    </div>
  );
};
