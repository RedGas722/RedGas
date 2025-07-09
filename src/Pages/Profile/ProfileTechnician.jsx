import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import BtnBack from "../../UI/Login_Register/BtnBack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
import Buttons from "../../UI/Login_Register/Buttons";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';

const ProfileTechnician = () => {
  const [tecnico, setTecnico] = useState(null);
  const navigate = useNavigate()
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const correo = decoded.data.email;

      fetch(`https://redgas.onrender.com/TecnicoGet?correo_tecnico=${encodeURIComponent(correo)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.data) {
            const tecnicoInfo = data.data;
            if (tecnicoInfo.imagen && typeof tecnicoInfo.imagen === 'object') {
              tecnicoInfo.imagen = tecnicoInfo.imagen.toString('base64');
            }
            setTecnico(tecnicoInfo);
          }
        })
        .catch(err => console.error("Error al obtener técnico:", err));
    }
  }, []);

  if (!tecnico) return <p className="text-center mt-10">Cargando datos del técnico...</p>;

  const handleCambiarContrasena = async () => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const { email } = decoded.data;

    const { value: passwordInput } = await Swal.fire({
      title: 'Verificación de identidad',
      input: 'password',
      inputLabel: 'Ingresa tu contraseña actual',
      inputPlaceholder: '********',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes escribir tu contraseña actual';
      }
    });

    if (!passwordInput) return;

    try {
      // 1. Obtener la contraseña hasheada del técnico
      const res = await fetch(`https://redgas.onrender.com/TecnicoGet?correo_tecnico=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!data?.data?.contraseña_tecnico) {
        Swal.fire('Error', 'No se pudo obtener la contraseña del servidor.', 'error');
        return;
      }

      const contraseñaOriginal = data.data.contraseña_tecnico;

      // 2. Comparar con bcrypt
      const isMatch = await bcrypt.compare(passwordInput, contraseñaOriginal);
      if (!isMatch) {
        Swal.fire('Error', 'La contraseña no coincide.', 'error');
        return;
      }

      // 3. Generar token de recuperación
      const resRecovery = await fetch('https://redgas.onrender.com/GenerateTokenRecovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: email
        })
      });

      const recoveryData = await resRecovery.json();
      const tokenRecuperacion = recoveryData.token;

      if (!tokenRecuperacion) {
        Swal.fire('Error', 'No se pudo generar el token de recuperación.', 'error');
        return;
      }

      // 4. Redirigir a la página de recuperación con tokens
      navigate(`/Login/ForgotPassword/Recovery?tkc=${token}&tkr=${tokenRecuperacion}&tipo=Tecnico`);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Algo salió mal, intenta de nuevo.', 'error');
    }
  };

  return (
    <div>
      <div className="flex z-[2] p-[0_5px] items-center justify-between ">
        <div className="btnDown">
          <BtnBack To='/' />
        </div>
        <div>
          <h2 className=" font-bold text-4xl text-[var(--Font-Nav)]">MI PERFIL</h2>
        </div>
      </div>

      <section className="h-fit z-[2] flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
        <div className="flex flex-col z-[2] flex-wrap justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 gap-6">

          <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
            <FontAwesomeIcon icon={faUserGear} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
              <p className="text-xl font-bold text-[var(--main-color)]">{tecnico.nombre_tecnico}</p>
              <p className="text-[1rem]">🆔 CC: {tecnico.cc_tecnico}</p>
              <p className="text-[1rem]">📧 {tecnico.correo_tecnico}</p>
              <p className="text-[1rem]">📞 {tecnico.telefono_tecnico}</p>
            </div>
            <Buttons
              type="button"
              nameButton="Cambiar Contraseña"
              Onclick={handleCambiarContrasena}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
            />
          </div>

          {tecnico.imagen && (
            <div className="flex justify-center mt-4">
              <img
                src={`data:image/jpeg;base64,${tecnico.imagen}`}
                alt="Foto del técnico"
                className="w-40 h-40 object-cover rounded-full border-4 border-[var(--main-color)]"
              />
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default ProfileTechnician;
