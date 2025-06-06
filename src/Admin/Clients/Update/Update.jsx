import { useState, useEffect } from "react";
import Inputs from "../../UI/Inputs/Inputs"; 

export const UpdateModal = ({ onClose, setRefrescar, clienteCarta }) => {
  const [cliente, setCliente] = useState(null);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState(""); // correo para buscar cliente en backend
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

    if (!cliente?.telefono_cliente?.trim()) {
      errores.telefono_cliente = "El teléfono es obligatorio.";
    } else if (
      cliente.telefono_cliente.length !== 10 ||
      !/^\d+$/.test(cliente.telefono_cliente)
    ) {
      errores.telefono_cliente = "Teléfono debe tener 10 dígitos numéricos.";
    }

    return errores;
  };

  useEffect(() => {
    if (clienteCarta) {
      setCliente(clienteCarta);
      setNuevoCorreo(clienteCarta.correo_cliente);
      setCorreoParaBusqueda(clienteCarta.correo_cliente); // Inicialmente, el correo para búsqueda es el actual

      const partes = clienteCarta.nombre_cliente.trim().split(/\s+/); // Maneja múltiples espacios

        const nombre = partes.slice(0, 2).join(" "); // Primeras dos palabras como nombre
        const apellido = partes.slice(2).join(" ");  // El resto como apellido

        setNombre(nombre || "");
        setApellido(apellido || "");
    }
  }, [clienteCarta]);

  const actualizarCliente = async () => {
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    setErrores({});
    setMensaje("");

    const direccionActualizada = cliente.direccion_cliente?.trim() === "" ? "sin direccion" : cliente.direccion_cliente;

    const body = {
      nombre_cliente: `${nombre.trim()} ${apellido.trim()}`,
      nuevo_correo_cliente: nuevoCorreo,
      telefono_cliente: cliente.telefono_cliente,
      direccion_cliente: direccionActualizada,
      correo_cliente: correoParaBusqueda, // Usamos correo para buscar cliente (puede ser diferente al nuevoCorreo)
    };

    try {
      const res = await fetch("https://redgas.onrender.com/ClienteDataUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMensaje("Cliente actualizado exitosamente.");
        setRefrescar(true);

        // Actualizar correoParaBusqueda solo si el correo nuevo cambió respecto al usado para buscar
        if (correoParaBusqueda !== nuevoCorreo) {
          setCorreoParaBusqueda(nuevoCorreo);
        }
      } else {
        const data = await res.json();
        setMensaje(data.errorInfo || "Error al actualizar cliente.");
      }
    } catch {
      setMensaje("Error de red al actualizar.");
    }
  };

  const cancelarEdicion = () => {
    setCliente(null);
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
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Actualizar Cliente</h2>

        {cliente && (
          <>
            <Inputs
              Type="1"
              Place="Nombre"
              Value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full"
            />
            {errores.nombre && (
              <p className="text-red-600 text-sm">{errores.nombre}</p>
            )}

            <Inputs
              Type="1"
              Place="Apellido"
              Value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full"
            />
            {errores.apellido && (
              <p className="text-red-600 text-sm">{errores.apellido}</p>
            )}

            <Inputs
              Type="2"
              Place="Nuevo correo"
              Value={nuevoCorreo}
              onChange={(e) => {
                setNuevoCorreo(e.target.value);
                setErrores((prev) => ({ ...prev, nuevoCorreo: null }));
              }}
              className="w-full"
            />
            {errores.nuevoCorreo && (
              <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>
            )}

            <Inputs
              Type="6"
              Place="Teléfono"
              Value={cliente.telefono_cliente}
              onChange={(e) =>
                setCliente({ ...cliente, telefono_cliente: e.target.value })
              }
              className="w-full"
            />
            {errores.telefono_cliente && (
              <p className="text-red-600 text-sm">{errores.telefono_cliente}</p>
            )}

            <Inputs
              Type="1"
              Place="Dirección"
              Value={cliente.direccion_cliente}
              onChange={(e) =>
                setCliente({ ...cliente, direccion_cliente: e.target.value })
              }
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
                onClick={actualizarCliente}
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
