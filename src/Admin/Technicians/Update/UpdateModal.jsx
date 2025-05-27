import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [tecnico, setTecnico] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  let correoActualBusqueda = correoBusqueda;

  const URL_GET = 'http://localhost:10101/TecnicoGet';
  const URL_UPDATE = 'http://localhost:10101/TecnicoUpdateNI'; 
  const URL_UPDATE_IMAGEN = 'http://localhost:10101/TecnicoDataUpdate'; 

  // Validar campos
  const validarCampos = () => {
    const errores = {};
    if (!tecnico.nuevoNombre.trim()) errores.nuevoNombre = 'Nuevo nombre es obligatorio';
    if (!tecnico.nuevoCorreo.trim() || !validarCorreo(tecnico.nuevoCorreo)) errores.nuevoCorreo = 'Correo válido obligatorio';
    if (!tecnico.telefono.trim() || !/^\d{10}$/.test(tecnico.telefono)) errores.telefono = 'Teléfono válido (10 dígitos) obligatorio';
    return errores;
  };

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleBuscar = async () => {
    if (!editando) setMensaje('');
    setErrores({});
    if (!correoBusqueda.trim()) {
      setErrores({ correoBusqueda: 'El correo es obligatorio' });
      return;
    }
    if (!validarCorreo(correoBusqueda)) {
      setErrores({ correoBusqueda: 'Correo no válido' });
      return;
    }
    try {
      const res = await fetch(`${URL_GET}?correo_tecnico=${encodeURIComponent(correoActualBusqueda)}`);
      if (!res.ok) throw new Error('Técnico no encontrado');
      const data = await res.json();
      if (!data.data) throw new Error('Técnico no existe');
      setTecnico({
        correoActual: data.data.correo_tecnico,
        nuevoCorreo: data.data.correo_tecnico,
        nuevoNombre: data.data.nombre_tecnico,
        telefono: data.data.telefono_tecnico,
      });
      if (data.data.imagen) {
        setImagenActual(`data:image/jpeg;base64,${data.data.imagen}`);
        setImagenNueva(null);
      }
      setEditando(true);
    } catch (err) {
      setMensaje('Error al buscar técnico: ' + err.message);
    }
  }

  const handleActualizar = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }
    setErrores({});
    const hayImagen = !!imagenNueva;
    if (hayImagen) {
      const formData = new FormData();
      formData.append('correo_tecnico', tecnico.correoActual);
      formData.append('nuevo_correo_tecnico', tecnico.nuevoCorreo);
      formData.append('nombre_tecnico', tecnico.nuevoNombre);
      formData.append('telefono_tecnico', tecnico.telefono);
      formData.append('imagen', imagenNueva);
      try {
        const res = await fetch(URL_UPDATE_IMAGEN, {
          method: 'PUT',
          body: formData,
        });
        if (!res.ok) {
          const text = await res.text();
          if (text.includes('Duplicate entry') && text.includes('correo_tecnico')) {
            throw new Error('El correo ya está registrado.');
          }
          const data = JSON.parse(text);
          throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar con imagen');
        }
        if (setRefrescar) setRefrescar(true);
        correoActualBusqueda = tecnico.nuevoCorreo;
        await handleBuscar();
        setMensaje('Técnico e imagen actualizados exitosamente.');
      } catch (err) {
        setMensaje('Error al actualizar: ' + err.message);
      }
    } else {
      const jsonData = {
        correo_tecnico: tecnico.correoActual,
        nuevo_correo_tecnico: tecnico.nuevoCorreo,
        nombre_tecnico: tecnico.nuevoNombre,
        telefono_tecnico: tecnico.telefono,
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
          const text = await res.text();
          if (text.includes('Duplicate entry') && text.includes('correo_tecnico')) {
            throw new Error('El correo ya está registrado.');
          }
          const data = JSON.parse(text);
          throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar sin imagen');
        }
        if (setRefrescar) setRefrescar(true);
        correoActualBusqueda = tecnico.nuevoCorreo;
        await handleBuscar();
        setMensaje('Técnico actualizado exitosamente.');
      } catch (err) {
        setMensaje('Error al actualizar: ' + err.message);
      }
    }
  };

  const handleCancelar = () => {
    setCorreoBusqueda('');
    setTecnico(null);
    setEditando(false);
    setMensaje('');
    setErrores({});
    setImagenActual(null);
    setImagenNueva(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenNueva(file);
    } else {
      setImagenNueva(null);
    }
  };

  return (
    <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="NeoContainer_Admin_outset_TL p-6 w-[340px] flex flex-col gap-4 relative text-[var(--main-color)]">
        <div>
          <button
            className="absolute top-2 right-3 text-[var(--main-color)] text-lg"
            onClick={onClose}
          >✕</button>
        </div>

        <h2 className="text-xl font-bold text-center">Actualizar Tecnico</h2>

        <InputLabel type="1" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del Técnico" />

        <InputLabel type="2" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo actual del Técnico" />

        <InputLabel type="2" value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} placeholder="Correo nuevo del Técnico" />

        <InputLabel type="2" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono nuevo del Técnico" />
        
        <InputLabel type="3" ForID="Password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña nueva del Técnico" />

        <InputLabel type="4" ForID="imagen" placeholder="Seleccionar imagen" onChange={handleImageChange} />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Cancelar</button>
          <button
            onClick={handleUpdate}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Actualizar</button>
        </div>

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
  )
}
