import { useEffect, useState } from "react";
import { ShortText } from "../../UI/ShortText/ShortText";
import { faPlug, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";

const URL_SAVESERVICESGET = 'http://localhost:10101/ClienteHistorialServicesGet';

const ServicesModal = ({ onClose }) => {
  const [historial, setHistorial] = useState([]);

  const fetchFacturasCliente = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No estás autenticado");

      const decoded = jwtDecode(token);
      const userId = decoded.data.id;

      const res = await fetch(URL_SAVESERVICESGET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) throw new Error("Error al obtener facturas");

      const data = await res.json();
      console.log("data.get =>", data.get);

      const parsed = JSON.parse(data.get);
      setHistorial([parsed]); 

    } catch (error) {
      console.error("Error cargando historial:", error);
      setHistorial([]);
    }
  };

  useEffect(() => {
    fetchFacturasCliente();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[90%] md:w-[55%] lg:w-[40%] flex-col gap-4 flex items-center NeoContainer_outset_TL h-full overflow-y-auto p-[10px_8px]">
        <h2 className="font-bold text-3xl text-[var(--main-color)]">Historial</h2>
        <div className="w-full flex p-[0_10px_25px_0] flex-col gap-2 ">

          {historial.length === 0 && (
            <p className="text-center text-gray-500">No hay servicios registrados.</p>
          )}

          {historial.map((item, index) => {
            let parsedItem = {};
            try {
              parsedItem = JSON.parse(item.item);
            } catch (e) {
              console.error("Error al parsear item.item", item.item);
            }

            return (
              <div key={index} className="NeoSubContainer_outset_TL w-full p-[10px]">
                <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                  <FontAwesomeIcon icon={faPlug} className="text-[var(--Font-Nav)]" />
                  <h3 className="text-[17px] font-bold">
                    {parsedItem.description || "Sin descripción"}
                  </h3>
                </div>
                <div className="pl-[3px]">
                  <h3 className="text-[15px] font-bold">Descripción:</h3>
                  <ShortText text={parsedItem.services || "Sin servicio"} maxLength={100} />
                </div>
                <div className="pl-[3px]">
                  <h3 className="text-[15px] font-bold">Descripción Técnico:</h3>
                  <ShortText text={item.descriptionTech || "No disponible"} maxLength={100} />
                </div>
                <div className="pl-[3px]">
                  <h3 className="text-[15px] font-bold">Total:</h3>
                  <ShortText text={item.totalPrice || "N/A"} maxLength={100} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold">Estado:</h3>
                  <div className="flex items-center text-[var(--Font-Yellow)]">
                    <FontAwesomeIcon icon={faRotate} />
                    <p className="text-[13px] pl-[5px] font-semibold">
                      {item.state || "Sin estado"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
