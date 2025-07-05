import { useEffect, useState } from 'react';
import ProfileClient from './ProfileClient'; // el cliente
import ProfileTechnician from './ProfileTechnician'; // técnico

const ProfileGeneral = () => {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const tipo = localStorage.getItem("tipo_usuario");
    setTipoUsuario(tipo);
  }, []);

  if (tipoUsuario === "2") return <ProfileClient />;
  if (tipoUsuario === "4") return <ProfileTechnician />;
  return <p className="text-center mt-10 text-xl">Tipo de usuario no reconocido</p>;
};

export default ProfileGeneral;
