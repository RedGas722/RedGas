import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Buttons } from "../../UI/Login_Register/Buttons";
import { InputLabel } from "../../UI/Login_Register/InputLabel/InputLabel";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import './RecoveryPassword.css';

export const RecoveryPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [params] = useSearchParams();
    const [tokenValido, setTokenValido] = useState(false);
    const navigate = useNavigate();

    const tipoUsuario = params.get('tipo');
    const URL_CAMBIO = `https://redgas.onrender.com/${tipoUsuario}ChangePassword`;
    const URL_VALIDAR = 'https://redgas.onrender.com/ValidateTokenRecovery';

    const tokenCliente = params.get('tkc');
    const tokenRecuperacion = params.get('tkr');

    useEffect(() => {
        const validarToken = async () => {
            if (!tokenRecuperacion || !tokenCliente) {
                alertSendForm(502, 'Enlace inválido', 'Los tokens de recuperación no están presentes.');
                return;
            }

            try {
                const res = await fetch(`${URL_VALIDAR}?token=${tokenRecuperacion}`);
                const data = await res.json();

                if (res.ok && data.status === 'valido') {
                    setTokenValido(true);
                } else {
                    alertSendForm(502, 'TOKEN EXPIRADO', 'El enlace ha expirado o no es válido.');
                }
            } catch {
                alertSendForm(502, 'Error de validación', 'No se pudo validar el enlace.');
            }
        };

        validarToken();
    }, [tokenRecuperacion, tokenCliente]);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alertSendForm(401, 'Las contraseñas no coinciden', '');
            return;
        }

        alertSendForm('wait', 'Cambiando contraseña...');

        try {

            const tipoNormalizado = tipoUsuario.toLowerCase();
            const campoContraseña = `contraseña_${tipoNormalizado}`;

            const res = await fetch(URL_CAMBIO, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente}`,
                },
                body: JSON.stringify({ [campoContraseña]: password })
            });

            const data = await res.json();

            if (data.status !== 'Unauthorized') {
                if (data.errors?.length > 0) {
                    const mensaje = data.errors[0].msg;
                    alertSendForm(401, mensaje === 'Invalid value' ? 'La contraseña no cumple con los requisitos de seguridad' : mensaje, '');
                } else {
                    alertSendForm(200, 'Contraseña cambiada con éxito', 'Ahora puedes iniciar sesión con tu nueva contraseña.');
                }
            } else {
                alertSendForm(502, 'TOKEN EXPIRADO', 'El token ha expirado o es inválido.');
            }

        } catch {
            alertSendForm(502, 'Error al cambiar la contraseña', 'Intenta nuevamente más tarde.');
        }
    };

    const handSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('recordarme');
        localStorage.removeItem('lastActivity');
    };

    const alertSendForm = (status, title, message) => {
        const MySwal = withReactContent(Swal);
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('passwordConfirm');

        switch (status) {
            case 'wait':
                Swal.fire({
                    title: title || 'Procesando...',
                    text: message || 'Estamos procesando tu solicitud.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    didOpen: () => Swal.showLoading(),
                });
                break;

            case 200:
                MySwal.fire({
                    icon: 'success',
                    title,
                    text: message,
                    confirmButtonText: 'Volver al login',
                    allowOutsideClick: false
                }).then(() => {
                    handSignOut();
                    navigate('/Login');
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';
                });
                break;

            case 401:
                MySwal.fire({
                    html: `
                        <div style="display: flex; align-items: center;">
                            <div style="font-size: 30px; color: #3498db; margin-right: 15px;">ℹ️</div>
                            <div style="text-align: left;">
                                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                                    ${title}
                                </h3>
                            </div>
                        </div>
                    `,
                    showConfirmButton: false,
                    position: 'top-end',
                    width: '350px',
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#ffffff',
                });
                break;

            case 502:
            default:
                MySwal.fire({
                    icon: 'error',
                    title,
                    text: message,
                    confirmButtonText: 'Cerrar',
                    allowOutsideClick: false
                }).then(() => {
                    navigate('/Login/ForgotPassword');
                });
                break;
        }
    };

    return (
        <section className="w-full h-dvh flex justify-center text-[var(--main-color)] items-center">
            {tokenValido && (
                <div className='z-[2] divForm NeoContainer_outset_TL p-[30px_15px_15px_15px] flex flex-col w-fit items-center justify-self-center gap-[20px]'>
                    <h1 className="text-center text-4xl">¡Recuperación Contraseña!</h1>
                    <form className="flex justify-center items-center flex-col gap-[30px] text-start w-full" onSubmit={handleChangePassword}>
                        <div className="w-full">
                            <InputLabel type='3' ForID='password' childLabel='Nueva contraseña' placeholder='**********' value={password} onChange={e => setPassword(e.target.value)} required />
                            <p className="text-[var(--Font-Nav)] text-x1l">min 8 - max 15 caracteres</p>
                        </div>
                        <div className="w-full">
                            <InputLabel type='3' ForID='passwordConfirm' childLabel='Confirmar contraseña' placeholder='**********' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div>
                            <Buttons Type='submit' nameButton="Enviar" />
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};

export default RecoveryPassword;
