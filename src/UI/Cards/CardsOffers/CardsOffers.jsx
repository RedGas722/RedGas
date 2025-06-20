import "./CardsOffers.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCartShopping, faTags } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { Buttons } from "../../Login_Register/Buttons";
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


async function agregarAlCarrito(item) {
  const token = localStorage.getItem("token");
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleOpen = (producto) => {
    setSelectedProduct(producto);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = async (producto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'No estás logueado',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
        showCancelButton: true,
        confirmButtonText: 'Ir al login',
        cancelButtonText: 'Cancelar'
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
        className="w-[100%] flex justify-center items-center"
      >
        {productos.map((producto, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center justify-self-center h-fit p-[25px_0_25px_0] items-center w-fit">
              <div className="card relative NeoSubContainer_outset_TL !rounded-[25px]">
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
                    <p className="text-[var(--Font-Nav2)]"><span className="text-[var(--Font-Nav2-shadow)]">$</span>{(parseFloat(producto.precio_producto) - (parseFloat(producto.precio_producto) * (producto.descuento / 100))).toLocaleString()} <span className="text-[var(--main-color-sub)] text-[12px]">Cop</span> </p>
                    <div className="text-[15px] text-[var(--Font-Nav)] ">
                      <p className="text-[var(--Font-Nav-shadow)]">$ <span className="line-through decoration-[1.5px] decoration-[var(--Font-Nav2)]">{(parseFloat(producto.precio_producto)).toLocaleString()}</span></p>
                    </div>
                  </div>
                  <button
                    className="card-btn_Offer"
                    onClick={() => handleAddToCart(producto)}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                </div>
                <div className="absolute top-0 -right-1">
                  <div className="relative flex items-center text-[var(--main-color)]">
                    <FontAwesomeIcon icon={faTags} className="text-6xl text rotate-90" />
                    <p className="text-[18px] flex text-[var(--Font-Nav)] absolute left-4 top-4 font-bold">{producto.descuento} <span className="text-[12px]">%</span> </p>
                  </div>
                </div>
                <Buttons radius='7' nameButton='Ver más...' Onclick={() => handleOpen(producto)} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* inicio */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        disableScrollLock={true}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            zIndex: '1000',
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
          }}
        >
          {selectedProduct && (
            <div className="card relative !rounded-[25px]">
              <div className="card-img">
                <div className="img h-full">
                  <img
                    src={selectedProduct.imagen ? `data:image/jpeg;base64,${selectedProduct.imagen}` : "https://via.placeholder.com/150"}
                    alt={selectedProduct.nombre_producto || "Producto"}
                    className="rounded-[20px]"
                  />
                </div>
              </div>
              <div className="flex gap-1 items-end justify-center">
                <div className="card-title">{selectedProduct.nombre_producto}</div>
              </div>
              <div className="card-subtitle">
                {selectedProduct.descripcion_producto || "Sin descripción disponible."}
              </div>
              <hr className="card-divider" />
              <div className="card-footer">
                <div className="card-price">
                  <p className="text-[var(--Font-Nav2)]"><span className="text-[var(--Font-Nav2-shadow)]">$</span>{(parseFloat(selectedProduct.precio_producto) - (parseFloat(selectedProduct.precio_producto) * (selectedProduct.descuento / 100))).toLocaleString()} <span className="text-[var(--main-color-sub)] text-[12px]">Cop</span> </p>
                  <div className="text-[15px] text-[var(--Font-Nav)] ">
                    <p className="text-[var(--Font-Nav-shadow)]">$ <span className="line-through decoration-[1.5px] decoration-[var(--Font-Nav2)]">{(parseFloat(selectedProduct.precio_producto)).toLocaleString()}</span></p>
                  </div>
                </div>
                <button
                  className="card-btn_Offer"
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>
              </div>
              <div className="absolute top-0 -right-1">
                <div className="relative flex items-center text-[var(--main-color)]">
                  <FontAwesomeIcon icon={faTags} className="text-6xl text rotate-90" />
                  <p className="text-[18px] flex text-[var(--Font-Nav)] absolute left-4 top-4 font-bold">{selectedProduct.descuento} <span className="text-[12px]">%</span> </p>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>
      {/* fin */}
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
