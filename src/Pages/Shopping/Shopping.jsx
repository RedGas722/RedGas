import { useEffect, useState } from "react"
import { Header } from '../../Layouts/Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faMoneyBills, faTrash } from '@fortawesome/free-solid-svg-icons'
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { SvgPayPal } from "../../UI/Svg/SvgPayPal"
import SvgMercadoPago from "../../UI/Svg/SvgMP"
import BtnBack from "../../UI/Login_Register/BtnBack"
import { Buttons } from "../../UI/Login_Register/Buttons"

export const Shopping = () => {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inputQuantities, setInputQuantities] = useState({}) // Estado para manejar los valores de los inputs
  const token = localStorage.getItem("token")

  const fetchProducts = async () => {
    try {
      if (!token) {
        setError("Debes iniciar sesión para ver el carrito")
        setLoading(false)
        return
      }

      const resCart = await fetch("https://redgas.onrender.com/CartGet", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!resCart.ok) throw new Error("Error al obtener el carrito")

      const cartData = await resCart.json()

      const productDetails = await Promise.all(
        cartData.map(async (item) => {
          const res = await fetch(`https://redgas.onrender.com/ProductoGetById?id_producto=${encodeURIComponent(item.productId)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          })

          if (!res.ok) throw new Error(`Error al obtener el producto: ${item.productName}`)

          const data = await res.json()
          const productData = data.data

          return {
            ...productData,
            cantidad: item.quantity
          }
        })
      )
      console.log("Productos obtenidos:", productDetails)
      setProducts(productDetails)

      // Inicializar los valores de los inputs con las cantidades actuales
      const initialQuantities = {}
      productDetails.forEach(product => {
        initialQuantities[product.id_producto] = product.cantidad
      })
      setInputQuantities(initialQuantities)

    } catch (err) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalPrice = async () => {
    try {
      const res = await fetch("https://redgas.onrender.com/CartTotal", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("No se pudo obtener el total del carrito")

      const data = await res.json()
      setTotalPrice(data.total)
    } catch (err) {
      console.error("Error al obtener el total:", err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchTotalPrice()
  }, [])

  const handleRemoveProduct = async (productId) => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para eliminar productos")
        return
      }

      const res = await fetch("https://redgas.onrender.com/CartRemove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })

      if (!res.ok) throw new Error("No se pudo eliminar el producto del carrito")

      setProducts((prev) => prev.filter(p => p.id_producto !== productId))
      // Limpiar el input quantity del producto eliminado
      setInputQuantities(prev => {
        const newQuantities = { ...prev }
        delete newQuantities[productId]
        return newQuantities
      })
      fetchTotalPrice() // actualizar total
    } catch (err) {
      alert(err.message || "Error al eliminar el producto")
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const producto = products.find(p => p.id_producto === productId)
      if (!producto) {
        alert("Producto no encontrado")
        return
      }

      if (newQuantity > producto.stock && newQuantity > producto.cantidad) {
        alert(`No puedes agregar más de ${producto.stock} unidades. Stock máximo alcanzado.`);
        return;
      }

      if (newQuantity < 1) {
        alert("La cantidad mínima es 1.")
        return
      }

      const res = await fetch("https://redgas.onrender.com/CartUpdateQuantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      })

      if (!res.ok) throw new Error("No se pudo actualizar la cantidad")

      setProducts((prev) =>
        prev.map((p) =>
          p.id_producto === productId ? { ...p, cantidad: newQuantity } : p
        )
      )

      // Actualizar el valor del input
      setInputQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }))

      fetchTotalPrice() // actualizar total
    } catch (err) {
      alert(err.message || "Error al actualizar la cantidad")
    }
  }

  // Función para manejar el cambio en el input
  const handleInputChange = (productId, value) => {
    const numericValue = parseInt(value) || 0
    setInputQuantities(prev => ({
      ...prev,
      [productId]: numericValue
    }))
  }

  // Función para aplicar la cantidad del input
  const handleApplyQuantity = (productId) => {
    const newQuantity = inputQuantities[productId]
    if (newQuantity && newQuantity > 0) {
      handleUpdateQuantity(productId, newQuantity)
    }
  }

  // Función para manejar Enter en el input
  const handleInputKeyPress = (e, productId) => {
    if (e.key === 'Enter') {
      handleApplyQuantity(productId)
    }
  }

  const handleClearCart = async () => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para limpiar el carrito")
        return
      }

      const res = await fetch("https://redgas.onrender.com/CartClear", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("No se pudo limpiar el carrito")

      setProducts([])
      setInputQuantities({})
      setTotalPrice(0)
    } catch (err) {
      alert(err.message || "Error al limpiar el carrito")
    }
  }

  const handlePayWithPaypal = async (monto = totalPrice, productId = null) => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para pagar con PayPal")
        return
      }

      const body = {
        cantidad: monto.toFixed(0),
        referencia: `ORD-${Date.now()}`
      }

      const res = await fetch("https://redgas.onrender.com/PagoPaypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.errorInfo || "Error al iniciar el pago")

      const approvalLink = data.data.links.find(link => link.rel === "approve")

      if (!approvalLink) throw new Error("No se encontró el link de aprobación de PayPal")

      // Aquí es donde guardamos el id del producto (si es un pago individual)
      if (productId) {
        localStorage.setItem("paypal_productId", productId)
      } else {
        localStorage.removeItem("paypal_productId") // limpiar si es pago total
      }

      window.location.href = approvalLink.href

    } catch (error) {
      console.error("Error al pagar con PayPal:", error)
      alert("Ocurrió un error al iniciar el pago con PayPal")
    }
  }

  const handlePayWithMercadoPago = async (monto = totalPrice, productId = null) => {
    try {
      if (!token) {
        alert("Debes iniciar sesión para pagar con Mercado Pago");
        return;
      }

      const body = {
        cantidad: monto.toFixed(0),
        referencia: `ORD-MP-${Date.now()}`
      };

      const res = await fetch("https://redgas.onrender.com/PagoMP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.errorInfo || "Error al iniciar el pago");

      if (!data.init_point) throw new Error("No se recibió el enlace de pago de Mercado Pago");

      // Guardar producto si es pago individual
      if (productId) {
        localStorage.setItem("mp_productId", productId);
      } else {
        localStorage.removeItem("mp_productId");
      }

      window.location.href = data.init_point;

    } catch (error) {
      console.error("Error al pagar con Mercado Pago:", error);
      alert("Ocurrió un error al iniciar el pago con Mercado Pago");
    }
  };

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>Error: {error}</p>

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faTrash} alt='Agregar' onClick={handleClearCart} className="text-[var(--Font-Nav2)] text-2xl" />,
      name: 'Limpiar carrito'
    },
    {
      icon: <SvgMercadoPago onClick={() => handlePayWithMercadoPago()} />,
      name: "Pagar con Mercado Pago"
    },
    {
      icon: <SvgPayPal onClick={() => handlePayWithPaypal()} />,
      name: 'Pagar con PayPal'
    },
  ]

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <section className='Distribution'>
      {/* <Header /> */}
      <div className="flex flex-col gap-[80px] text-[var(--main-color)] MainPageContainer">
        <BtnBack To='/' />

        {products.length === 0 && <p>No hay productos para mostrar.</p>}

        {products.map((producto, index) => {
          const descuento = Number(producto.descuento) || 0
          const precioUnidad = Number(producto.precio_producto) || 0
          const precioConDescuento = precioUnidad * (1 - descuento / 100)
          const subtotal = precioConDescuento * producto.cantidad

          return (
            <section key={index}>
              <section className='flex justify-center gap-[20px]'>
                <section className='NeoContainer_outset_TL z-[50] flex gap-[20px] flex-wrap items-center justify-center p-[20px_10px] w-[70%] h-fit relative'>
                  <div>
                    <img
                      src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : "https://via.placeholder.com/150"}
                      alt={producto.nombre_producto}
                      className='w-[150px] rounded-[20px]'
                    />
                  </div>
                  <div className='flex flex-col justify-center w-[80%] items-start gap-[10px]'>
                    <h2 className='text-2xl font-bold'>{producto.nombre_producto}</h2>
                    <div className="flex flex-col gap-1">
                      <div className='font-medium flex items-center gap-2 text-[var(--main-color)]'>
                        <p className="font-bold">Precio Unidad: <span className="font-normal"> ${precioConDescuento.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} </span> </p>
                        {descuento > 0 && (
                          <span className="text-sm text-green-600">
                            ({descuento}% OFF)
                          </span>
                        )}
                      </div>
                      <div className='text-[var(--main-color)]'>
                        <p className="font-bold">Subtotal: <span className="font-normal"> ${subtotal.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} </span></p>
                      </div>
                    </div>
                    <p className='text-[var(--main-color-sub)] font-bold'>Descripción: <span className="font-normal"> {producto.descripcion_producto || "Sin descripción disponible."} </span> </p>
                    <p className='text-[var(--main-color-sub)]'>Cantidad: {producto.cantidad}</p>

                    {/* Sección mejorada para control de cantidad */}
                    <section className="flex justify-between flex-wrap w-full">
                      <div className="flex gap-3 items-center flex-wrap">
                        {/* Botones de incremento/decremento */}
                        <div className="flex gap-2 items-center flex-wrap">
                          <button
                            className="rounded-full w-8 h-8 bg-red-700 hover:bg-red-600 transition-colors relative z-[50]"
                            onClick={() => producto.cantidad > 1 && handleUpdateQuantity(producto.id_producto, producto.cantidad - 1)}
                          >
                            <FontAwesomeIcon icon={faMinus} alt='Disminuir' className="text-white" />
                          </button>

                          {/* <div className="flex gap-2 items-center ml-4"> */}
                          <input
                            type="number"
                            min="1"
                            max={producto.stock}
                            value={inputQuantities[producto.id_producto] || ''}
                            onChange={(e) => handleInputChange(producto.id_producto, e.target.value)}
                            onKeyPress={(e) => handleInputKeyPress(e, producto.id_producto)}
                            className="w-16 h-8 border border-gray-300 rounded px-2 text-center text-[var(--main-color)] bg-white focus:outline-none focus:border-blue-500"
                            placeholder={producto.cantidad.toString()}
                          />
                          <button
                            className="rounded-full w-8 h-8 bg-green-700 hover:bg-green-600 transition-colors relative z-[50]"
                            onClick={() => handleUpdateQuantity(producto.id_producto, producto.cantidad + 1)}
                          >
                            <FontAwesomeIcon icon={faPlus} alt='Aumentar' className="text-white" />
                          </button>
                          <Buttons
                            nameButton='Aplicar'
                            borderColor='var(--Font-Nav)'
                            height='40px'
                            borderWidth='1'
                            onClick={() => handleApplyQuantity(producto.id_producto)}
                            width='40px'
                          />
                        </div>



                        {/* Mostrar stock disponible */}
                        <span className="text-sm text-[var(--main-color-sub)] ml-2">
                          (Stock: {producto.stock})
                        </span>
                      </div>

                      <div className="flex items-center gap-5 flex-wrap">
                        <Buttons
                          nameButton='Pagar con PayPal'
                          borderColor='var(--Font-Nav)'
                          height='40px'
                          borderWidth='1'
                          onClick={() => handlePayWithPaypal(subtotal, producto.id_producto)}
                          width='fit-content'
                          padding='10px'
                        />
                        <Buttons
                          nameButton='Pagar con MP'
                          borderColor='var(--Font-Nav)'
                          height='40px'
                          borderWidth='1'
                          onClick={() => handlePayWithMercadoPago(subtotal, producto.id_producto)}
                          width='fit-content'
                          padding='10px'
                        />
                        <Buttons
                          nameButton='Eliminar'
                          borderColor='var(--Font-Nav2)'
                          textColor='var(--Font-Nav2)'
                          height='40px'
                          borderWidth='1'
                          onClick={() => handleRemoveProduct(producto.id_producto)}
                          width='fit-content'
                          padding='10px'
                        />
                      </div>
                    </section>
                  </div>
                </section>
              </section>
            </section>
          )
        })}

        <div className="flex flex-col items-center gap-4">
          {/* Total del carrito */}
          <p className="text-xl font-semibold text-[var(--main-color)]">
            Total: ${totalPrice.toLocaleString("es-CO")}
          </p>
        </div>
      </div>

      {/* SpeedDial */}
      <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', bottom: 0, right: 0, zIndex: 2 }}>
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          FabProps={{
            sx: {
              bgcolor: 'var(--main-color)',
              color: 'white',
              '&:hover': {
                bgcolor: 'var(--main-color-sub)',
              },
            },
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={<span style={{ whiteSpace: 'nowrap' }}>{action.name}</span>}
              tooltipOpen
              onClick={handleClose}
            />
          ))}
        </SpeedDial>
      </Box>
    </section>
  )
}

export default Shopping