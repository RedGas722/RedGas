import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import BtnBack from "../../UI/Login_Register/BtnBack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
import Buttons from "../../UI/Login_Register/Buttons";
import { useNavigate } from "react-router-dom";

const ProfileTechnician = () => {
  const [tecnico, setTecnico] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
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

  const handleCambiarContrasena = () => {
    navigate('/Login/ForgotPassword')
  }

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
