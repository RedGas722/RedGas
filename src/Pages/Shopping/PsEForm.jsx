import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const PsePaymentForm = ({ monto, onClose }) => {
  const [formData, setFormData] = useState({
    bank: '',
    invoice: `INV-${Date.now()}`,
    value: monto,
    doc_type: 'CC',
    doc_number: '',
    type_person: '0',
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const user = decoded?.data;

      setFormData(prev => ({
        ...prev,
        value: monto,
        name: user?.name || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        direccion: user?.direccion || ''
      }));
    }
  }, [monto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para pagar con PSE");
      return;
    }

    try {
      const response = await fetch('https://redgas.onrender.com/PagoPSE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data?.data?.processUrl) {
        window.location.href = data.data.processUrl;
      } else {
        alert('Error al generar el pago');
      }
    } catch (error) {
      console.error('Error al generar el pago:', error);
      alert('Ocurrió un error al generar el pago');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Pago PSE</h2>

          {/* Datos informativos sin input */}
          <div className="mb-2">
            <p className="font-semibold mb-1">Nombre:</p>
            <p>{formData.name}</p>
          </div>

          <div className="mb-2">
            <p className="font-semibold mb-1">Correo:</p>
            <p>{formData.email}</p>
          </div>

          <div className="mb-2">
            <p className="font-semibold mb-1">Teléfono:</p>
            <p>{formData.telefono}</p>
          </div>

          {/* Dirección editable con input nativo */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
          </div>

          {/* Documento editable con input nativo */}
          <div className="mb-2">
            <input
              type="number"
              placeholder="Número de documento"
              name="doc_number"
              value={formData.doc_number}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
          </div>

          {/* Tipo de persona */}
          <select
            name="type_person"
            value={formData.type_person}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Tipo de Persona</option>
            <option value="0">Natural</option>
            <option value="1">Jurídica</option>
          </select>

          {/* Valor a pagar como texto */}
          <div className="mb-2">
            <p className="font-semibold mb-1">Valor a pagar:</p>
            <p>{formData.value}</p>
          </div>

          {/* Bancos */}
          <select
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Selecciona tu banco</option>
            <option value="1022">Banco de Bogotá</option>
            <option value="1052">Bancolombia</option>
            <option value="1066">Davivienda</option>
          </select>

          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Pagar</button>
            <button type="button" onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PsePaymentForm;
