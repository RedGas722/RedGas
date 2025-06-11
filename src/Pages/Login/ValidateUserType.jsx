export const validateUserType = async (correo) => {
    const urls = [
        { url: 'https://redgas.onrender.com/AdminGet', key: 'correo_admin', tipo: 1, ruta: 'AdminLogin' },
        { url: 'https://redgas.onrender.com/EmpleadoGet', key: 'correo_empleado', tipo: 3, ruta: 'EmpleadoLogin' },
        { url: 'https://redgas.onrender.com/ClienteGet', key: 'correo_cliente', tipo: 2, ruta: 'ClienteLogin' }
    ];

    for (const { url, key, tipo, ruta } of urls) {
        try {
            const res = await fetch(`${url}?${key}=${encodeURIComponent(correo)}`);

            // Manejo si el servidor devuelve error (como 404)
            if (!res.ok) continue;

            const data = await res.json();

            // Verifica que la respuesta contenga datos reales
            if ((data?.status === 'get ok' || data?.status === 'success') &&
                (
                    (Array.isArray(data.data) && data.data.length > 0) || 
                    (typeof data.data === 'object' && Object.keys(data.data).length > 0)
                )
            ) {
                return { tipo_usuario: tipo, ruta };
            }

        } catch (err) {
            console.error(`Error consultando ${url}:`, err);
        }
    }

    return null;
};
