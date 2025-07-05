import { useEffect, useState } from "react";
import { Buttons } from "../../UI/Login_Register/Buttons";
import { ProductsModal } from "../../Admin/Factures/Get/ProductsModal";

const FacturasModal = ({ onClose }) => {
  const [facturas, setFacturas] = useState([]);
  const [productosFactura, setProductosFactura] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFacturasCliente = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const res = await fetch("http://localhost:10101/FacturaGetByClient", {
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
      <div className="bg-white max-w-[1000px] w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <h2 className="text-2xl font-bold text-center text-[var(--Font-Nav)] mb-4">
          Compras Realizadas
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando facturas...</p>
        ) : facturas.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron facturas.</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {facturas.map((factura) => (
              <div
                key={factura.id_factura}
                className="NeoContainer_outset_TL p-4 w-[280px] flex flex-col gap-2"
              >
                <h3 className="text-xl font-bold text-[var(--Font-Nav)]">
                  Factura #{factura.id_factura}
                </h3>
                <p className="text-[var(--main-color)]">
                  Fecha: {new Date(factura.fecha_factura).toLocaleDateString()}
                </p>
                <p className="text-[var(--main-color)]">
                  Total: ${factura.total}
                </p>
                <p className="text-[var(--main-color)]">
                  Estado: {factura.estado_factura}
                </p>
                <Buttons
                  nameButton="Ver productos"
                  Onclick={() => setProductosFactura(factura)}
                  className="bg-[var(--Font-Yellow)] hover:bg-yellow-600 text-white font-semibold py-1 px-4 rounded-md"
                />
              </div>
            ))}
          </div>
        )}

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

export default FacturasModal;
