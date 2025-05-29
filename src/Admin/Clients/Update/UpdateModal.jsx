import React, { useState } from "react";
import Inputs from "../../UI/Inputs/Inputs"; 

export const UpdateModal = ({ onClose, setRefrescar }) => {
  const [correoBuscar, setCorreoBuscar] = useState("");
  const [cliente, setCliente] = useState(null);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  let correoBusqueda = correoBuscar;

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

  const buscarCliente = async () => {
    setMensaje("");
    setErrores({});
    setCorreoBuscar(correoBusqueda);

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoBuscar.trim()) {
      setErrores({ correoBuscar: "Ingresa un correo para buscar" });
      return;
    }

    if (!correoRegex.test(correoBuscar)) {
      setErrores({ correoBuscar: "Correo inválido" });
      return;
    }

    try {
      const res = await fetch(`https://redgas.onrender.com/ClienteGet?correo_cliente=${correoBusqueda}`);
      const data = await res.json();

      if (res.ok && data.data) {
        setCliente(data.data);
        setNuevoCorreo(data.data.correo_cliente);
        setEditando(true);

        const partes = data.data.nombre_cliente.split(" ");
        setNombre(partes[0] || "");
        setApellido(partes.slice(1).join(" ") || "");
      } else {
        setCliente(null);
        setEditando(false);
        setMensaje(data.status || "Cliente no encontrado.");
      }
    } catch {
      setCliente(null);
      setEditando(false);
      setMensaje("Error al buscar cliente.");
    }
  };

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
      correo_cliente: correoBuscar,
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
        correoBusqueda = nuevoCorreo;
        await buscarCliente();
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
    setCorreoBuscar("");
    setNuevoCorreo("");
    setEditando(false);
    setMensaje("");
    setErrores({});
    setNombre("");
    setApellido("");
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

        {!editando && (
          <>
            <Inputs
              Type="2"
              Place="Correo del cliente a buscar"
              Value={correoBuscar}
              onChange={(e) => {
                setCorreoBuscar(e.target.value);
                setErrores((prev) => ({ ...prev, correoBuscar: null }));
              }}
              className="w-full"
            />
            {errores.correoBuscar && (
              <p className="text-red-600 text-sm">{errores.correoBuscar}</p>
            )}

            <button
              onClick={buscarCliente}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </>
        )}

        {editando && cliente && (
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
