export const ValidateUserLogin = async (correo, contrasena) => {
  const loginAttempts = [
    {
      url: 'https://redgas.onrender.com/AdminLogin',
      body: { correo_admin: correo, contraseña_admin: contrasena },
      tipo: 1
    },
    {
      url: 'https://redgas.onrender.com/ClienteLogin',
      body: { correo_cliente: correo, contraseña_cliente: contrasena },
      tipo: 2
    },
    {
      url: 'https://redgas.onrender.com/EmpleadoLogin',
      body: { correo_empleado: correo, contraseña_empleado: contrasena },
      tipo: 3
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
          tipo_usuario: attempt.tipo
        };
      }

    } catch (error) {
      console.error(`Error en login ${attempt.url}:`, error);
    }
  }

  // Si ninguno funcionó
  return null;
};
