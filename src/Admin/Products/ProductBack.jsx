<<<<<<< HEAD
// Delete.jsx
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
<<<<<<< HEAD

=======
import CardsProductsBack from './Get/CardProductsBack';
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18

export const ProductBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
<<<<<<< HEAD


  return (
    <div className="p-[20px_0_0_20px] flex items-start gap-[20px] justify-start h-screen">
      <div className='flex items-center gap-[20px] justify-center'>
        <h1 className='font-bold text-[20px]'>Producto BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child='Registrar' />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child='Consultar' />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child='Actualizar' />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child='Eliminar' />
      </div>
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}

      {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} />
      )}

      {showUpdateModal && (
        <UpdateModal onClose={() => setShowUpdateModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
};
export default ProductBack
=======
  const [productos, setProductos] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchProductos() {
      try {
        const res = await fetch('http://localhost:10101/ProductoGetAll');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProductos(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }
    //useEffect para la carga inicial
    useEffect(() => {
      fetchProductos();
    }, []); 

    useEffect(() => {
    if (refrescar) {
      fetchProductos(); 
      setRefrescar(false); 
    }
  }, [refrescar]);


  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Producto BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
      </div>

      {/* Sección de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <CardsProductsBack key={producto.id_producto} producto={producto} />
      ))}
      </div>

      {/* Modales */}
      {showRegisterModal && (
      <RegisterModal
      onClose={() => setShowRegisterModal(false)}
      onProductoRegistrado={(nuevoProducto) => {
        setProductos(prev => [nuevoProducto, ...prev]);
      }}
      setRefrescar={setRefrescar}  // 👈 nuevo prop
      />
    )}
      {showGetModal && <GetModal onClose={() => setShowGetModal(false)} />}
      {showUpdateModal && 
      <UpdateModal 
      onClose={() => setShowUpdateModal(false)} 
      setRefrescar={setRefrescar}
      />}
      {showDeleteModal && 
      <DeleteModal 
      onClose={() => setShowDeleteModal(false)} 
      setRefrescar={setRefrescar}
      />}
    </div>
  );
};

export default ProductBack;
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
