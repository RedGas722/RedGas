import { useState, useRef, useEffect } from 'react';

export const useBuscarFacturas = (clientes, empleados, facturasOriginal, setFacturas) => {
  const [clienteCorreoBusqueda, setClienteCorreoBusqueda] = useState('');
  const [empleadoBusqueda, setEmpleadoBusqueda] = useState('');
  const [clienteSugerencias, setClienteSugerencias] = useState([]);
  const [empleadoSugerencias, setEmpleadoSugerencias] = useState([]);

  const contenedorRefCliente = useRef(null);
  const contenedorRefEmpleado = useRef(null);

  const handleClienteInput = (texto) => {
    setClienteCorreoBusqueda(texto);
    if (texto.trim() === '') {
      setClienteSugerencias([]);
      return;
    }
    const sugerencias = clientes.filter(c =>
      c.correo_cliente.toLowerCase().includes(texto.toLowerCase()) ||
      c.nombre_cliente.toLowerCase().includes(texto.toLowerCase())
    );
    setClienteSugerencias(sugerencias.slice(0, 5));
  };

  const handleEmpleadoInput = (texto) => {
    setEmpleadoBusqueda(texto);
    if (texto.trim() === '') {
      setEmpleadoSugerencias([]);
      return;
    }
    const sugerencias = empleados.filter(e =>
      e.nombre_empleado.toLowerCase().includes(texto.toLowerCase()) ||
      e.correo_empleado.toLowerCase().includes(texto.toLowerCase())
    );
    setEmpleadoSugerencias(sugerencias.slice(0, 5));
  };

  const handleBuscar = () => {
    let resultado = [...facturasOriginal];

    if (clienteCorreoBusqueda.trim() !== '') {
      const clienteEncontrado = clientes.find(
        (c) =>
          c.correo_cliente.toLowerCase() === clienteCorreoBusqueda.trim().toLowerCase() ||
          c.nombre_cliente.toLowerCase() === clienteCorreoBusqueda.trim().toLowerCase()
      );
      if (clienteEncontrado) {
        resultado = resultado.filter((f) => f.id_cliente === clienteEncontrado.id_cliente);
      } else {
        resultado = [];
      }
    }

    if (empleadoBusqueda.trim() !== '') {
      const empleadoEncontrado = empleados.find(
        (e) =>
          e.nombre_empleado.toLowerCase() === empleadoBusqueda.trim().toLowerCase() ||
          e.correo_empleado.toLowerCase() === empleadoBusqueda.trim().toLowerCase()
      );
      if (empleadoEncontrado) {
        resultado = resultado.filter((f) => f.id_empleado === empleadoEncontrado.id_empleado);
      } else {
        resultado = [];
      }
    }

    setFacturas(resultado);
  };

  const handleLimpiar = () => {
    setClienteCorreoBusqueda('');
    setEmpleadoBusqueda('');
    setClienteSugerencias([]);
    setEmpleadoSugerencias([]);
    setFacturas(facturasOriginal);
  };

  const handleClickOutside = (e) => {
    if (contenedorRefCliente.current && !contenedorRefCliente.current.contains(e.target)) {
      setClienteSugerencias([]);
    }
    if (contenedorRefEmpleado.current && !contenedorRefEmpleado.current.contains(e.target)) {
      setEmpleadoSugerencias([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    clienteCorreoBusqueda, empleadoBusqueda,
    clienteSugerencias, empleadoSugerencias,
    handleClienteInput, handleEmpleadoInput,
    handleBuscar, handleLimpiar,
    contenedorRefCliente, contenedorRefEmpleado,
    setClienteCorreoBusqueda, setEmpleadoBusqueda
  };
};
