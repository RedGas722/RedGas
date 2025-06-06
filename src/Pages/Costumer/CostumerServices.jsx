import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const CostumerServices = () => {
  const [user, setUser] = useState('')
  const [phone, setPhone] = useState('')
  // const [address, setAddress] = useState('')
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
      // const addressInfo = decoded.data.direccion

      setUser(userInfo)
      setPhone(phoneInfo)
      // setAddress(addressInfo)
      setLabel(labelInfo)
      setSolutions(solucionesTexto)


    }

  }, [])

  return (
    <section className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
      <div className=" flex flex-col flex-wrap justify-center w-fit NeoContainer_outset_TL p-5">
        <div>
          <p className="text-[var(--Font-Nav)] text-3xl font-bold">{label}</p>
        </div>
        <div className="text-[var(--main-color-sub)] gap-2 flex items-center font-bold w-fit">
          <div>
            <FontAwesomeIcon icon={faUser} className="text-[var(--Font-Nav-shadow)] text-5xl" />
          </div>
          <div className="flex flex-col justify-center font-light leading-[20px]">
            <p className="text-2xl font-bold text-[var(--main-color)]">{user}</p>
            <p className="text-[1rem]">{phone}</p>
            <p className="text-[1rem]">mztytft</p>
          </div>
        </div>
        <p className="max-w-70 whitespace-pre-line">{solutions}</p>
      </div>
    </section>
  )
}

export default CostumerServices
