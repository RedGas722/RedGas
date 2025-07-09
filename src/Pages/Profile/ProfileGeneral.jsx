import { useEffect, useState } from 'react';
import ProfileClient from './ProfileClient'; // el cliente
import ProfileTechnician from './ProfileTechnician'; // técnico
import { jwtDecode } from 'jwt-decode';

const ProfileGeneral = () => {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const tipo = decoded?.data?.tipo_usuario;
    setTipoUsuario(tipo);
  }, []);

  if (tipoUsuario === 2) return <ProfileClient />;
  if (tipoUsuario === 4) return <ProfileTechnician />;
  return <p className="text-center mt-10 text-xl">Tipo de usuario no reconocido</p>;
};

export default ProfileGeneral;
