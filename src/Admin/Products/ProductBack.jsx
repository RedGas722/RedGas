import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardsProductsBack from './Get/CardProductsBack';

export const ProductBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchProductos() {
    try {
      const res = await fetch('http://localhost:10101/ProductoGetAll');
      if (!res.ok) throw new Error('Error al obtener productos y categorías');
      const data = await res.json();
      // data.data es un objeto con { productos, categorias }
      setProductos(data.data.productos || []);
      setCategorias(data.data.categorias || []);

    } catch (error) {
      console.error(error);
    }
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <CardsProductsBack key={producto.id_producto} producto={producto} />
        ))}
      </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onProductoRegistrado={(nuevoProducto) => {
            setProductos(prev => [nuevoProducto, ...prev]);
          }}
          setRefrescar={setRefrescar}
        />
      )}
      {showGetModal && <GetModal onClose={() => setShowGetModal(false)} />}
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


export default ProductBack;
