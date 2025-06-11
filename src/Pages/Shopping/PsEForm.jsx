import React, { useState, useEffect } from 'react';
import Inputs from '../../Admin/UI/Inputs/Inputs';

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
    setFormData(prev => ({ ...prev, value: monto }));
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
      const response = await fetch('https://redgas.onrender.com/generar-pago-pse', {
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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Pago PSE</h2>

          <Inputs Type="1" Place="Nombre" Value={formData.name} onChange={handleChange} name="name" />
          <Inputs Type="2" Place="Correo" Value={formData.email} onChange={handleChange} name="email" />
          <Inputs Type="6" Place="Teléfono" Value={formData.telefono} onChange={handleChange} name="telefono" />
          <Inputs Type="1" Place="Dirección" Value={formData.direccion} onChange={handleChange} name="direccion" />
          <Inputs Type="1" Place="Número de documento" Value={formData.doc_number} onChange={handleChange} name="doc_number" />

          <select name="type_person" value={formData.type_person} onChange={handleChange} required>
            <option value="">Tipo de Persona</option>
            <option value="0">Natural</option>
            <option value="1">Jurídica</option>
          </select>

          <Inputs Type="5" Place="Valor a pagar" Value={formData.value} onChange={handleChange} name="value" />

          <select name="bank" value={formData.bank} onChange={handleChange} required>
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
