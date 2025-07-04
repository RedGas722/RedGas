import "./CardsOffers.css";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCartShopping, faTags } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ExpandMore } from "../ExpandMore/ExpandMore";
import Swal from "sweetalert2";
import { Buttons } from "../../Login_Register/Buttons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useEmblaCarousel from "embla-carousel-react";

async function agregarAlCarrito(item) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("https://redgas.onrender.com/CartAdd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) throw new Error((await res.json()).message || "Error al agregar al carrito");
  return await res.json();
}

export const CardsOffers = ({ uniqueId, productos = [] }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showArrows, setShowArrows] = useState(false);
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      320: { slidesToScroll: 1 },
      500: { slidesToScroll: 1 },
      852: { slidesToScroll: 1 },
      1080: { slidesToScroll: 1 },
      1390: { slidesToScroll: 1 },
    },
  });

  useEffect(() => {
    if (!embla) return;

    const checkScroll = () => {
      const canScroll = embla.slideNodes().length > embla.slidesInView().length;
      setShowArrows(canScroll);
    };

    embla.on("select", checkScroll);
    embla.on("resize", checkScroll);
    checkScroll();
  }, [embla]);

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
        icon: "warning",
        title: "No estás logueado",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        showCancelButton: true,
        confirmButtonText: "Ir al login",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) navigate("/Login");
      });
      return;
    }

    try {
      // Obtener el carrito actual del usuario
      const resCart = await fetch("https://redgas.onrender.com/CartGet", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!resCart.ok) throw new Error("Error al obtener el carrito");

      const cartData = await resCart.json();

      // Verificar si el producto ya está en el carrito
      const existente = cartData.find(p => p.productId === producto.id_producto);
      const cantidadExistente = existente ? existente.quantity : 0;
      const nuevaCantidad = cantidadExistente + 1;

      if (nuevaCantidad > producto.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: `Solo hay ${producto.stock} unidades disponibles de "${producto.nombre_producto}".`
        });
        return;
      }

      // Agregar al carrito
      const item = {
        productId: producto.id_producto,
        productName: producto.nombre_producto,
        quantity: 1,
        price: producto.precio_producto,
        discount: producto.descuento || 0
      };

      await agregarAlCarrito(item);
      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `"${producto.nombre_producto}" fue agregado al carrito`,
      });

    } catch (error) {
      console.error("Error al agregar al carrito", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al agregar al carrito",
      });
    }
  };

  return (
    <section id={`CardSect-${uniqueId}`} className="flex flex-col items-center justify-center gap-[10px] h-fit w-full">
      <div className="embla w-full" ref={emblaRef}>
        <div className="embla__container flex">
          {productos.map((producto, index) => (
            <div className="embla__slide flex justify-center p-[25px_10px]" key={index}>
              <div className="card relative NeoSubContainer_outset_TL max-w-[360px]">
                <div className="card-img cursor-pointer" onClick={() => navigate("/ProductInfo")}>
                  <div className="img">
                    <img
                      src={
                        producto.imagen
                          ? `data:image/jpeg;base64,${producto.imagen}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={producto.nombre_producto || "Producto"}
                      className="rounded-[20px]"
                    />
                  </div>
                </div>
                <div className="flex gap-1 items-end justify-center">
                  <div className="card-title">{producto.nombre_producto}</div>
                </div>
                <ExpandMore text={producto.descripcion_producto} />
                <div className="w-full h-[2px] bg-[var(--main-color-sub)] rounded-2xl"></div>
                <div className="card-footer">
                  <div className="card-price">
                    <p className="text-[var(--Font-Nav2)]">
                      <span className="text-[var(--Font-Nav2-shadow)]">$</span>{" "}
                      {(parseFloat(producto.precio_producto) * (1 - producto.descuento / 100)).toLocaleString()}{" "}
                      <span className="text-[var(--main-color)] text-[12px]">Cop</span>
                    </p>
                    <p className="text-[14px] text-[var(--Font-Nav-shadow)] line-through">
                      $ {(parseFloat(producto.precio_producto) || 0).toLocaleString()}
                    </p>
                  </div>
                  <button className="card-btn_Offer" onClick={() => handleAddToCart(producto)}>
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                </div>
                {producto.descuento > 0 && (
                  <div className="absolute top-0 -right-1">
                    <div className="relative flex items-center text-[var(--main-color)]">
                      <FontAwesomeIcon icon={faTags} className="text-6xl rotate-90" />
                      <p className="text-[18px] flex text-[var(--Font-Nav)] absolute left-4 top-4 font-bold">
                        {producto.descuento} <span className="text-[12px]">%</span>
                      </p>
                    </div>
                  </div>
                )}
                <Buttons textColor='var(--Font-Nav2)' radius="7" height="auto" nameButton="Ver más..." Onclick={() => handleOpen(producto)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center self-center w-fit p-[10px] NeoSubContainer_outset_TL text-[var(--main-color)]">
        {showArrows && (
          <div className="flex justify-center items-center gap-[20px]">
            <button
              className="buttonTL arrow NeoSubContainer_outset_TL p-[7px]"
              onClick={() => embla && embla.scrollPrev()}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
            </button>
            <button
              className="buttonTL arrow NeoSubContainer_outset_TL p-[7px]"
              onClick={() => embla && embla.scrollNext()}
            >
              <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
            </button>
          </div>
        )}
      </div>

      <Modal open={open} onClose={handleClose} disableScrollLock>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            zIndex: 1000,
            border: "2px solid #19A9A4",
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "transparent",
              border: "none",
              fontSize: 24,
              color: "#19A9A4",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="Cerrar"
          >
            &times;
          </button>
          {selectedProduct && (
            <div className="card relative !rounded-[25px]">
              <div className="card-img">
                <div className="img h-full">
                  <img
                    src={
                      selectedProduct.imagen
                        ? `data:image/jpeg;base64,${selectedProduct.imagen}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={selectedProduct.nombre_producto || "Producto"}
                    className="rounded-[20px]"
                  />
                </div>
              </div>
              <div className="flex gap-1 items-end justify-center">
                <div className="card-title">{selectedProduct.nombre_producto}</div>
              </div>
              <div className="card-subtitle">{selectedProduct.descripcion_producto || "Sin descripción disponible."}</div>
              <hr className="card-divider" />
              <div className="card-footer">
                <div className="card-price">
                  <p>
                    <span className="text-[var(--Font-Nav-shadow)]">$</span>{" "}
                    {(parseFloat(selectedProduct.precio_producto) * (1 - selectedProduct.descuento / 100)).toLocaleString()}{" "}
                    <span className="text-[var(--main-color-sub)] text-[12px]">Cop</span>
                  </p>
                </div>
                <button className="card-btn" onClick={() => handleAddToCart(selectedProduct)}>
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </section>
  );
};

export default CardsOffers;
