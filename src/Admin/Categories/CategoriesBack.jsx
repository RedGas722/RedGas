import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardCategoriesBack from './Get/CardCategoriesBack';

export const CategoriesBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchCategorias() {
    try {
      const res = await fetch('https://redgas.onrender.com/CategoriaGetAll');
      if (!res.ok) throw new Error('Error al obtener categorías');
      const data = await res.json();
      setCategorias(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchCategorias();
      setRefrescar(false);
    }
  }, [refrescar]);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Categoría BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
      </div>

      {/* Sección de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categorias.map(categoria => (
          <CardCategoriesBack key={categoria.id_categoria} categoria={categoria} />
        ))}
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onCategoriaRegistrada={(nuevaCategoria) => {
            setCategorias(prev => [nuevaCategoria, ...prev]);
          }}
          setRefrescar={setRefrescar}
        />
      )}

      {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} />
      )}

      {showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          setRefrescar={setRefrescar}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          setRefrescar={setRefrescar}
        />
      )}
    </div>
  );
};

export default CategoriesBack;
