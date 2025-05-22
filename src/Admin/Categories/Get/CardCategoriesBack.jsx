import React from 'react';

const CardCategoriesBack = ({ categoria }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[100px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{categoria.nombre_categoria}</h2>

      <div className="mt-2 text-sm">
        <p className="text-gray-700 font-medium flex gap-2">
          <span className="font-semibold">ID:</span>
          <span className="break-words">{categoria.id_categoria}</span>
        </p>
      </div>
    </div>
  );
};

export default CardCategoriesBack;
