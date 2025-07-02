import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const PsePaymentForm = ({ monto, onClose }) => {
  const [bancos, setBancos] = useState([]);

  useEffect(() => {
    const cargarBancos = async () => {
      try {
        const res = await fetch("https://redgas.onrender.com/ListarBancosPsE");
        const data = await res.json();
        setBancos(data);
      } catch (err) {
        console.error("Error cargando bancos PSE:", err);
      }
    };
    cargarBancos();
  }, []);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [formData, setFormData] = useState({
    bank: '',
    invoice: `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // factura única
    value: monto,  
    doc_type: 'CC',
    doc_number: '',
    type_person: '0'
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const user = decoded?.data;

      setUserData({
        name: user?.name || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        direccion: user?.direccion || ''
      });

      setFormData(prev => ({
        ...prev,
        value: monto  
      }));
    }
  }, [monto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDireccionChange = (e) => {
    const { value } = e.target;
    setUserData(prev => ({ ...prev, direccion: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para pagar con PSE");
      return;
    }

    try {
      const payload = {
        ...formData,
        name: userData.name,
        email: userData.email,
        cellphone: userData.telefono,
        direccion: userData.direccion   
      };

      const response = await fetch('https://redgas.onrender.com/PagoPSE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.log("Respuesta del backend:", data);

      // ⚠ ePayco devuelve el enlace de banco en data.data.urlbanco
      if (data?.success && data?.data?.urlbanco) {
        window.location.href = data.data.urlbanco;
      } else {
        alert(data?.text_response || 'Error al generar el pago');
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

          <div className="mb-2">
            <p className="font-semibold mb-1">Nombre:</p>
            <p>{userData.name}</p>
          </div>

          <div className="mb-2">
            <p className="font-semibold mb-1">Correo:</p>
            <p>{userData.email}</p>
          </div>

          <div className="mb-2">
            <p className="font-semibold mb-1">Teléfono:</p>
            <p>{userData.telefono}</p>
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Dirección"
              name="direccion"
              value={userData.direccion}
              onChange={handleDireccionChange}
              required
              className="border rounded p-2 w-full"
            />
          </div>

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

          <div className="mb-2">
            <p className="font-semibold mb-1">Valor a pagar:</p>
            <p>{formData.value} COP</p>
          </div>

          <select
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Selecciona tu banco</option>
            {bancos.map((banco) => (
              <option key={banco.bankCode} value={banco.bankCode}>
                {banco.bankName}
              </option>
            ))}
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
