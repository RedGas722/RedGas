import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // corregí la importación

const bancosLocal = [
  { codigo: "1001", nombre: "BANCO DE BOGOTA" },
  { codigo: "1002", nombre: "BANCO POPULAR" },
  { codigo: "1006", nombre: "BANCO ITAU" },
  { codigo: "1007", nombre: "BANCOLOMBIA" },
  { codigo: "1009", nombre: "CITIBANK" },
  { codigo: "1012", nombre: "BANCO GNB SUDAMERIS" },
  { codigo: "1013", nombre: "BANCO BBVA COLOMBIA S.A" },
  { codigo: "1019", nombre: "SCOTIABANK COLPATRIA" },
  { codigo: "1023", nombre: "BANCO DE OCCIDENTE" },
  { codigo: "1032", nombre: "BANCO CAJA SOCIAL" },
  { codigo: "1040", nombre: "BANCO AGRARIO" },
  { codigo: "1047", nombre: "BANCO MUNDO MUJER S.A." },
  { codigo: "1051", nombre: "BANCO DAVIVIENDA" },
  { codigo: "1052", nombre: "BANCO AV VILLAS" },
  { codigo: "1058", nombre: "BANCO PROCREDIT" },
  { codigo: "1059", nombre: "BANCAMIA S.A" },
  { codigo: "1060", nombre: "BANCO PICHINCHA S.A" },
  { codigo: "1061", nombre: "BANCOOMEVA S.A." },
  { codigo: "1062", nombre: "BANCO FALABELLA" },
  { codigo: "1063", nombre: "BANCO FINANDINA S.A. BIC" },
  { codigo: "1065", nombre: "BANCO SANTANDER COLOMBIA" },
  { codigo: "1066", nombre: "BANCO COOPERATIVO COOPCENTRAL" },
  { codigo: "1069", nombre: "BANCO SERFINANZA" },
  { codigo: "1070", nombre: "LULO BANK" },
  { codigo: "1071", nombre: "JP MORGAN" },
  { codigo: "1097", nombre: "DALE" },
  { codigo: "1151", nombre: "RAPPIPAY DAVIPLATA" },
  { codigo: "1283", nombre: "CFA COOPERATIVA FINANCIERA" },
  { codigo: "1286", nombre: "JFK COOPERATIVA FINANCIERA" },
  { codigo: "1289", nombre: "COTRAFA" },
  { codigo: "1291", nombre: "COOFINEP COOPERATIVA FINANCIERA" },
  { codigo: "1292", nombre: "CONFIAR COOPERATIVA FINANCIERA" },
  { codigo: "1303", nombre: "BANCO UNION antes GIROS" },
  { codigo: "1370", nombre: "COLTEFINANCIERA" },
  { codigo: "1507", nombre: "NEQUI" },
  { codigo: "1551", nombre: "DAVIPLATA" },
  { codigo: "1558", nombre: "BANCO CREDIFINANCIERA" },
  { codigo: "1637", nombre: "IRIS" },
  { codigo: "1801", nombre: "MOVII S.A." },
  { codigo: "1804", nombre: "UALÁ" },
  { codigo: "1809", nombre: "NU. COLOMBIA COMPAÑIA DE FINANCIAMIENTO S.A." },
  { codigo: "1811", nombre: "RAPPIPAY" },
  { codigo: "1815", nombre: "ALIANZA FIDUCIARIA" },
  { codigo: "1816", nombre: "CREZCAMOS S.A. COMPAÑÍA DE FINANCIAMIENTO" },
];

const PsePaymentForm = ({ monto, onClose }) => {
  const [bancos, setBancos] = useState(bancosLocal); // usa lista local directamente

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [formData, setFormData] = useState({
    bank: '',
    invoice: `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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

    // Validar banco seleccionado contra lista local fija
    const bancoValido = bancos.find(b => b.codigo === formData.bank);
    if (!bancoValido) {
      alert("El banco seleccionado no es válido o ha cambiado.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para pagar con PSE");
      return;
    }

    try {
      const payload = {
        bank: String(formData.bank),
        invoice: formData.invoice,
        value: formData.value,
        doc_type: formData.doc_type,
        doc_number: formData.doc_number,
        type_person: formData.type_person,
        name: userData.name,
        email: userData.email,
        telefono: userData.telefono,
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
      console.log(data)
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

          <select
            name="doc_type"
            value={formData.doc_type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Selecciona tipo de documento</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="NIT">NIT</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="PP">Pasaporte</option>
          </select>

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
              <option key={banco.codigo} value={banco.codigo}>
                {banco.nombre}
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
