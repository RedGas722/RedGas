import "./Cards.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

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

export const CardsGrid = ({ productos = [] }) => {

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
    <section className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {productos.map((producto, index) => (
        <div key={index} className="flex justify-center items-center">
          <div className="card NeoSubContainer_outset_TL w-[250px]">
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
                <p><span className="text-[var(--Font-Nav-shadow)]">$</span> {(parseFloat(producto.precio_producto) || 0).toLocaleString()} <span className="text-[var(--main-color-sub)] text-[12px]">Cop</span> </p>
              </div>
              <button className="card-btn" onClick={() => handleAddToCart(producto)}>
                <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CardsGrid;
