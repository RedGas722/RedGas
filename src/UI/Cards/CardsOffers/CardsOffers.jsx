// import "./CardsOffers.css";
// import { Swiper, SwiperSlide } from "swiper/react"; 
// import { Navigation } from "swiper/modules";
// import "swiper/css";  // Estilos básicos
// import "swiper/css/navigation";  // Estilos específicos para la navegación
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowRight, faArrowLeft, faCartShopping } from '@fortawesome/free-solid-svg-icons';

// export const CardsOffers = ({ uniqueId, imgContent, titleCatt, brandCatt, afterPrice, beforePrice }) => {

//     function dividirConComaCada3Caracteres(cadena) {
//         let resultado = ""
//         for (let i = 0; i < cadena.length; i += 3) {
//             resultado += cadena.substr(i, 3)
//             if (i + 3 < cadena.length) {
//                 resultado += ","
//             }
//         }
//         return resultado
//     }

//     const cards = Array.from({ length: 8 });

//     return (
//         <section id={`CardSect-${uniqueId}`} className="flex flex-col gap-[10px] h-fit w-[100%]">
//             <Swiper
//                 modules={[Navigation]}  // Habilita el módulo de navegación
//                 loop={true}
//                 autoplay={{ delay: 2000 }}
//                 pagination={{ clickable: true }}
//                 navigation={{
//                     prevEl: `.swiper-button-prev-${uniqueId}`,
//                     nextEl: `.swiper-button-next-${uniqueId}`,
//                 }}
//                 breakpoints={{
//                     1390: { slidesPerView: 5, spaceBetween: 0 },
//                     1080: { slidesPerView: 4, spaceBetween: 5 },
//                     852: { slidesPerView: 3, spaceBetween: 5 },
//                     500: { slidesPerView: 2, spaceBetween: 5 },
//                     320: { slidesPerView: 1, spaceBetween: 5 },
//                 }}
//                 id={`cardContainer-${uniqueId}`}
//                 className="w-[100%] flex justify-center justify-self-center h- items-center"
//             >
//                 {cards.map((_, index) => (
//                     <SwiperSlide key={index} id={`CardSect-${uniqueId}`}>
//                         <div className="flex justify-center justify-self-center h-fit p-[25px_0_25px_0] items-center w-fit">
//                             <div className="card NeoSubContainer_outset_TL">
//                                 <div className="card-img">
//                                     <div className="img">
//                                         <img
//                                             src={imgContent}
//                                             alt="producto"
//                                             className="rounded-[20px]"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="flex gap-1 items-end justify-center">
//                                     <div className="card-title">{titleCatt}</div>
//                                     <div className="font-black text-[18px]">{brandCatt}</div>
//                                 </div>
//                                 <div className="card-subtitle max-w-[190px] break-words hyphens-auto">Product description. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
//                                 <hr className="card-divider" />
//                                 <div className="card-footer">
//                                     <div className="card-price">
//                                         <div>
//                                             <span>$</span> {dividirConComaCada3Caracteres((afterPrice || 0).toString())}
//                                         </div>
//                                         <div className="beforePrice text-[15px] text-[var(--main-color-sub)] line-through">
//                                             <span>$</span> {dividirConComaCada3Caracteres((beforePrice || 0).toString())}
//                                         </div>
//                                     </div>
//                                     <button className="card-btn hover:text-[#ffff]">
//                                         <FontAwesomeIcon icon={faCartShopping} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//             <div className="flex flex-col justify-center items-center self-center w-fit p-[10px] NeoSubContainer_outset_TL text-[var(--main-color)]">
//                 <div className="flex justify-center items-center gap-[20px]">
//                     <button className={`buttonTL arrow NeoSubContainer_outset_TL p-[7px] swiper-button-prev-${uniqueId} cursor-pointer`}>
//                         <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
//                     </button>
//                     <button className={`buttonTL arrow NeoSubContainer_outset_TL p-[7px] swiper-button-next-${uniqueId} cursor-pointer`}>
//                         <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CardsOffers;
import "./CardsOffers.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';

    async function agregarAlCarrito(item) {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
        alert("Debes iniciar sesión para agregar al carrito");
        return null;
    }
    const res = await fetch("https://redgas.onrender.com/CartAdd", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify(item), 
    });


    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al agregar al carrito");
    }
    return await res.json();
    }

export const CardsOffers = ({ uniqueId, productos = [] }) => {

  const handleAddToCart = async (producto) => {
    const item = {
    productId: producto.id_producto,
    productName: producto.nombre_producto,  
    quantity: 1,
    price: producto.precio_producto,
    discount: producto.descuento || 0
    };

    try {
      await agregarAlCarrito(item);
      alert(`"${producto.nombre_producto}" fue agregado al carrito`);
    } catch (error) {
      console.error("Error al agregar al carrito", error);
      alert("Ocurrió un error al agregar al carrito");
    }
  };

  return (
    <section id={`CardSect-${uniqueId}`} className="flex flex-col gap-[10px] h-fit w-[100%]">
      <Swiper
        modules={[Navigation]}
        loop={productos.length > 1}
        navigation={{
          prevEl: `.swiper-button-prev-${uniqueId}`,
          nextEl: `.swiper-button-next-${uniqueId}`,
        }}
        breakpoints={{
          1390: { slidesPerView: 5, spaceBetween: 0 },
          1080: { slidesPerView: 4, spaceBetween: 5 },
          852: { slidesPerView: 3, spaceBetween: 5 },
          500: { slidesPerView: 2, spaceBetween: 5 },
          320: { slidesPerView: 1, spaceBetween: 5 },
        }}
        id={`cardContainer-${uniqueId}`}
        className="w-[100%] flex justify-center items-center"
      >
        {productos.map((producto, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center justify-self-center h-fit p-[25px_0_25px_0] items-center w-fit">
              <div className="card NeoSubContainer_outset_TL">
                <div className="card-img">
                  <div className="img h-full">
                    <img
                      src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : "https://via.placeholder.com/150"}
                      alt={producto.nombre_producto || "Producto"}
                      className="rounded-[20px]"
                    />
                  </div>
                </div>
                <div className="flex gap-1 items-end justify-center">
                  <div className="card-title">{producto.nombre_producto}</div>
                </div>
                <div className="card-subtitle">
                  {producto.descripcion_producto || "Sin descripción disponible."}
                </div>
                <hr className="card-divider" />
                <div className="card-footer">
                  <div className="card-price">
                    <span>$</span> {(parseFloat(producto.precio_producto) - (parseFloat(producto.precio_producto)*(producto.descuento/100))).toLocaleString()}
                    <div className="beforePrice text-[15px] text-[var(--main-color-sub)] line-through">
                    <span>$</span> {(parseFloat(producto.precio_producto)).toLocaleString()} {producto.descuento}%
                    </div>
                  </div>
                  <button
                    className="card-btn hover:text-[#ffff]"
                    onClick={() => handleAddToCart(producto)}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col justify-center items-center self-center w-fit p-[10px] NeoSubContainer_outset_TL text-[var(--main-color)]">
        <div className="flex justify-center items-center gap-[20px]">
          <button
            className={`buttonTL arrow-left NeoSubContainer_outset_TL p-[7px] swiper-button-prev-${uniqueId} cursor-pointer`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
          </button>
          <button
            className={`buttonTL arrow-right NeoSubContainer_outset_TL p-[7px] swiper-button-next-${uniqueId} cursor-pointer`}
          >
            <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CardsOffers;
