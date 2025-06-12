import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../Layouts/Header/Header";
import CardsOffersGrid from "../../UI/Cards/CardsOffers/CardsOffersGrid";
import CardsGrid from "../../UI/Cards/CardsGrid";

export const SearchPage = () => {
  const location = useLocation();
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [productosSinDescuento, setProductosSinDescuento] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const category = queryParams.get("category") || "";

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://redgas.onrender.com/ProductoGetAll");
        const data = await res.json();
        const productos = data.data.productos;

        let filtrados = productos;

        if (query) {
          filtrados = productos.filter((producto) =>
            producto.nombre_producto.toLowerCase().includes(query.toLowerCase())
          );
        } else if (category) {
          filtrados = productos.filter((producto) =>
            producto.categorias?.some(cat =>
              (cat || "").toLowerCase().trim() === category.toLowerCase().trim()
            )
          );
        }

        const conDescuento = filtrados.filter(producto => producto.descuento > 0);
        const sinDescuento = filtrados.filter(producto => producto.descuento === 0);

        setProductosConDescuento(conDescuento);
        setProductosSinDescuento(sinDescuento);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query || category) fetchProductos();
  }, [query, category]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black pt-14 p-4">
        <h1 className="text-3xl font-bold mb-10">
          {query 
            ? <>Resultados para: <span className="text-[var(--main-color)]">{query}</span></> 
            : <span className="text-[var(--main-color)]">{category}</span>}
        </h1>

        {loading ? (
          <p className="text-xl text-center font-semibold">Cargando productos...</p>
        ) : (
          <>
            {productosConDescuento.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-[var(--main-color)] mb-8 mt-12">Ofertas:</h2>
                <div className="mt-10 mb-24">
                  <CardsOffersGrid productos={productosConDescuento} />
                </div>
              </>
            )}

            {productosSinDescuento.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-[var(--Font-Nav)] mb-8 mt-12">Productos:</h2>
                <div className="mt-10 mb-24">
                  <CardsGrid productos={productosSinDescuento} />
                </div>
              </>
            )}

            {productosConDescuento.length === 0 && productosSinDescuento.length === 0 && (
              <p className="text-lg text-center">No se encontraron productos.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
