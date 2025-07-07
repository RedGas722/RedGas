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

export const Shopping = () => {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      fetchTotalPrice() // actualizar total
    } catch (err) {
      alert(err.message || "Error al actualizar la cantidad")
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
      icon: <SvgMercadoPago onClick={() => handlePayWithMercadoPago ()} />,
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
                <section className='NeoContainer_outset_TL z-[50] flex gap-[20px] p-[20px_10px] w-[70%] h-fit relative'>
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
                    <section className="flex justify-between w-full">
                      <div className="flex gap-2 items-center">
                        <button className="rounded-full w-6 h-6  bg-red-700 relative z-[50]" onClick={() =>
                          producto.cantidad > 1 &&
                          handleUpdateQuantity(producto.id_producto, producto.cantidad - 1)
                        }>
                          <FontAwesomeIcon icon={faMinus} alt='Agregar' className="text-white" />
                        </button>
                        <span>{producto.cantidad}</span>
                        <button className="rounded-full w-6 h-6  bg-green-700 relative z-[50]" onClick={() =>
                          handleUpdateQuantity(producto.id_producto, producto.cantidad + 1)
                        }>
                          <FontAwesomeIcon icon={faPlus} alt='Quitar' className="text-white" />
                        </button>
                      </div>
                      <div className="flex items-center gap-5">
                        <button
                          className='buttonTL2 NeoSubContainer_outset_TL p-[7px] relative z-[50]'
                          onClick={() => handlePayWithPaypal(subtotal, producto.id_producto)}
                        >
                          Pagar con PayPal
                        </button>
                        <button
                          className='buttonTL2 NeoSubContainer_outset_TL p-[7px] relative z-[50]'
                          onClick={() => handlePayWithMercadoPago(subtotal, producto.id_producto)}
                        >
                          Pagar con MP
                        </button>
                        <button
                          className='buttonTL2 NeoSubContainer_outset_TL p-[7px] relative z-[50]'
                          onClick={() => handleRemoveProduct(producto.id_producto)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </section>
                  </div>

                </section>
              </section>
            </section>
          )
        })}

        <footer className="flex flex-col items-center gap-4">
          {/* <div className='flex justify-center items-center gap-[20px]'>
            <button className='buttonTL2 active:text-[var(--main-color)] font-black NeoSubContainer_outset_TL p-[7px]'>Comprar todo</button>
            <button
              className='buttonTL2 text-white font-black NeoSubContainer_outset_TL p-[7px]'
              onClick={() => handlePayWithPaypal()}
            >
              Pagar Total con PayPal
            </button>
            <button
              className='buttonTL2 text-white font-black NeoSubContainer_outset_TL p-[7px]'
              onClick={() => {
                setPseAmount(totalPrice)
                setShowPseForm(true)
              }}
            >
              Pagar Total con PSE
            </button>
            <button
              className='buttonTL2 text-white font-black NeoSubContainer_outset_TL p-[7px]'
              onClick={handleClearCart}
            >
              Limpiar carrito
            </button>
          </div> */}

          {/* Total del carrito */}
          <p className="text-xl font-semibold text-[var(--main-color)]">
            Total: ${totalPrice.toLocaleString("es-CO")}
          </p>
        </footer>
      </div>
      {/* SpeedDial */}
      <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1, position: 'sticky', bottom: 0, right: 0, zIndex:2 }}>
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
