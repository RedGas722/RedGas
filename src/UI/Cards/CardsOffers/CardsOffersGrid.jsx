import "./CardsOffers.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTags } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "./CardsOffers.css";
import Buttons from "../../Login_Register/Buttons";
import { useState } from "react";
import { Box, Modal } from "@mui/material";

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

export const CardsOffersGrid = ({ productos = [] }) => {
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

      // Verificar si ya hay unidades del producto en el carrito
      const existente = cartData.find(p => p.productId === producto.id_producto);
      const cantidadActual = existente ? existente.quantity : 0;
      const cantidadDeseada = cantidadActual + 1;

      if (cantidadDeseada > producto.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: `Solo hay ${producto.stock} unidades disponibles de "${producto.nombre_producto}".`
        });
        return;
      }

      // Preparar item para agregar
      const item = {
        productId: producto.id_producto,
        productName: producto.nombre_producto,
        quantity: 1,
        price: redondearAMultiploDe50(producto.precio_producto),
        discount: producto.descuento || 0
      };

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

  const redondearAMultiploDe50 = (valor) => {
    return Math.round(valor / 50) * 50;
  };

  return (
    <section id="CardSect" className="flex flex-wrap items-center justify-center gap-[10px] w-full">
      {productos.map((producto, index) => (
        <div key={index} className="flex justify-center items-center p-[25px_0] w-fit">
          <div className="card relative NeoSubContainer_outset_TL max-w-[360px]">
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
                <p className="text-[var(--Font-Nav2)]">
                  <span className="text-[var(--Font-Nav2-shadow)]">$</span>
                  {redondearAMultiploDe50(parseFloat(producto.precio_producto) - (parseFloat(producto.precio_producto) * (producto.descuento / 100))).toLocaleString()}
                  <span className="text-[var(--main-color-sub)] text-[12px]"> Cop</span>
                </p>
                <div className="text-[15px] text-[var(--Font-Nav)]">
                  <p className="text-[var(--Font-Nav-shadow)]">
                    $ <span className="line-through decoration-[1.5px] decoration-[var(--Font-Nav2)]">
                      {redondearAMultiploDe50(parseFloat(producto.precio_producto)).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
              <button className="card-btn_Offer" onClick={() => handleAddToCart(producto)}>
                <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>

            {/* Etiqueta de descuento */}
            <div className="absolute top-0 -right-1">
              <div className="relative flex items-center text-[var(--main-color)]">
                <FontAwesomeIcon icon={faTags} className="text-6xl text rotate-90" />
                <p className="text-[18px] flex text-[var(--Font-Nav)] absolute left-4 top-4 font-bold">
                  {producto.descuento} <span className="text-[12px]">%</span>
                </p>
              </div>
            </div>
            <Buttons
              textColor="var(--Font-Nav2)"
              radius="7"
              height="auto"
              nameButton="Ver más..."
              Onclick={() => handleOpen(producto)}
            />
          </div>
        </div>
      ))}
      <Modal open={open} onClose={handleClose} disableScrollLock>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            zIndex: '1000',
            border: '2px solid #19A9A4',
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              <div className="flex gap-1 text-[var(--main-color)] items-start justify-start">
                <p>Stock:</p>
                <span>{selectedProduct.stock}</span>
              </div>
              <hr className="card-divider" />
              <div className="card-footer">
                <div className="card-price">
                  <p>
                    <span className="text-[var(--Font-Nav-shadow)]">$</span>{" "}
                    {redondearAMultiploDe50(parseFloat(selectedProduct.precio_producto) * (1 - selectedProduct.descuento / 100)).toLocaleString()}
                    <span className="text-[var(--main-color-sub)] text-[12px]"> Cop</span>
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

export default CardsOffersGrid;
