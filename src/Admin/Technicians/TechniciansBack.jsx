import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { DeleteModal } from './Delete/Delete'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardTechniciansBack from './Get/CardTechniciansBack'
import { buscarTecnicoPorCorreo } from './Get/Get'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Buttons } from '../../UI/Login_Register/Buttons'

export const TechniciansBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [tecnicos, setTecnicos] = useState([])
  const [refrescar, setRefrescar] = useState(false)

  async function fetchTecnicos() {
    try {
      const res = await fetch('https://redgas.onrender.com/TecnicoGetAll');
      if (!res.ok) throw new Error('Error al obtener técnicos');
      const data = await res.json();
      const tecnicosData = Array.isArray(data) ? data : (data.data || []);
      setTecnicos(tecnicosData);
    } catch (error) {
      setTecnicos([])
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTecnicos()
  }, [])

  useEffect(() => {
    if (refrescar) {
      fetchTecnicos()
      setRefrescar(false)
    }
  }, [refrescar])

  // Para actualizar un técnico desde la tarjeta
  const handleUpdateClick = (tecnico) => {
    setShowUpdateModal(tecnico);
  };

  // Para eliminar un técnico desde la tarjeta
  const handleDeleteClick = (tecnico) => {
    setShowDeleteModal(tecnico);
  };

  // Para buscar técnicos por correo desde el input
  const [correoBusqueda, setCorreoBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [errorBusqueda, setErrorBusqueda] = useState(false);
  const contenedorRef = useRef(null);
  const inputRef = useRef(null);

  const handleBuscarTecnico = async () => {
    if (!correoBusqueda.trim()) {
      fetchTecnicos(); // Si está vacío, muestra todos
      return;
    }

    try {
      const resultados = await buscarTecnicoPorCorreo(correoBusqueda);
      setTecnicos(resultados);
      setErrorBusqueda(resultados.length === 0); // Si no hay resultados, activa el error
    } catch (error) {
      console.error(error);
      setTecnicos([]);
    }
  };

  // Autocomplete: filtra técnicos por correo
  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([]);
      return;
    }
    const filtrados = tecnicos.filter((tecnico) =>
      tecnico.correo_tecnico && tecnico.correo_tecnico.toLowerCase().includes(correoBusqueda.toLowerCase())
    );
    setSugerencias(filtrados.slice(0, 5));
  }, [correoBusqueda, tecnicos]);

  // Cierre del dropdown si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target)
      ) {
        setSugerencias([]);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  // Limpia técnicos si el input queda vacío
  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      fetchTecnicos();
    }
  }, [correoBusqueda]);

  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To='/Admin' />
      
      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Técnicos</h1>
        
          <div className='NeoContainer_outset_TL flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>
            
            <div ref={contenedorRef}>
              <InputLabel
                radius='10'
                type="1"
                ForID="correo_tecnico_busqueda"
                placeholder="Buscar técnico"
                childLabel="Buscar técnico"
                value={correoBusqueda}
                onChange={e => setCorreoBusqueda(e.target.value)}
                className="w-full"
                placeholderError={!!errorBusqueda}
              />
              {sugerencias.length > 0 && (
                <ul className="absolute z-10 bg-white border w-[230px] border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow">
                  {sugerencias.map((tecnico) => (
                    <li
                      key={tecnico.id_tecnico || tecnico.correo_tecnico}
                      onClick={() => {
                        setCorreoBusqueda(tecnico.correo_tecnico);
                        setSugerencias([]);
                        setTecnicos([tecnico]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {tecnico.correo_tecnico}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex w-fit h-fit flex-wrap justify-center justify-self-center items-center gap-[20px]">
              <Buttons radius='10' nameButton='Registrar' textColor='var(--Font-Nav)' Onclick={() => setShowRegisterModal(true)} />
              {/* Eliminar, Actualizar y Consultar removidos porque ya están en la card y el input de consulta ya existe */}
            </div>
          </div>
          {/* Sección de técnicos */}
          <div className="flex flex-wrap items-center gap-6">
            {tecnicos.map(tecnico => (
              <CardTechniciansBack
                key={tecnico.id_tecnico || tecnico.correo_tecnico}
                tecnico={tecnico}
                setRefrescar={setRefrescar}
                onUpdateClick={handleUpdateClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
          {/* Modales */}
          {showRegisterModal && (
            <RegisterModal
              onClose={() => setShowRegisterModal(false)}
              setRefrescar={setRefrescar}
            />
          )}
          {typeof showUpdateModal === 'object' && showUpdateModal && (
            <UpdateModal
              onClose={() => setShowUpdateModal(false)}
              setRefrescar={setRefrescar}
              tecnicoCarta={showUpdateModal}
            />
          )}
          {typeof showDeleteModal === 'object' && showDeleteModal && (
            <DeleteModal
              onClose={() => setShowDeleteModal(false)}
              setRefrescar={setRefrescar}
              tecnicoCarta={showDeleteModal}
            />
          )}
      </div>
    </section>
  )
}

export default TechniciansBack
