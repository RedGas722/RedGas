import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../Layouts/Header/Header";
import { CardsOffersGrid } from "../../UI/Cards/CardsOffers/CardsOffersGrid";
import CardsGrid from "../../UI/Cards/CardsGrid";
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import Paginator from "../../UI/Paginator/Paginator";

export const SearchPage = () => {
  const location = useLocation();
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [productosSinDescuento, setProductosSinDescuento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const category = queryParams.get("category") || "";

  useEffect(() => {
    const fetchProductosFiltrados = async () => {
      setLoading(true);
      try {
        if (!query && !category) return;

        // 🔍 Búsqueda por nombre
        if (query) {
          const res = await fetch(`https://redgas.onrender.com/ProductoGetPartialName?query=${encodeURIComponent(query)}`);
          const data = await res.json();
          const productos = data?.data || [];
          procesarProductos(productos);
          setTotalPages(1); // sin paginación
          return;
        }

        // 📂 Búsqueda por categoría con paginación
        if (category) {
          const res = await fetch(`https://redgas.onrender.com/ProductoGetAllCategoria?nombre_categoria=${encodeURIComponent(category)}&page=${currentPage}&limit=10`);
          const data = await res.json();
          const productos = data?.data?.data || [];
          setTotalPages(data?.data?.totalPages || 1);
          procesarProductos(productos);
          return;
        }

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
  }, [query, category, currentPage]); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <>
      <Header />
      <div className='btnDown z-[2] '>
        <BtnBack To='/' />
      </div>
      <div className="min-h-screen text-[var(--main-color)] pt-14 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <h1 className="text-3xl font-bold mb-10">
          {query
            ? <p className="z-[2]">Resultados para: <span className="z-[2] text-[var(--main-color)]">{query}</span></p>
            : <span className="z-[2] text-[var(--main-color)]">{category}</span>}
        </h1>

        {loading ? (
          <p className="text-xl text-center font-semibold">Cargando productos...</p>
        ) : (
          <>
            {productosConDescuento.length > 0 && (
              <section className="z-[2] ">
                <h2 className="text-2xl font-semibold text-[var(--main-color)] mb-8 mt-12">Ofertas:</h2>
                <div>
                  <CardsOffersGrid productos={productosConDescuento} />
                </div>
              </section>
            )}

            {productosSinDescuento.length > 0 && (
              <section className="z-[2] ">
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
        {category && totalPages > 1 && (
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        )}
      </div>
    </>
  );
};
