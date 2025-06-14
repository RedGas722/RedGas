export function startTokenRefresher() {
    // 10 minutos -> 600000 ms
    const intervalTime = 600000;

    const interval = setInterval(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn('No se encontró token para renovar');
            clearInterval(interval);
            localStorage.removeItem('tipo_usuario');
            return;
        }

        try {
            const response = await fetch('https://redgas.onrender.com/renewToken', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                console.log('✅ Token renovado exitosamente');
            } else {
                console.warn('No se pudo renovar el token, cerrando sesión');
                clearInterval(interval);
                localStorage.removeItem('token');
                localStorage.removeItem('tipo_usuario');
            }
        } catch (error) {
            console.error('Error al renovar token:', error);
            clearInterval(interval);
            localStorage.removeItem('token');
            localStorage.removeItem('tipo_usuario');
        }
    }, intervalTime);

    return interval; // Retorna el id del intervalo (por si quieres limpiarlo después)
}
