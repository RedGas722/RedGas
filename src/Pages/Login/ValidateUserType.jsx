export const validateUserType = async (correo) => {
  const endpoints = [
    { url: 'https://redgas.onrender.com/AdminGet', key: 'correo_admin', tipo: 1, ruta: 'AdminLogin' },
    { url: 'https://redgas.onrender.com/ClienteGet', key: 'correo_cliente', tipo: 2, ruta: 'ClienteLogin' },
    { url: 'https://redgas.onrender.com/EmpleadoGet', key: 'correo_empleado', tipo: 3, ruta: 'EmpleadoLogin' }
  ];

  for (const { url, key, tipo, ruta } of endpoints) {
    try {
      const res = await fetch(`${url}?${key}=${encodeURIComponent(correo)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          return { tipo_usuario: tipo, ruta };
        }
      } else if (res.status === 404) {
        // No existe ese usuario, probar siguiente tipo
        continue;
      }
    } catch (err) {
      console.error(`Error consultando ${url}:`, err);
    }
  }

  return null;
};
