import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr";
import { CardsOffersGrid } from "../../UI/Cards/CardsOffers/CardsOffersGrid";
import CardsGrid from "../../UI/Cards/CardsGrid";
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import Paginator from "../../UI/Paginator/Paginator";

export const SearchPage = () => {
  const location = useLocation();
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [productosSinDescuento, setProductosSinDescuento] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const category = queryParams.get("category") || "";

  // 🔁 Cargar nombres de productos para el SearchBar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("https://redgas.onrender.com/ProductoGetAllNames");
        const data = await res.json();
        const productosData = data.data; // [{ id_producto, nombre_producto }]
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar nombres de productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // 🔁 Buscar productos por nombre o categoría
  useEffect(() => {
    const fetchProductosFiltrados = async () => {
      setLoading(true);
      try {
        if (!query && !category) return;

        // 🔍 Búsqueda por nombre
        if (query) {
          const res = await fetch(
            `https://redgas.onrender.com/ProductoGetPartialName?query=${encodeURIComponent(query)}`
          );
          const data = await res.json();
          const productos = data?.data || [];
          procesarProductos(productos);
          setTotalPages(1); // sin paginación
          return;
        }

        // 📂 Búsqueda por categoría con paginación
        if (category) {
          const res = await fetch(
            `https://redgas.onrender.com/ProductoGetAllCategoria?nombre_categoria=${encodeURIComponent(category)}&page=${currentPage}&limit=10`
          );
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
    <section className="flex flex-col gap-4">
      <div className="z-[2] flex p-[5px] flex-col text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
        <BtnBack To='/' />
        <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Búsqueda</h2>
      </div>

      <div className="min-h-screen text-[var(--main-color)] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        {/* Barra de búsqueda funcional */}

        <h1 className="text-2xl">
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
                <h2 className="text-xl text-[var(--main-color)] mb-8 mt-12">Ofertas:</h2>
                <div>
                  <SearchBarr productos={productos} className='z-[3]' />
                  <CardsOffersGrid productos={productosConDescuento} />
                </div>
              </section>
            )}

            {productosSinDescuento.length > 0 && (
              <section className="z-[2] ">
                <h2 className="text-xl text-[var(--Font-Nav)] mb-8 mt-12">Productos:</h2>
                <SearchBarr productos={productos} className='z-[3]' />
                <CardsGrid productos={productosSinDescuento} />
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
    </section>
  );
};
