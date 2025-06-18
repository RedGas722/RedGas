export function startTokenRefresher(remember = false) {
    // 10 minutos -> 600000 ms
    const intervalTime = 600000;
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn('No se encontró token para renovar');
        clearInterval(interval);
        localStorage.removeItem('tipo_usuario');
        return;
    }


    const interval = setInterval(async () => {

        if (remember === false) {
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
        } else if (remember === true) {
            try {
                const response = await fetch('https://redgas.onrender.com/renewToken', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error al renovar token:', error);
            }
        }
    }, intervalTime);

    return interval;
}