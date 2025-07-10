import Swal from 'sweetalert2';

export function startTokenRefresher() {
    const intervalTime = 840000; // 14 minutos
    const maxInactivityTime = 840000; // 14 minutos

    const recordarme = localStorage.getItem('recordarme') === 'true';

    let interval; 

    if (!recordarme) {
        const updateLastActivity = () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        };

        ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
            window.addEventListener(event, updateLastActivity);
        });

        updateLastActivity();
    }

    const renovarToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No hay token, deteniendo el refresco');
        }

        if (!recordarme) {
            const lastActivity = parseInt(localStorage.getItem('lastActivity'), 10) || 0;
            const now = Date.now();
            const isInactiveTooLong = (now - lastActivity) > maxInactivityTime;

            if (isInactiveTooLong) {
                console.log('Sesión expirada por inactividad');
                handleSessionExpired("Tu sesión ha expirado por inactividad. Serás redirigido a la página principal.");
                return;
            }
        }

        fetch('https://redgas.onrender.com/renewToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recordarme })
        })
        .then(res => {
            if (res.ok) return res.json();
            else throw new Error("Token no válida");
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            console.log('✅ Token renovada');
        })
        .catch(err => {
            console.error('Error al renovar token:', err);
            handleSessionExpired("Ocurrió un problema al renovar tu sesión. Serás redirigido a la página principal.");
        });
    };

    if (recordarme) {
        renovarToken();
    } else {
        interval = setInterval(renovarToken, intervalTime);
    }

    const handleSessionExpired = (message) => {
        if (interval) clearInterval(interval);
        localStorage.removeItem('token');
        localStorage.removeItem('lastActivity');

        Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
            backdrop: true
        }).then(() => {
            window.location.href = "/login";
        });
    };

    return interval;
}
