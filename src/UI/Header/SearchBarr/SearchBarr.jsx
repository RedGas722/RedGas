import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBarr.css';

export const SearchBarr = ({ className, productos }) => {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const contenedorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([]);
      return;
    }

    const filtrados = productos.filter((producto) =>
      producto.nombre_producto?.toLowerCase().includes(nombreBusqueda.toLowerCase())
    );

    setSugerencias(filtrados.slice(0, 5));
  }, [nombreBusqueda, productos]);

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([]);
      }
    };

    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  const manejarSeleccion = (producto) => {
    setNombreBusqueda(producto.nombre_producto);
    setSugerencias([]);
    navigate(`/SearchPage?q=${encodeURIComponent(producto.nombre_producto)}`);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (nombreBusqueda.trim()) {
      navigate(`/SearchPage?q=${encodeURIComponent(nombreBusqueda)}`);
    }
  };

  return (
    <div ref={contenedorRef} className={`inputs relative w-full NeoSubContainer_inset_TOTAL ${className}`}>
      <form onSubmit={manejarSubmit} className="w-full">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-[10px] top-[9px] text-[var(--Font-Nav)]"
        />
        <input
          type="text"
          id="Searchbarr"
          value={nombreBusqueda}
          onChange={(e) => setNombreBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          className="bg-transparent outline-0 p-[10px_10px_10px_35px] w-full h-[35px] rounded-[100px] text-[var(--main-color)]"
        />
      </form>

      {sugerencias.length > 0 && (
        <ul className="absolute top-[45px] left-0 w-full bg-white text-black rounded-[10px] shadow-md z-50">
          {sugerencias.map((producto) => (
            <li
              key={producto.id_producto}
              onClick={() => manejarSeleccion(producto)}
              className="p-2 hover:bg-gray-200 cursor-pointer rounded-[10px]"
            >
              {producto.nombre_producto}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarr;
