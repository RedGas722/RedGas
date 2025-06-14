import { useState, useRef } from 'react';

export const useBuscarSales = (productos, ventasOriginal, setVentas) => {
  const [productoBusqueda, setProductoBusqueda] = useState('');
  const [productoSugerencias, setProductoSugerencias] = useState([]);
  const contenedorRefProducto = useRef(null);

  const handleProductoInput = (texto) => {
    setProductoBusqueda(texto);
    const sugerencias = productos.filter(p => p.nombre_producto.toLowerCase().includes(texto.toLowerCase()));
    setProductoSugerencias(sugerencias);
  };

  const handleBuscar = () => {
    if (!productoBusqueda.trim()) {
      setVentas(ventasOriginal);
      return;
    }

    const productoFiltrado = productos.find(p => p.nombre_producto.toLowerCase() === productoBusqueda.toLowerCase());
    if (!productoFiltrado) {
      setVentas([]);
      return;
    }

    const filtrados = ventasOriginal.filter(v => v.id_producto === productoFiltrado.id_producto);
    setVentas(filtrados);
  };

  const handleLimpiar = () => {
    setProductoBusqueda('');
    setProductoSugerencias([]);
    setVentas(ventasOriginal);
  };

  return {
    productoBusqueda, productoSugerencias,
    handleProductoInput, handleBuscar, handleLimpiar,
    contenedorRefProducto, setProductoBusqueda
  };
};
