export const ValidateUserLogin = async (correo, contrasena) => {
  const loginAttempts = [
    {
      url: 'https://redgas.onrender.com/AdminLogin',
      body: { correo_admin: correo, contraseña_admin: contrasena }
    },
    {
      url: 'https://redgas.onrender.com/ClienteLogin',
      body: { correo_cliente: correo, contraseña_cliente: contrasena }
    },
    {
      url: 'https://redgas.onrender.com/EmpleadoLogin',
      body: { correo_empleado: correo, contraseña_empleado: contrasena }
    }
  ];

  for (const attempt of loginAttempts) {
    try {
      const res = await fetch(attempt.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt.body)
      });

      const data = await res.json();

      if (res.ok && data?.token) {
        return {
          token: data.token,
        };
      }

    } catch (error) {
      console.error(`Error en login ${attempt.url}:`, error);
    }
  }

  // Si ninguno funcionó
  return null;
};
