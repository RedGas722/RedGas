import { useState } from "react"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { useNavigate } from "react-router-dom"
import './Services.css'

const URL_IA = 'https://redgas.onrender.com/Diagnostic'
const URL_REDIS = 'https://redgas.onrender.com/ClienteServicesAdd'


export const ServicesInfo = () => {

   const navigate = useNavigate()
   const [description, setDescription] = useState('')

   const handleServices = async (e) => {
      e.preventDefault()
      try {
         const res = await fetch(URL_IA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion: description }),
         })

         const data = await res.json()
         const datainfo = JSON.stringify(data)
         const token = localStorage.getItem('token')

         if (token || datainfo) {
            sendServicesInfo(token, datainfo)
            alert('Información enviada correctamente')
            navigate('/CostumerMyServices')
         } else {
            alert('Error: No se pudo enviar la información. Por favor, inténtalo de nuevo más tarde.')
         }

      } catch (error) {
         console.error('Error al enviar la solicitud:', error)
      }
   }

   const sendServicesInfo = async (token, datainfo) => {
      try {
         const response = await fetch(URL_REDIS, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ itemInfo: datainfo }),
         })

         if (!response.ok) {
            throw new Error('Error al enviar a Redis')
         }


      } catch (error) {
         console.error('Error al enviar a Redis:', error)
      }
   }



   return (
      <>
         <div>
            <h2 className="font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5 text-shadow">Formulario Servicio</h2>
            <div className='btnDown'>
               <BtnBack To='/' />
            </div>
         </div>
         <section className="h-fit flex flex-wrap justify-center items-center gap-[20px] p-20">
            <form onSubmit={handleServices}>
               <p>ingrese aqui una descripcion de su necesidad - hacemos instalaciones/reparaciones/mantenimiento/otros </p>
               <textarea ForID='Description' placeholder="mi estufa ya no enciende..." value={description} onChange={e => setDescription(e.target.value)} />
               <Buttons type="submit" nameButton="enviar" />
            </form>
         </section>
      </>
   )
}

export default ServicesInfo
