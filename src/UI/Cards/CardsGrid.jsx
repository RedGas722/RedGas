import "./Cards.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Buttons from "../Login_Register/Buttons";

async function agregarAlCarrito(item) {
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // Se maneja desde handleAddToCart
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

export const CardsGrid = ({ productos = [] }) => {
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

    try {
      // Obtener carrito actual
      const resCart = await fetch("https://redgas.onrender.com/CartGet", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!resCart.ok) throw new Error("Error al obtener el carrito");
      const cartData = await resCart.json();

      // Revisar si el producto ya está en el carrito
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

      // Si pasa la validación, agregar al carrito
      const item = {
        productId: producto.id_producto,
        productName: producto.nombre_producto,
        quantity: 1,
        price: producto.precio_producto,
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

  return (
    <section className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {productos.map((producto, index) => (
        <div key={index} className="flex justify-center items-center p-[25px_0]">
          <div className="card z-[2] NeoSubContainer_outset_TL">
            <div className="card-img">
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
                <p>
                  <span className="text-[var(--Font-Nav-shadow)]">$</span>
                  {(parseFloat(producto.precio_producto) || 0).toLocaleString()}
                  <span className="text-[var(--main-color-sub)] text-[12px]"> Cop</span>
                </p>
              </div>
              <button className="card-btn" onClick={() => handleAddToCart(producto)}>
                <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>
            <Buttons
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
                    {(parseFloat(selectedProduct.precio_producto) || 0).toLocaleString()}
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

export default CardsGrid;
