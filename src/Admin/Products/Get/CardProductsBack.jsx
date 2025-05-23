import React from 'react';

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
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-[400px] flex flex-col justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{producto.nombre_producto}</h2>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={producto.nombre_producto}
          className="w-full h-[220px] object-contain rounded-md my-2"
        />
      ) : (
        <div className="w-full h-[220px] flex justify-center items-center bg-gray-200 rounded-md text-gray-500">
          Imagen no disponible
        </div>
      )}
      <h2 className="text-lg font-bold text-gray-600">Stock: {producto.stock}</h2>
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
