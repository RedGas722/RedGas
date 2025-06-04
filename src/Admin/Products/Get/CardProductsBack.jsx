import React from 'react';

  const convertirFecha = (fechaConvertir) => {
    // Solo extraemos la fecha YYYY-MM-DD directamente
    return fechaConvertir ? fechaConvertir.slice(0, 10) : '';
  };

const convertirBase64AUrl = (imagen) => {
  if (!imagen) {
    console.warn("No hay imagen");
    return null;
  }
  if (typeof imagen === 'string') {
    return `data:image/png;base64,${imagen}`;
  }
  console.warn("Formato de imagen desconocido:", imagen);
  return null;
};

const CardsProductsBack = ({ producto }) => {
  const imageUrl = convertirBase64AUrl(producto.imagen);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-[420px] flex flex-col justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{producto.nombre_producto}</h2>
      
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={producto.nombre_producto}
          className="w-full h-[200px] object-contain rounded-md my-2"
        />
      ) : (
        <div className="w-full h-[200px] flex justify-center items-center bg-gray-200 rounded-md text-gray-500">
          Imagen no disponible
        </div>
      )}

      <h2 className="text-md text-gray-600">Categoría: {producto.nombre_categoria || 'Sin categoría'}</h2>
      <h2 className="text-md font-bold text-gray-600">Stock: {producto.stock}</h2>
      {producto.descuento != 0 && (
      <h2 className="text-md font-bold text-gray-600">Descuento: {producto.descuento}%</h2>
      )}
      {producto.descuento != 0 && (
        <h2 className="text-md font-bold text-gray-600">Fecha Descuento: {convertirFecha(producto.fecha_descuento)}</h2>
      )}
      <p className="text-lg font-bold text-green-600">
        {new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(producto.precio_producto || 0)}
      </p>
    </div>
  );
};

export default CardsProductsBack;
