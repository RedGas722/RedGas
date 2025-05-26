import { useEffect, useState } from "react";
import { Header } from '../../Layouts/Header/Header';

export const Shopping = () => {
  const [products, setProducts] = useState([]); // Productos con info completa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes iniciar sesión para ver el carrito");
        setLoading(false);
        return;
      }

      // 1. Obtener productos del carrito
      const resCart = await fetch("http://localhost:10101/CartGet", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!resCart.ok) {
        throw new Error("Error al obtener el carrito");
      }

      const cartData = await resCart.json(); 
      
      // 2. Obtener info de cada producto por nombre
      const productDetails = await Promise.all(
        cartData.map(async (item) => {
          const res = await fetch(`http://localhost:10101/ProductoGet?nombre_producto=${encodeURIComponent(item.productName)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
      
          if (!res.ok) {
            throw new Error(`Error al obtener el producto: ${item.productName}`);
          }
      
          const data = await res.json();
          const productData = data.data; // porque tu backend responde con { status: "ok", data: {...} }
      
          return {
            ...productData,
            cantidad: item.quantity
          };
        })
      );
      setProducts(productDetails);
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className='Distribution'>
      <Header />
      <div className="flex flex-col gap-[80px] text-[var(--main-color)] MainPageContainer">
        {products.length === 0 && <p>No hay productos para mostrar.</p>}

        {products.map((producto, index) => (
          <section key={index}>
            <section className='flex justify-center gap-[20px]'>
              <section className='NeoContainer_outset_TL flex gap-[20px] p-[20px_10px] w-[70%] h-fit '>
                <div>
                  <img
                    src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : "https://via.placeholder.com/150"}
                    alt={producto.nombre_producto}
                    className='w-[150px] rounded-[20px]'
                  />
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px]'>
                  <div>
                    <h2 className='text-2xl font-bold'>{producto.nombre_producto}</h2>
                  </div>
                  <div>
                    <p className='text-[var(--main-color-sub)]'>{producto.descripcion_producto || "Sin descripción disponible."}</p>
                    <p className='text-[var(--main-color-sub)]'>Cantidad: {producto.cantidad}</p>
                  </div>
                </div>
              </section>
              <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Comprar!!</button>
            </section>
          </section>
        ))}

        <footer>
          <div className='flex justify-center items-center gap-[20px]'>
            <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Comprar todo</button>
            <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Ver carrito</button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Shopping;
