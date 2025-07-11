import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import BtnBack from "../../UI/Login_Register/BtnBack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faIdCard, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
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

  return (
    <div>
      <div className="z-[2] flex p-[5px] flex-col text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
        <BtnBack To='/' />
        <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Mi perfil</h2>
      </div>

      <section className="h-fit z-[2] flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] MainPageContainer">
        <div className="flex flex-col z-[2] flex-wrap items-center justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 gap-6">

          <div className="text-[var(--main-color-sub)] pl-2 gap-3 justify-center flex-wrap flex items-center font-bold w-fit">
            {tecnico.imagen && (
              <div className="flex justify-center mt-4">
                <img
                  src={`data:image/jpeg;base64,${tecnico.imagen}`}
                  alt="Foto del técnico"
                  className="w-30 h-30 object-cover rounded-full "
                />
              </div>
            )}
            <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
              <p className="text-xl font-bold text-[var(--main-color)]">{tecnico.nombre_tecnico}</p>
              <p className="text-[1rem] flex items-center gap-2"><FontAwesomeIcon icon={faIdCard} className="text-[var(--main-color)]" /> CC: {tecnico.cc_tecnico}</p>
              <p className="text-[1rem] flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope} className="text-[var(--main-color)]" /> {tecnico.correo_tecnico}</p>
              <p className="text-[1rem] flex items-center gap-2"><FontAwesomeIcon icon={faPhone} className="text-[var(--main-color)]" /> {tecnico.telefono_tecnico}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileTechnician;
