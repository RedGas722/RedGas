import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

async function agregarAlCarrito(item) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Se comprobará en handleAddToCart
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

export const Cards = ({ uniqueId, productos = [] }) => {

  const navigate = useNavigate();

  const handleAddToCart = async (producto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'No estás logueado',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
        showCancelButton: true,
        confirmButtonText: 'Ir al login',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Login");
        }
      });
      return;
    }

    const item = {
      productId: producto.id_producto,
      productName: producto.nombre_producto,
      quantity: 1,
      price: producto.precio_producto,
      discount: producto.descuento || 0
    };

    try {
      await agregarAlCarrito(item);
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `"${producto.nombre_producto}" fue agregado al carrito`
      });
    } catch (error) {
      console.error("Error al agregar al carrito", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Ocurrió un error al agregar al carrito"
      });
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
        className="w-[100%] flex justify-center items-center p-[0_20px_0_20px] "
      >
        {productos.map((producto, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center justify-self-center h-fit p-[25px_0_25px_0] items-center w-fit">
              <div className="card NeoSubContainer_outset_TL">
                <div className="card-img" onClick={() => navigate('/ProductInfo')}>
                  <div className="img">
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
                    <p><span className="text-[var(--Font-Nav-shadow)]">$</span> {(parseFloat(producto.precio_producto) || 0).toLocaleString()} <span className="text-[var(--main-color-sub)] text-[12px]">Cop</span> </p>
                  </div>
                  <button
                    className="card-btn"
                    onClick={() => handleAddToCart(producto)}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                </div>
              <button>dsadasd</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col justify-center items-center self-center w-fit p-[10px] NeoSubContainer_outset_TL text-[var(--main-color)]">
        <div className="flex justify-center items-center gap-[20px]">
          <button
            className={`buttonTL arrow NeoSubContainer_outset_TL p-[7px] swiper-button-prev-${uniqueId} cursor-pointer`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
          </button>
          <button
            className={`buttonTL arrow NeoSubContainer_outset_TL p-[7px] swiper-button-next-${uniqueId} cursor-pointer`}
          >
            <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cards;
