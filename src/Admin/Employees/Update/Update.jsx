import { useState, useEffect } from "react";
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel';

export const UpdateModal = ({ onClose, setRefrescar, empleadoCarta }) => {
  const [empleado, setEmpleado] = useState(null);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState(""); // correo para buscar empleado en backend
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const validarCampos = () => {
    const errores = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim()) errores.nombre = "El nombre es obligatorio";
    if (!apellido.trim()) errores.apellido = "El apellido es obligatorio";

    if (!nuevoCorreo.trim()) {
      errores.nuevoCorreo = "El correo es obligatorio.";
    } else if (!correoRegex.test(nuevoCorreo)) {
      errores.nuevoCorreo = "Correo inválido.";
    }

    if (!empleado?.telefono_empleado?.trim()) {
      errores.telefono_empleado = "El teléfono es obligatorio.";
    } else if (
      empleado.telefono_empleado.length !== 10 ||
      !/^\d+$/.test(empleado.telefono_empleado)
    ) {
      errores.telefono_empleado = "Teléfono debe tener 10 dígitos numéricos.";
    }

    return errores;
  };

  useEffect(() => {
    if (empleadoCarta) {
      setEmpleado(empleadoCarta);
      setNuevoCorreo(empleadoCarta.correo_empleado);
      setCorreoParaBusqueda(empleadoCarta.correo_empleado); // Inicialmente, el correo para búsqueda es el actual

      const partesNombre = empleadoCarta.nombre_empleado.split(' ');
      const nombre = partesNombre.slice(0, Math.ceil(partesNombre.length / 2)).join(' ');
      const apellido = partesNombre.slice(Math.ceil(partesNombre.length / 2)).join(' ');

        setNombre(nombre || "");
        setApellido(apellido || "");
    }
  }, [empleadoCarta]);

  const actualizarEmpleado = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    setErrores({});
    setMensaje("");

    const direccionActualizada = empleado.direccion_empleado?.trim() === "" ? "sin direccion" : empleado.direccion_empleado;

    const body = {
      nombre_empleado: `${nombre.trim()} ${apellido.trim()}`,
      nuevo_correo_empleado: nuevoCorreo,
      telefono_empleado: empleado.telefono_empleado,
      direccion_empleado: direccionActualizada,
      correo_empleado: correoParaBusqueda, // Usamos correo para buscar empleado (puede ser diferente al nuevoCorreo)
    };

    try {
      const res = await fetch("https://redgas.onrender.com/EmpleadoDataUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMensaje("Empleado actualizado exitosamente.");
        setRefrescar(true);

        // Actualizar correoParaBusqueda solo si el correo nuevo cambió respecto al usado para buscar
        if (correoParaBusqueda !== nuevoCorreo) {
          setCorreoParaBusqueda(nuevoCorreo);
        }
      } else {
        const data = await res.json();
        setMensaje(data.errorInfo || "Error al actualizar empleado.");
      }
    } catch {
      setMensaje("Error de red al actualizar.");
    }
  };

  const cancelarEdicion = () => {
    setEmpleado(null);
    setNuevoCorreo("");
    setCorreoParaBusqueda("");
    setMensaje("");
    setErrores({});
    setNombre("");
    setApellido("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Empleado</h2>

        {empleado && (
          <>
            <InputLabel
              type="1"
              ForID="nombre_empleado"
              placeholder="Nombre"
              childLabel="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full"
              placeholderError={!!errores.nombre}
            />
            {errores.nombre && (
              <p className="text-red-600 text-sm">{errores.nombre}</p>
            )}
            <InputLabel
              type="1"
              ForID="apellido_empleado"
              placeholder="Apellido"
              childLabel="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full"
              placeholderError={!!errores.apellido}
            />
            {errores.apellido && (
              <p className="text-red-600 text-sm">{errores.apellido}</p>
            )}
            <InputLabel
              type="2"
              ForID="correo_empleado"
              placeholder="Correo"
              childLabel="Correo"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              className="w-full"
              placeholderError={!!errores.nuevoCorreo}
            />
            {errores.nuevoCorreo && (
              <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>
            )}
            <InputLabel
              type="6"
              ForID="telefono_empleado"
              placeholder="Teléfono"
              childLabel="Teléfono"
              value={empleado.telefono_empleado || ''}
              onChange={(e) => setEmpleado({ ...empleado, telefono_empleado: e.target.value })}
              className="w-full"
              placeholderError={!!errores.telefono_empleado}
            />
            {errores.telefono_empleado && (
              <p className="text-red-600 text-sm">{errores.telefono_empleado}</p>
            )}
            <InputLabel
              type="1"
              ForID="direccion_empleado"
              placeholder="Dirección"
              childLabel="Dirección"
              value={empleado.direccion_empleado || ''}
              onChange={(e) => setEmpleado({ ...empleado, direccion_empleado: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarEmpleado}
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
