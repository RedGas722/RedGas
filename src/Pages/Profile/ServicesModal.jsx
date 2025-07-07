import { useEffect, useState } from "react";
import { Buttons } from "../../UI/Login_Register/Buttons";
import { ProductsModal } from "../../Admin/Factures/Get/ProductsModal";
import { ShortText } from "../../UI/ShortText/ShortText"
import { faTools, faCheck, faX, faPlug, faGears, faRotate } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ServicesModal = ({ onClose }) => {
  const [facturas, setFacturas] = useState([]);
  const [productosFactura, setProductosFactura] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFacturasCliente = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const res = await fetch("https://redgas.onrender.com/FacturaGetByClient", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener facturas");
      const data = await res.json();

      setFacturas(data.data || []);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al cargar las facturas");
    } finally {
      setLoading(false);
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
      
                           <div className="NeoSubContainer_outset_TL w-full p-[10px]">
                              <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                                 <FontAwesomeIcon icon={faPlug} className="text-[var(--Font-Nav)]" />
                                 <h3 className="text-[17px] font-bold">Instalación</h3>
                              </div>
                              <div className="pl-[3px]">
                                 <h3 className="text-[15px] font-bold">Descripción:</h3>
                                 <ShortText text='mi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gas' />
                              </div>
                              <div>
                                 <h3 className="text-[15px] font-bold">Estado:</h3>
                                 <div className="flex items-center text-[var(--Font-Yellow)]">
                                    <FontAwesomeIcon icon={faRotate} className="" />
                                    <p className="text-[13px] pl-[5px] font-semibold">En proceso</p>
                                 </div>
                              </div>
                           </div>
      
                           <div className="NeoSubContainer_outset_TL w-full p-[10px]">
                              <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                                 <FontAwesomeIcon icon={faGears} className="text-[var(--Font-Nav)]" />
                                 <h3 className="text-[17px] font-bold">Reparación</h3>
                              </div>
                              <div className="pl-[3px]">
                                 <h3 className="text-[15px] font-bold">Descripción:</h3>
                                 <ShortText text='mi estufa no prende y huele a gas' />
                              </div>
                              <div>
                                 <h3 className="text-[15px] font-bold">Estado:</h3>
                                 <div className="flex items-center text-[var(--Font-Nav)]">
                                    <FontAwesomeIcon icon={faCheck} className="" />
                                    <p className="text-[13px] pl-[5px] font-semibold">Finalizado</p>
                                 </div>
                              </div>
                           </div>
      
                           <div className="NeoSubContainer_outset_TL w-full p-[10px]">
                              <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                                 <FontAwesomeIcon icon={faTools} className="text-[var(--Font-Nav)]" />
                                 <h3 className="text-[17px] font-bold">Mantenimiento</h3>
                              </div>
                              <div className="pl-[3px]">
                                 <h3 className="text-[15px] font-bold">Descripción:</h3>
                                 <ShortText text='mi estufa no prende y huele a gas' />
                              </div>
                              <div>
                                 <h3 className="text-[15px] font-bold">Estado:</h3>
                                 <div className="flex items-center text-[var(--Font-Nav2)]">
                                    <FontAwesomeIcon icon={faX} className="" />
                                    <p className="text-[13px] pl-[5px] font-semibold">Cancelado</p>
                                 </div>
                              </div>
                           </div>
      
                     </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
          >
            Cerrar
          </button>
        </div>

        {productosFactura && (
          <ProductsModal
            factura={productosFactura}
            onClose={() => setProductosFactura(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesModal;
