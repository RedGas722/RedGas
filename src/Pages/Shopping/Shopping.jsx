import { useEffect, useState } from "react";
import { Header } from '../../Layouts/Header/Header';

export const Shopping = () => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      if (!token) {
        setError("Debes iniciar sesión para ver el carrito");
        setLoading(false);
        return;
      }

      const resCart = await fetch("https://redgas.onrender.com/CartGet", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!resCart.ok) throw new Error("Error al obtener el carrito");

      const cartData = await resCart.json();

      const productDetails = await Promise.all(
        cartData.map(async (item) => {
          const res = await fetch(`https://redgas.onrender.com/ProductoGet?nombre_producto=${encodeURIComponent(item.productName)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) throw new Error(`Error al obtener el producto: ${item.productName}`);

          const data = await res.json();
          const productData = data.data;

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

  const fetchTotalPrice = async () => {
    try {
      const res = await fetch("https://redgas.onrender.com/CartTotal", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("No se pudo obtener el total del carrito");

      const data = await res.json();
      setTotalPrice(data.total);
    } catch (err) {
      console.error("Error al obtener el total:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTotalPrice();
  }, []);

  const handleRemoveProduct = async (productId) => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para eliminar productos");
        return;
      }

      const res = await fetch("https://redgas.onrender.com/CartRemove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (!res.ok) throw new Error("No se pudo eliminar el producto del carrito");

      setProducts((prev) => prev.filter(p => p.id_producto !== productId));
      fetchTotalPrice(); // actualizar total
    } catch (err) {
      alert(err.message || "Error al eliminar el producto");
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const res = await fetch("https://redgas.onrender.com/CartUpdateQuantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });

      if (!res.ok) throw new Error("No se pudo actualizar la cantidad");

      setProducts((prev) =>
        prev.map((p) =>
          p.id_producto === productId ? { ...p, cantidad: newQuantity } : p
        )
      );
      fetchTotalPrice(); // actualizar total
    } catch (err) {
      alert(err.message || "Error al actualizar la cantidad");
    }
  };

  const handleClearCart = async () => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para limpiar el carrito");
        return;
      }

      const res = await fetch("https://redgas.onrender.com/CartClear", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("No se pudo limpiar el carrito");

      setProducts([]);
      setTotalPrice(0);
    } catch (err) {
      alert(err.message || "Error al limpiar el carrito");
    }
  };

  const handlePayWithPaypal = async () => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para pagar con PayPal");
        return;
      }

    const body = {
      cantidad: totalPrice.toFixed(0), // solo envías lo necesario
      referencia: `ORD-${Date.now()}`
    };

    const res = await fetch("https://redgas.onrender.com/PagoPaypal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

      const data = await res.json();

      if (!res.ok) throw new Error(data.errorInfo || "Error al iniciar el pago");

      // Buscar el link de aprobación
      const approvalLink = data.data.links.find(link => link.rel === "approve");

      if (!approvalLink) throw new Error("No se encontró el link de aprobación de PayPal");

      // Redirigir al link de PayPal
      window.location.href = approvalLink.href;

    } catch (error) {
      console.error("Error al pagar con PayPal:", error);
      alert("Ocurrió un error al iniciar el pago con PayPal");
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className='Distribution'>
      <Header />
      <div className="flex flex-col gap-[80px] text-[var(--main-color)] MainPageContainer">
        {products.length === 0 && <p>No hay productos para mostrar.</p>}

        {products.map((producto, index) => {
        const descuento = Number(producto.descuento) || 0;
        const precioUnidad = Number(producto.precio_producto) || 0;
        const precioConDescuento = precioUnidad * (1 - descuento / 100);
        const subtotal = precioConDescuento * producto.cantidad;

        return (
          <section key={index}>
            <section className='flex justify-center gap-[20px]'>
              <section className='NeoContainer_outset_TL flex gap-[20px] p-[20px_10px] w-[70%] h-fit'>
                <div>
                  <img
                    src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : "https://via.placeholder.com/150"}
                    alt={producto.nombre_producto}
                    className='w-[150px] rounded-[20px]'
                  />
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px]'>
                  <h2 className='text-2xl font-bold'>{producto.nombre_producto}</h2>
                  <div className="flex flex-col gap-1">
                    <p className='text-base font-medium text-[var(--main-color)]'>
                      <strong>Precio Unidad:</strong> ${precioConDescuento.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      {descuento > 0 && (
                        <span className="ml-2 text-sm text-green-600 font-semibold">
                          ({descuento}% OFF)
                        </span>
                      )}
                    </p>
                    <p className='text-base font-medium text-[var(--main-color)]'>
                      <strong>Subtotal:</strong> ${subtotal.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <p className='text-[var(--main-color-sub)]'>{producto.descripcion_producto || "Sin descripción disponible."}</p>
                  <p className='text-[var(--main-color-sub)]'>Cantidad: {producto.cantidad}</p>
                  <div className="flex gap-2 items-center">
                    <button className="buttonTL2 p-2" onClick={() =>
                      producto.cantidad > 1 &&
                      handleUpdateQuantity(producto.id_producto, producto.cantidad - 1)
                    }>-</button>
                    <span>{producto.cantidad}</span>
                    <button className="buttonTL2 p-2" onClick={() =>
                      handleUpdateQuantity(producto.id_producto, producto.cantidad + 1)
                    }>+</button>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-2">
                <button className='buttonTL2 NeoSubContainer_outset_TL p-[7px]' onClick={() => alert("Comprar producto aún no implementado")}>
                  Comprar!!
                </button>
                <button
                  className='buttonTL2 NeoSubContainer_outset_TL p-[7px] bg-red-500 text-white hover:bg-red-600'
                  onClick={() => handleRemoveProduct(producto.id_producto)}
                >
                  Eliminar
                </button>
              </div>
            </section>
          </section>
        );
      })}

        <footer className="flex flex-col items-center gap-4">
          <div className='flex justify-center items-center gap-[20px]'>
            <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Comprar todo</button>
            <button
              className='buttonTL2 bg-yellow-500 text-white font-black NeoSubContainer_outset_TL p-[7px] hover:bg-yellow-600'
              onClick={handlePayWithPaypal}
            >
              Pagar con PayPal
            </button>
            <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Ver carrito</button>
            <button
              className='buttonTL2 bg-red-600 text-white font-black NeoSubContainer_outset_TL p-[7px] hover:bg-red-700'
              onClick={handleClearCart}
            >
              Limpiar carrito
            </button>
          </div>

          {/* Total del carrito */}
          <p className="text-xl font-semibold text-[var(--main-color)]">
            Total: ${totalPrice.toLocaleString("es-CO")}
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Shopping;
