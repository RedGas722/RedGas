import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

export const CostumerServices = () => {
  const [user, setUser] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [label, setLabel] = useState('')
  const [solutions, setSolutions] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const data = JSON.parse(localStorage.getItem("data"))

    if (token || data) {

      const labelInfo = data.resultado.etiqueta
      const soluciones = data.resultado.posibles_soluciones

      const solucionesTexto = Array.isArray(soluciones)
        ? soluciones.join('\n')
        : soluciones

      const decoded = jwtDecode(token)
      const userInfo = decoded.data.name
      const phoneInfo = decoded.data.telefono
      const addressInfo = decoded.data.direccion

      setUser(userInfo)
      setPhone(phoneInfo)
      setAddress(addressInfo)
      setLabel(labelInfo)
      setSolutions(solucionesTexto)


    }

  }, [])

  return (
    <section className="h-fit flex flex-wrap justify-center items-center gap-[20px] p-20">
      <div className=" flex flex-col flex-wrap justify-center w-70 NeoContainer_outset_TL p-5">
        <p className="text-[var(--Font-Nav)] text-3xl font-bold">{label}</p>
        <p className="pl-[15px] text-[var(--main-color-sub)] font-bold text-[1.2rem]">{user}</p>
        <p>{address}</p>
        <p>{phone}</p>
        <p className="whitespace-pre-line">{solutions}</p>
      </div>
    </section>
  )
}

export default CostumerServices
