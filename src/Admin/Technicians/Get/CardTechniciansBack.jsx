const convertirBase64AUrl = (imagen) => {
  if (!imagen) {
    console.warn("No hay imagen");
    return null;
  }
  if (typeof imagen === 'string') {
    return `data:image/png;base64,${imagen}`;
  }
  if (typeof imagen === 'object' && imagen.type === 'Buffer' && Array.isArray(imagen.data)) {
    const binary = imagen.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64 = btoa(binary);
    return `data:image/png;base64,${base64}`;
  }
  console.warn("Formato de imagen desconocido:", imagen);
  return null;
};

const CardTechniciansBack = ({ tecnico }) => {
  const imageUrl = convertirBase64AUrl(tecnico.imagen);

  return (
    <div className="NeoContainer_outset_TL p-4 w-fit h-fit flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-[var(--main-color)] truncate">{tecnico.nombre_tecnico}</h2>

      <div className="my-2 w-full h-[200px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tecnico.nombre_tecnico}
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-md text-[var(--main-color-sub)]">
            Foto no disponible
          </div>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">ID:</span>
          <span className="break-words">{tecnico.id_tecnico}</span>
        </p>
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Correo:</span>
          <span className="break-words">{tecnico.correo_tecnico}</span>
        </p>
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Teléfono:</span>
          <span className="break-words">{tecnico.telefono_tecnico}</span>
        </p>
      </div>
    </div>
  );
};

export default CardTechniciansBack;
