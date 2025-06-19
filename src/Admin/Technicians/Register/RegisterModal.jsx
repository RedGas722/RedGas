import { useState, useRef } from 'react';
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [cc, setCc] = useState(0);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [erroresActivos, setErroresActivos] = useState({});
  const errorTimeouts = useRef({});

  const URL_REGISTER = 'https://redgas.onrender.com/TecnicoRegister';
  const URL_GET = 'https://redgas.onrender.com/TecnicoGet';

  const validarCampos = () => {
    const errores = {};
    if (cc < 10 || cc > 15) errores.cc = "Cedula obligatoria, entre 10 y 15 caracteres"
    if (!nombre.trim()) errores.nombre = 'Nombre es requerido.';
    if (!apellido.trim()) errores.apellido = 'Apellido es requerido.';
    if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Correo inválido.';
    if (!telefono.trim() || !/^\d{10}$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos.';
    if (!contrasena.trim() || contrasena.length < 6) errores.contrasena = 'Contraseña debe tener al menos 6 caracteres.';
    if (!imagen) errores.imagen = 'Imagen es requerida.';
    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      setErroresActivos(erroresValidados);
      // Limpiar errores después de 2 segundos
      Object.keys(erroresValidados).forEach((key) => {
        if (errorTimeouts.current[key]) clearTimeout(errorTimeouts.current[key]);
        errorTimeouts.current[key] = setTimeout(() => {
          setErroresActivos((prev) => ({ ...prev, [key]: undefined }));
        }, 2000);
      });
      return;
    }
    setErrores({});
    setErroresActivos({});
    setMensaje('');
    try {
      // Verificar si ya existe un técnico con ese correo
      const resCheck = await fetch(`${URL_GET}?correo_tecnico=${encodeURIComponent(correo)}`);
      if (resCheck.ok) {
        const dataCheck = await resCheck.json();
        if (dataCheck?.data) {
          setMensaje('Ya existe un técnico con ese correo.');
          return;
        }
      }
      const formData = new FormData();
      formData.append('cc', cc);
      formData.append('nombre_tecnico', nombre + ' ' + apellido);
      formData.append('correo_tecnico', correo);
      formData.append('telefono_tecnico', telefono);
      formData.append('contrasena_tecnico', contrasena);
      formData.append('imagen', imagen);
      const res = await fetch(URL_REGISTER, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        setMensaje('Error al registrar: Datos inválidos.');
        return;
      }
      setMensaje('Técnico registrado exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const cancelarRegistro = () => {
    setCc(0);
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setContrasena('');
    setImagen(null);
    setErrores({});
    setMensaje('');
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file || null);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="NeoContainer_Admin_outset_TL p-6 w-[320px] flex flex-col gap-4 relative text-[var(--main-color)]">
        <h2 className="text-xl font-bold text-center">Registrar Técnico</h2>
        <InputLabel type='5' placeholder={erroresActivos.cc || 'CC'} value={cc} onChange={(e) => setCc(e.target.value)} placeholderError={!!erroresActivos} />
        <InputLabel type='1' placeholder={erroresActivos.nombre || 'Nombre del Técnico'} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholderError={!!erroresActivos.nombre} />
        <InputLabel type='1' placeholder={erroresActivos.apellido || 'Apellido del Técnico'} value={apellido} onChange={(e) => setApellido(e.target.value)} placeholderError={!!erroresActivos.apellido} />
        <InputLabel type='2' placeholder={erroresActivos.correo || 'Correo del Técnico'} value={correo} onChange={(e) => setCorreo(e.target.value)} placeholderError={!!erroresActivos.correo} />
        <InputLabel type='6' placeholder={erroresActivos.telefono || 'Teléfono del Técnico'} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholderError={!!erroresActivos.telefono} />
        <InputLabel type='3' placeholder={erroresActivos.contrasena || 'Contraseña del Técnico'} value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholderError={!!erroresActivos.contrasena} />
        <InputLabel type='4' placeholder={erroresActivos.imagen || 'Imagen del Técnico'} value={imagen} onChange={handleImageChange} placeholderError={!!erroresActivos.imagen} />
        <div className="flex justify-between gap-2">
          <button
            onClick={cancelarRegistro}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Cancelar</button>
          <button
            onClick={handleRegister}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
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
