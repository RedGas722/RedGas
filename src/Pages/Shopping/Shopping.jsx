import { Header } from '../../Layouts/Header/Header'
import { products } from './Shopping'

export const Shopping = () => {
    return (
        <section className='Distribution'>
            <Header />
            <div className="flex flex-col gap-[80px] text-[var(--main-color)] MainPageContainer">
                {products.map((products, index) => (
                    <section key={index}>
                        <section className='flex justify-center gap-[20px]'>
                            <section className='NeoContainer_outset_TL flex gap-[20px] p-[20px_10px] w-[70%] h-fit '>
                                <div>
                                    <img src={products.Image} alt={products.Title1} className='w-[150px] rounded-[20px]' />
                                </div>
                                <div className='flex flex-col justify-center items-start gap-[10px]'>
                                    <div>
                                        <h2 className='text-2xl font-bold'>{products.Title1}</h2>
                                    </div>
                                    <div>
                                        <p className='text-[var(--main-color-sub)]'>{products.Description}</p>
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
    )
}
export default Shopping

// import { useEffect, useState } from "react";
// import { Header } from '../../Layouts/Header/Header';

// export const Shopping = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Función para obtener productos del backend
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("http://localhost:10101/ProductoGetFromRedis");
//       if (!res.ok) {
//         throw new Error("Error al cargar productos");
//       }
//       const data = await res.json();
//       setProducts(data);
//     } catch (err) {
//       setError(err.message || "Error desconocido");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (loading) return <p>Cargando productos...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <section className='Distribution'>
//       <Header />
//       <div className="flex flex-col gap-[80px] text-[var(--main-color)] MainPageContainer">
//         {products.length === 0 && <p>No hay productos para mostrar.</p>}

//         {products.map((producto, index) => (
//           <section key={index}>
//             <section className='flex justify-center gap-[20px]'>
//               <section className='NeoContainer_outset_TL flex gap-[20px] p-[20px_10px] w-[70%] h-fit '>
//                 <div>
//                   <img
//                     src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : "https://via.placeholder.com/150"}
//                     alt={producto.nombre_producto}
//                     className='w-[150px] rounded-[20px]'
//                   />
//                 </div>
//                 <div className='flex flex-col justify-center items-start gap-[10px]'>
//                   <div>
//                     <h2 className='text-2xl font-bold'>{producto.nombre_producto}</h2>
//                   </div>
//                   <div>
//                     <p className='text-[var(--main-color-sub)]'>{producto.descripcion_producto || "Sin descripción disponible."}</p>
//                   </div>
//                 </div>
//               </section>
//               <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Comprar!!</button>
//             </section>
//           </section>
//         ))}

//         <footer>
//           <div className='flex justify-center items-center gap-[20px]'>
//             <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Comprar todo</button>
//             <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Ver carrito</button>
//           </div>
//         </footer>
//       </div>
//     </section>
//   );
// };

// export default Shopping;
