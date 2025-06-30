import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../Layouts/Header/Header";
import CardsOffersGrid from "../../UI/Cards/CardsOffers/CardsOffersGrid";
import CardsGrid from "../../UI/Cards/CardsGrid";
import { BtnBack } from "../../UI/Login_Register/BtnBack"

export const SearchPage = () => {
  const location = useLocation();
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [productosSinDescuento, setProductosSinDescuento] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const category = queryParams.get("category") || "";

  useEffect(() => {
    const fetchProductosFiltrados = async () => {
      setLoading(true);
      try {
        if (!query && !category) return;

        let coincidencias = [];

        // Para búsqueda por nombre (query)
        if (query) {
          const res = await fetch("https://redgas.onrender.com/ProductoGetAllNames");
          const data = await res.json();

          // Coincidencias de nombres
          coincidencias = data.data.filter(p =>
            p.nombre_producto.toLowerCase().includes(query.toLowerCase())
          );
        }

        // ⚠️ En caso de búsqueda por categoría todavía no tienes una ruta optimizada
        // así que por ahora sigue usando ProductoGetAll solo para eso
        if (category) {
          const res = await fetch("https://redgas.onrender.com/ProductoGetAll");
          const data = await res.json();
          const productos = data.data.productos;

          const filtrados = productos.filter((producto) =>
            producto.categorias?.some(cat =>
              (cat || "").toLowerCase().trim() === category.toLowerCase().trim()
            )
          );

          procesarProductos(filtrados);
          return; // salir antes para no ejecutar lo de `query`
        }

        // Cargar datos completos de productos por nombre (1 fetch por producto)
        const productosDetallados = await Promise.all(
          coincidencias.map(async (producto) => {
            const res = await fetch(`https://redgas.onrender.com/ProductoGet?nombre_producto=${encodeURIComponent(producto.nombre_producto)}`);
            const data = await res.json();
            return data?.data;
          })
        );

        const filtrados = productosDetallados.filter(Boolean);
        procesarProductos(filtrados);

      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    const procesarProductos = (productos) => {
      const conDescuento = productos.filter(p => p.descuento > 0);
      const sinDescuento = productos.filter(p => p.descuento === 0);
      setProductosConDescuento(conDescuento);
      setProductosSinDescuento(sinDescuento);
    };

    fetchProductosFiltrados();
  }, [query, category]);

  return (
    <>
      <Header />
      <div className='btnDown'>
        <BtnBack To='/'  />
      </div>
      <div className="min-h-screen bg-white text-black pt-14 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
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
              <section className="mb-24">
                <h2 className="text-2xl font-semibold text-[var(--main-color)] mb-8 mt-12">Ofertas:</h2>
                <div className="mt-10">
                  <CardsOffersGrid productos={productosConDescuento} />
                </div>
              </section>
            )}

            {productosSinDescuento.length > 0 && (
              <section className="mb-24">
                <h2 className="text-2xl font-semibold text-[var(--Font-Nav)] mb-8 mt-12">Productos:</h2>
                <div className="mt-10">
                  <CardsGrid productos={productosSinDescuento} />
                </div>
              </section>
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
