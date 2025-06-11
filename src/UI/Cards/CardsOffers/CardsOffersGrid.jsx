import "./CardsOffers.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTags } from '@fortawesome/free-solid-svg-icons';

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
        <div key={index} className="relative flex justify-center items-center">
          <div className="card NeoSubContainer_outset_TL w-[250px]">
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
                  {(parseFloat(producto.precio_producto) - (parseFloat(producto.precio_producto) * (producto.descuento / 100))).toLocaleString()} 
                  <span className="text-[var(--main-color-sub)] text-[12px]"> Cop</span>
                </p>
                <div className="text-[15px] text-[var(--Font-Nav)]">
                  <p className="text-[var(--Font-Nav-shadow)]">
                    $ <span className="line-through decoration-[1.5px] decoration-[var(--Font-Nav2)]">
                      {(parseFloat(producto.precio_producto)).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
              <button className="card-btn_Offer" onClick={() => handleAddToCart(producto)}>
                <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>
          </div>

          <div className="absolute top-[25px] -left-2">
            <div className="relative flex items-center text-[var(--main-color)]">
              <FontAwesomeIcon icon={faTags} className="text-6xl text rotate-90" />
              <p className="text-[18px] flex text-[var(--Font-Nav)] absolute left-4 top-4 font-bold">
                {producto.descuento} <span className="text-[12px]">%</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CardsOffersGrid;
