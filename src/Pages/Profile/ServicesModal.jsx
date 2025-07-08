import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BuildIcon from "@mui/icons-material/Build";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlug,
  faGears,
  faTools,
  faCheck,
  faX,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { ShortText } from "../../UI/ShortText/ShortText";
import { jwtDecode } from "jwt-decode";

const URL_SAVESERVICESGET = "http://localhost:10101/ClienteHistorialServicesGet";

const getServiceConfig = (type) => {
  switch (type?.toLowerCase()) {
    case "instalación":
      return {
        title: "Instalación",
        icon: <FontAwesomeIcon icon={faPlug} className="text-[var(--Font-Nav)]" />,
        description: "Instalación de equipos de gas y accesorios según necesidad del cliente.",
      };
    case "reparación":
      return {
        title: "Reparación",
        icon: <FontAwesomeIcon icon={faGears} className="text-[var(--Font-Nav)]" />,
        description: "Corrección de fallas en sistemas de gas o electrodomésticos.",
      };
    case "mantenimiento":
      return {
        title: "Mantenimiento",
        icon: <FontAwesomeIcon icon={faTools} className="text-[var(--Font-Nav)]" />,
        description: "Revisión y limpieza preventiva para asegurar el buen funcionamiento.",
      };
    default:
      return {
        title: "Servicio",
        icon: <BuildIcon className="text-[var(--Font-Nav)]" />,
        description: "Tipo de servicio no especificado.",
      };
  }
};

const getStatusConfig = (state) => {
  const normalized = state?.toLowerCase();
  switch (normalized) {
    case "finalizado":
      return {
        label: "Finalizado",
        icon: <FontAwesomeIcon icon={faCheck} />,
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-400",
      };
    case "cancelado":
      return {
        label: "Cancelado",
        icon: <FontAwesomeIcon icon={faX} />,
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-400",
      };
    default:
      return {
        label: "En proceso",
        icon: <FontAwesomeIcon icon={faRotate} />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-400",
      };
  }
};

const ServicesModal = ({ onClose }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacturasCliente = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const decoded = jwtDecode(token);
      const userId = decoded.data.id;

      const res = await fetch(URL_SAVESERVICESGET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) throw new Error("Error al obtener historial");

      const data = await res.json();
      const parsed = JSON.parse(data.get);
      setHistorial(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("❌ Error cargando historial:", error);
      alert("Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturasCliente();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[90%] md:w-[60%] lg:w-[50%] max-h-[90vh] flex-col gap-4 flex items-center NeoContainer_outset_TL overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-bold text-3xl text-[var(--main-color)]">Historial</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-300 rounded-full transition-colors"
          >
            <CloseIcon className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--main-color)] mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando historial...</p>
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-8">
              <BuildIcon className="text-gray-400 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay servicios registrados.</p>
            </div>
          ) : (
            <div className="space-y-4 ">
              {historial.map((item, index) => {
                let parsedItem = {};
                try {
                  parsedItem = JSON.parse(item.item);
                } catch (e) {
                  console.error("Error al parsear item.item:", item.item);
                }

                const serviceConfig = getServiceConfig(parsedItem.type || item.type);
                const statusConfig = getStatusConfig(item.state);

                return (
                  <div
                    key={index}
                    className="NeoSubContainer_outset_TL w-full p-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      {serviceConfig.icon}
                      <h3 className="text-lg font-bold text-[var(--Font-Nav)]">
                        {serviceConfig.title}
                      </h3>
                    </div>

                    {/* Tipo de servicio */}
                    <p className="text-sm italic text-gray-600 mb-3">
                      {serviceConfig.description}
                    </p>

                    <div className="space-y-3">
                      {/* Descripción del cliente */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-1">Descripción:</h4>
                        <ShortText
                          text={parsedItem.description || parsedItem.services || "Sin descripción"}
                          maxLength={150}
                        />
                      </div>

                      {/* Descripción del técnico */}
                      {item.descriptionTech && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-1">Descripción Técnico:</h4>
                          <ShortText text={item.descriptionTech} maxLength={150} />
                        </div>
                      )}

                      {/* Precio total */}
                      {item.totalPrice && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-1">Total:</h4>
                          <p className="text-lg font-semibold text-green-600">
                            ${item.totalPrice}
                          </p>
                        </div>
                      )}

                      {/* Estado */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-1">Estado:</h4>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                        >
                          {statusConfig.icon}
                          <span className="text-sm font-semibold">{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full p-4 border-t border-gray-200">
          <div className="flex justify-end">
            {/* <button
              {onClick={handleDelete()}}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition-colors font-medium"
            >
              Cerrar
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
