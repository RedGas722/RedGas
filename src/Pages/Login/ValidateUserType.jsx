export const validateUserType = async (correo) => {
  const urls = [
    { url: 'https://redgas.onrender.com/AdminGetAllEmails', key: 'correo_admin', tipo: 1, ruta: 'AdminLogin' },
    { url: 'https://redgas.onrender.com/ClienteGetAllEmails', key: 'correo_cliente', tipo: 2, ruta: 'ClienteLogin' },
    { url: 'https://redgas.onrender.com/EmpleadoGetAllEmails', key: 'correo_empleado', tipo: 3, ruta: 'EmpleadoLogin' },
    { url: 'https://redgas.onrender.com/TecnicoGetAllEmails', key: 'correo_tecnico', tipo: 4, ruta: 'TecnicoLogin' }
  ];

  try {
    const respuestas = await Promise.all(urls.map(({ url }) => fetch(url)));

    for (let i = 0; i < respuestas.length; i++) {
      const res = respuestas[i];
      const { key, tipo, ruta } = urls[i];

      if (!res.ok) continue;

      const data = await res.json();
      const lista = data?.data || [];

      const existe = lista.find(usuario => (usuario[key] || '').toLowerCase() === correo.toLowerCase());

      if (existe) {
        return { tipo_usuario: tipo, ruta };
      }
    }
  } catch (error) {
    console.error("Error en la validación de tipo de usuario:", error);
  }

  return null;
};
