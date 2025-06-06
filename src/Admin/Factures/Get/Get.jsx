const URL = 'https://redgas.onrender.com/FacturaGet';

export const validarIDFactura = (id) => {
  return /^\d+$/.test(id);
};

export const buscarFacturaPorID = async (idFactura) => {
  if (!idFactura || idFactura.trim() === '') {
    return null;
  }

  if (!validarIDFactura(idFactura)) {
    throw new Error('Por favor, introduce un ID numérico válido.');
  }

  const res = await fetch(`${URL}?id_factura=${encodeURIComponent(idFactura)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();

  if (!res.ok || !data?.data || data.data.length === 0) {
    throw new Error('No se encontró una factura con este ID.');
  }

  return data.data[0]; // retornamos solo una factura
};
