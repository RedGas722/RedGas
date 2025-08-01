import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr";
import { CardsOffersGrid } from "../../UI/Cards/CardsOffers/CardsOffersGrid";
import CardsGrid from "../../UI/Cards/CardsGrid";
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import Paginator from "../../UI/Paginator/Paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const SearchPage = () => {
  const location = useLocation();
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [productosSinDescuento, setProductosSinDescuento] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const category = queryParams.get("category") || "";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tipoUsuario = decoded?.data?.tipo_usuario;
        setIsLoggedIn(true);
        setIsAdmin(tipoUsuario === 1 || tipoUsuario === 3 || tipoUsuario === 4); 
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

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
          procesarProductos((productos || []).filter(p => p.stock > 0));
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
          procesarProductos((productos || []).filter(p => p.stock > 0));
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
            {/* Barra de búsqueda funcional, solo una vez */}
            <SearchBarr productos={productos} className='z-[3] mt-4' />

            {productosConDescuento.length > 0 && (
              <section className="z-[2]">
                <h2 className="text-xl text-[var(--main-color)] mb-8 mt-12">Ofertas:</h2>
                <CardsOffersGrid productos={productosConDescuento} />
              </section>
            )}

            {productosSinDescuento.length > 0 && (
              <section className="z-[2]">
                <h2 className="text-xl text-[var(--Font-Nav)] mb-8 mt-12">Productos:</h2>
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
      {isLoggedIn && !isAdmin && (
        <div
          onClick={() => navigate('/Shopping')}
          className="shopCart flex items-center justify-center cursor-pointer w-14 h-14 fixed bottom-2 rounded-[100px] p-[10px] right-5 bg-[var(--Font-Nav)] z-[5]"
        >
          <FontAwesomeIcon icon={faCartShopping} className="text-[var(--background-color)] text-2xl" />
        </div>
      )}
    </section>
  );
};
