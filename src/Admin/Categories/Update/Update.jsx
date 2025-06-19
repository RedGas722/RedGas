import { useState, useEffect, useRef } from "react";
import { InputLabel } from "../../../UI/Login_Register/InputLabel/InputLabel";

export const UpdateModal = ({ onClose, setRefrescar, categoriaCarta }) => {
  const [categoria, setCategoria] = useState(null);
  const [nombreParaBusqueda, setNombreParaBusqueda] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [erroresActivos, setErroresActivos] = useState({});
  const errorTimeouts = useRef({});

  const validarCampos = () => {
    const errores = {};
    if (!nombre.trim()) errores.nombre = "El nombre es obligatorio";
    return errores;
  };

  useEffect(() => {
    if (categoriaCarta) {
      setCategoria(categoriaCarta);
      const nombreActual = categoriaCarta.nombre_categoria.trim();
      setNombre(nombreActual);
      setNombreParaBusqueda(nombreActual);
    }
  }, [categoriaCarta]);

  const actualizarCategoria = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setErroresActivos(erroresValidados);
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
    setMensaje("");
    try {
      const res = await fetch("https://redgas.onrender.com/CategoriaUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_categoria: nombre.trim(),
        }),
      });

      if (res.ok) {
        setMensaje("Categoría actualizada exitosamente.");
        setRefrescar(true);
        setNombreParaBusqueda(nombre.trim());
      } else {
        const data = await res.json();
        setMensaje(data.errorInfo || "Error al actualizar la categoría.");
      }
    } catch {
      setMensaje("Error de red al actualizar.");
    }
  };

  const cancelarEdicion = () => {
    setCategoria(null);
    setNombre("");
    setNombreParaBusqueda("");
    setErrores({});
    setErroresActivos({});
    setMensaje("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Categoría</h2>
        {categoria && (
          <>
            <InputLabel
              type="1"
              ForID="nombre_categoria"
              placeholder="Nombre de la categoría"
              childLabel="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full"
              placeholderError={!!errores.nombre}
            />
            {errores.nombre && (
              <p className="text-red-600 text-sm">{errores.nombre}</p>
            )}
            <div className="flex justify-between gap-2">
              <button
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarCategoria}
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
              mensaje.includes("exitosamente") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
