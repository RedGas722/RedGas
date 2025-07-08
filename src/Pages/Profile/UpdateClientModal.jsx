import { useState, useEffect } from "react"
import { InputLabel } from "../../UI/Login_Register/InputLabel/InputLabel"
import { startTokenRefresher } from '../Login/TokenRefresher'

export const UpdateClientModal = ({ onClose, clienteData, setClienteData, passwordVerificada }) => {
    const [cliente, setCliente] = useState(null);
    const [nuevoCorreo, setNuevoCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [errores, setErrores] = useState({});
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");

    useEffect(() => {
        if (clienteData) {
            setCliente(clienteData);
            setNuevoCorreo(clienteData.email);
            const partes = clienteData.name.trim().split(/\s+/);
            const nombre = partes.slice(0, 2).join(" ");
            const apellido = partes.slice(2).join(" ");
            setNombre(nombre || "");
            setApellido(apellido || "");
        }
    }, [clienteData]);

    const validar = () => {
        const errores = {};
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nombre.trim()) errores.nombre = "El nombre es obligatorio";
        if (!apellido.trim()) errores.apellido = "El apellido es obligatorio";

        if (!nuevoCorreo.trim()) {
            errores.nuevoCorreo = "El correo es obligatorio.";
        } else if (!correoRegex.test(nuevoCorreo)) {
            errores.nuevoCorreo = "Correo inválido.";
        }

        if (!cliente?.telefono?.trim()) {
            errores.telefono = "El teléfono es obligatorio.";
        } else if (cliente.telefono.length !== 10 || !/^\d+$/.test(cliente.telefono)) {
            errores.telefono = "Teléfono debe tener 10 dígitos numéricos.";
        }

        return errores;
    };

    const actualizar = async () => {
        const erroresValidados = validar();
        if (Object.keys(erroresValidados).length > 0) {
            setErrores(erroresValidados);
            return;
        }

        setErrores({});
        setMensaje("");

        const direccionActualizada = cliente.direccion?.trim() === "" ? "sin direccion" : cliente.direccion;

        try {
            // Verificar login con correo viejo y contraseña ya validada
            const loginRes = await fetch("https://redgas.onrender.com/ClienteLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo_cliente: clienteData.email,
                    contraseña_cliente: passwordVerificada,
                }),
            });

            if (!loginRes.ok) {
                setMensaje("Contraseña incorrecta. No se actualizaron los datos.");
                return;
            }

            // Actualizar datos
            const updateBody = {
                nombre_cliente: `${nombre.trim()} ${apellido.trim()}`,
                nuevo_correo_cliente: nuevoCorreo,
                telefono_cliente: cliente.telefono,
                direccion_cliente: direccionActualizada,
                correo_cliente: clienteData.email,
            };

            const res = await fetch("https://redgas.onrender.com/ClienteDataUpdate", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateBody),
            });

            if (!res.ok) {
                const data = await res.json();
                setMensaje(data.errorInfo || "Error al actualizar cliente.");
                return;
            }

            // Relogin con nuevo correo
            const reloginRes = await fetch("https://redgas.onrender.com/ClienteLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo_cliente: nuevoCorreo,
                    contraseña_cliente: passwordVerificada,
                }),
            });

            if (!reloginRes.ok) {
                setMensaje("Datos actualizados, pero error al renovar token.");
                return;
            }

            const data = await reloginRes.json();
            localStorage.setItem("token", data.token);

            const recordarme = localStorage.getItem("recordarme") === 'true';
            if (!recordarme) {
                startTokenRefresher();
            }

            const payload = JSON.parse(atob(data.token.split(".")[1]));
            const actualizado = payload.data;

            setClienteData({
                id: actualizado.id,
                name: actualizado.name,
                email: actualizado.email,
                telefono: actualizado.telefono,
                direccion: actualizado.direccion,
            });

            setMensaje("Datos actualizados correctamente.");
        } catch {
            setMensaje("Error de red al actualizar.");
        }
    };

    const cancelar = () => {
        onClose()
        setCliente(null)
        setNuevoCorreo("")
        setNombre("")
        setApellido("")
        setErrores({})
        setMensaje("")
    }

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
                <h2 className="text-xl font-bold text-center">Actualizar Cliente</h2>

                {cliente && (
                    <>
                        <InputLabel
                            type="1"
                            ForID="nombre_cliente"
                            placeholder="Nombre"
                            childLabel="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full"
                            placeholderError={!!errores.nombre}
                        />
                        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

                        <InputLabel
                            type="1"
                            ForID="apellido_cliente"
                            placeholder="Apellido"
                            childLabel="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full"
                            placeholderError={!!errores.apellido}
                        />
                        {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}

                        <InputLabel
                            type="2"
                            ForID="correo_cliente"
                            placeholder="Nuevo correo"
                            childLabel="Correo"
                            value={nuevoCorreo}
                            onChange={(e) => setNuevoCorreo(e.target.value)}
                            className="w-full"
                            placeholderError={!!errores.nuevoCorreo}
                        />
                        {errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}

                        <InputLabel
                            type="6"
                            ForID="telefono_cliente"
                            placeholder="Teléfono"
                            childLabel="Teléfono"
                            value={cliente.telefono}
                            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                            className="w-full"
                            placeholderError={!!errores.telefono}
                        />
                        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}

                        <InputLabel
                            type="1"
                            ForID="direccion_cliente"
                            placeholder="Dirección"
                            childLabel="Dirección"
                            value={cliente.direccion}
                            onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                            className="w-full"
                        />

                        <div className="flex justify-between gap-2">
                            <button onClick={cancelar} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                                Cancelar
                            </button>
                            <button onClick={actualizar} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                                Actualizar
                            </button>
                        </div>
                    </>
                )}

                {mensaje && (
                    <p className={`text-center font-semibold ${mensaje.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    )
}

export default UpdateClientModal
