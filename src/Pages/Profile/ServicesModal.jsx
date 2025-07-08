import { useEffect, useState } from "react";
import { ShortText } from "../../UI/ShortText/ShortText";
import {
   Power as PowerIcon,
   Settings as SettingsIcon,
   Build as BuildIcon,
   Refresh as RefreshIcon,
   Check as CheckIcon,
   Clear as ClearIcon,
   Close as CloseIcon
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const URL_SAVESERVICESGET = 'http://localhost:10101/ClienteHistorialServicesGet';

const ServicesModal = ({ onClose }) => {
   const [historial, setHistorial] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchFacturasCliente = async () => {
      setLoading(true)
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

         if (!res.ok) throw new Error("Error al obtener historial");

         const data = await res.json();
         console.log("📦 data.get:", data.get);

         const parsed = JSON.parse(data.get); // ← viene como array
         if (Array.isArray(parsed)) {
            setHistorial(parsed);
         } else {
            setHistorial([]); // fallback si no es array
         }

      } catch (error) {
         console.error("❌ Error cargando historial:", error);
         setHistorial([]);
      } finally {
         setLoading(false)
      }
   };

   useEffect(() => {
      fetchFacturasCliente();
   }, []);

   const getStatusConfig = (status) => {
      switch (status?.toLowerCase()) {
         case "proceso":
         case "en proceso":
            return {
               icon: <RefreshIcon className="text-yellow-500" />,
               label: "En proceso",
               bgColor: "bg-yellow-100",
               textColor: "text-yellow-800",
               borderColor: "border-yellow-300"
            };
         case "finalizado":
         case "completado":
            return {
               icon: <CheckIcon className="text-green-500" />,
               label: "Finalizado",
               bgColor: "bg-green-100",
               textColor: "text-green-800",
               borderColor: "border-green-300"
            };
         case "cancelado":
            return {
               icon: <ClearIcon className="text-red-500" />,
               label: "Cancelado",
               bgColor: "bg-red-100",
               textColor: "text-red-800",
               borderColor: "border-red-300"
            };
         default:
            return {
               icon: <RefreshIcon className="text-yellow-500" />,
               label: "En proceso",
               bgColor: "bg-yellow-100",
               textColor: "text-yellow-800",
               borderColor: "border-yellow-300"
            };
      }
   };

   const getServiceConfig = (type) => {
      const serviceType = type?.toLowerCase();
      switch (serviceType) {
         case "instalacion":
         case "instalación":
            return {
               icon: <PowerIcon className="text-blue-600" />,
               title: "Instalación",
            };
         case "reparacion":
         case "reparación":
            return {
               icon: <SettingsIcon className="text-orange-600" />,
               title: "Reparación",
            };
         case "mantenimiento":
            return {
               icon: <BuildIcon className="text-green-600" />,
               title: "Mantenimiento",
            };
         default:
            return {
               icon: <BuildIcon className="text-gray-600" />,
               title: "Servicio",
            };
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
         <div className="w-[90%] md:w-[60%] lg:w-[50%] max-h-[90vh] flex-col gap-4 flex items-center NeoContainer_outset_TL overflow-hidden">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 border-b border-gray-200">
               <h2 className="font-bold text-3xl text-[var(--main-color)]">Historial</h2>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                  <div className="space-y-4">
                     {historial.map((item, index) => {
                        let parsedItem = {};
                        try {
                           parsedItem = JSON.parse(item.item);
                        } catch (e) {
                           console.error("Error al parsear item.item", item.item);
                        }

                        const serviceConfig = getServiceConfig(parsedItem.type || item.type);
                        const statusConfig = getStatusConfig(item.state);

                        return (
                           <div
                              key={index}
                              className="NeoSubContainer_outset_TL w-full p-4 hover:shadow-lg transition-shadow"
                           >
                              {/* Service Header */}
                              <div className="flex items-center gap-3 mb-3">
                                 {serviceConfig.icon}
                                 <h3 className="text-lg font-bold text-[var(--Font-Nav)]">
                                    {serviceConfig.title}
                                 </h3>
                              </div>

                              {/* Service Details */}
                              <div className="space-y-3">
                                 {/* Description */}
                                 <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-1">Descripción:</h4>
                                    <ShortText
                                       text={parsedItem.description || parsedItem.services || "Sin descripción"}
                                       maxLength={150}
                                    />
                                 </div>

                                 {/* Tech Description */}
                                 {item.descriptionTech && (
                                    <div>
                                       <h4 className="text-sm font-bold text-gray-700 mb-1">Descripción Técnico:</h4>
                                       <ShortText text={item.descriptionTech} maxLength={150} />
                                    </div>
                                 )}

                                 {/* Total Price */}
                                 {item.totalPrice && (
                                    <div>
                                       <h4 className="text-sm font-bold text-gray-700 mb-1">Total:</h4>
                                       <p className="text-lg font-semibold text-green-600">
                                          ${item.totalPrice}
                                       </p>
                                    </div>
                                 )}

                                 {/* Status */}
                                 <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-1">Estado:</h4>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                       {statusConfig.icon}
                                       <span className="text-sm font-semibold">
                                          {statusConfig.label}
                                       </span>
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
                  <button
                     onClick={onClose}
                     className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition-colors font-medium"
                  >
                     Cerrar
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ServicesModal;