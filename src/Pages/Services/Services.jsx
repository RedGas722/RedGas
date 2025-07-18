import { faTools, faCheck, faX, faPlug, faGears, faRotate } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import './Services.css'

const URL_IA = 'https://redgas.onrender.com/Diagnostic'
const URL_REDIS = 'https://redgas.onrender.com/ClienteServicesAdd'


export const ServicesInfo = () => {

   const navigate = useNavigate()
   const [description, setDescription] = useState('')

   const handleServices = async (e) => {
      e.preventDefault()

      if (description.length <= 0) {
         alertSendForm(401, 'Por favor, ingresa una descripción de tu necesidad', '')
         return
      } else {
         alertSendForm('wait', 'Enviando información...', '')
         try {
            const res = await fetch(URL_IA, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ descripcion: description }),
            })

            if (!res.ok) {
               throw new Error('Error al enviar a Redis')
            }

            const data = await res.json()
            console.log(data)
            if (!data) {
               console.log(data)
               alertSendForm(502, 'Error al enviar la información', 'Ocurrió un error al enviar la información. Por favor, intenta nuevamente más tarde.')
               return
            }
            const dataInfo = JSON.stringify(data)
            const token = localStorage.getItem('token')

            if (token || dataInfo) {
               sendServicesInfo(token, dataInfo)
            } else {
               navigate('/login')
               alertSendForm(502, 'Error al enviar la información', 'Ocurrió un error al enviar la información.');
            }

         } catch (error) {
            alertSendForm(502, 'Error al enviar la información', 'Ocurrió un error al enviar la información. Por favor, intenta nuevamente más tarde.')
         }
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

         alertSendForm(200, 'Información enviada', 'Hemos recibido tu solicitud y la estamos procesando. Pronto nos pondremos en contacto contigo.');
      } catch (error) {
         alertSendForm(502, 'Error al enviar la información', 'Ocurrió un error al enviar la información. Por favor, intenta nuevamente más tarde.');
      }
   }

   const alertSendForm = (status, title, message) => {

      const MySwal = withReactContent(Swal);
      const descriptionInput = document.getElementById('Description')

      switch (status) {
         case 'wait':
            Swal.fire({
               title: title || 'Procesando...',
               text: message || 'Estamos procesando tu solicitud.',
               allowOutsideClick: false,
               allowEscapeKey: false,
               showConfirmButton: false,
               timerProgressBar: true,
               didOpen: () => Swal.showLoading(),
            });
            break;

         case 200:
            MySwal.fire({
               icon: 'success',
               title: title || 'Información enviada',
               text: message || 'Hemos recibido tu solicitud y la estamos procesando.',
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               showConfirmButton: true,
               confirmButtonText: 'volver a mi servicio',
               customClass: {
                  confirmButton: 'my-confirm-button'
               }
            })
               .then((result) => {
                  if (result.isConfirmed) {
                     navigate('/CostumerMyService')
                  }
               })
            break;

         case 401:
            MySwal.fire({
               html: `
                        <div style="display: flex; align-items: center;">
                           <div style="font-size: 30px; color: #3498db; margin-right: 15px;">
                              ℹ️
                           </div>
                           <div style="text-align: left;">
                              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                                 ${title}
                              </h3>
                           </div>
                        </div>
                        `,
               showConfirmButton: false,
               position: 'top-end',
               width: '350px',
               timer: 2000,
               timerProgressBar: true,
               background: '#ffffff',
            });
            descriptionInput.value = '';
            descriptionInput.style.color = 'var(--main-color)';
            descriptionInput.style.background = '#a9191e14';
            break;

         case 502:
            MySwal.fire({
               icon: 'error',
               title: title || 'Ocurrió un error',
               text: message || 'No pudimos completar tu solicitud. Intenta de nuevo más tarde.',
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               showConfirmButton: true,
               confirmButtonText: 'Cerrar',
            })
               .then((result) => {
                  if (result.isConfirmed) {
                     navigate('/')
                     descriptionInput.value = '';
                  }
               })
            break;

         default:
            MySwal.fire({
               icon: 'error',
               title: title || 'Error inesperado',
               text: message || 'No se pudo procesar tu solicitud. Intenta nuevamente más tarde.',
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               showConfirmButton: true,
               confirmButtonText: 'Cerrar',
               timer: 9000
            })
               .then((result) => {
                  if (result.isConfirmed) {
                     navigate('/login')
                     descriptionInput.value = '';
                  }
               })
            break;
      }
   }


   return (
      <section id="Service" className="flex flex-col gap-8 p-[5px] ">
         <div className="flex flex-col z-[2] text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
            <BtnBack To='/' />
            <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Formulario Servicio</h2>
         </div>

         <section className="AI_history gap-4 flex flex-col-reverse items-center md:flex-row md:justify-evenly h-fit w-full">
            <div className="w-[300px] md:w-[400px] lg:w-[400px] flex-col gap-4 flex items-center NeoContainer_outset_TL h-full overflow-y-auto p-[10px_8px]">
               <h2 className="font-bold text-3xl text-[var(--main-color)]">Servicios</h2>
               <div className="w-[350px] flex p-[0_10px_25px_0] items-center flex-col gap-2 ">

                  <div className="NeoSubContainer_outset_TL w-[250px] lg:w-[350px] p-[10px]">
                     <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                        <FontAwesomeIcon icon={faPlug} className="text-[var(--Font-Nav)]" />
                        <h3 className="text-[17px] font-bold">Instalación</h3>
                     </div>
                     <p className="text-[13px] pl-2 text-[var(--main-color)]">
                        Servicio que implica la conexión inicial de equipos o sistemas, como estufas o calentadores, asegurando su correcto funcionamiento.
                     </p>
                     <div className="pl-[3px] mt-2">
                     </div>
                  </div>

                  <div className="NeoSubContainer_outset_TL w-[250px] lg:w-[350px] p-[10px]">
                     <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                        <FontAwesomeIcon icon={faGears} className="text-[var(--Font-Nav)]" />
                        <h3 className="text-[17px] font-bold">Reparación</h3>
                     </div>
                     <p className="text-[13px] text-[var(--main-color)] pl-2">
                        Servicio destinado a corregir fallas o daños en equipos ya instalados para devolverlos a su estado funcional.
                     </p>
                  </div>

                  <div className="NeoSubContainer_outset_TL w-[250px] lg:w-[350px] p-[10px]">
                     <div className="flex items-center gap-2 text-[var(--Font-Nav)]">
                        <FontAwesomeIcon icon={faTools} className="text-[var(--Font-Nav)]" />
                        <h3 className="text-[17px] font-bold">Mantenimiento</h3>
                     </div>
                     <p className="text-[13px] text-[var(--main-color)] pl-2">
                        Servicio preventivo que busca conservar el buen estado de los equipos mediante revisiones periódicas.
                     </p>
                  </div>

               </div>
            </div>
            <form
               onSubmit={handleServices}
               className="w-full max-w-xl p-6 z-[2] flex flex-col gap-3 NeoContainer_outset_TL"
            >
               <div>
                  <p className="text-[18px] font-medium text-[var(--main-color)]">
                     Ingrese una descripción de su necesidad
                  </p>
                  <p className="text-sm text-[var(--main-color-sub)]">
                     Hacemos instalaciones, reparaciones y mantenimientos.
                  </p>
               </div>

               <textarea
                  id="Description"
                  placeholder="Ej: Mi estufa ya no enciende..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full h-32 p-4 overflow-auto !rounded-[10px] NeoSubContainer_outset_TL outline-none resize-none text-[var(--Font-Nav-shadow)]"
               />
               <div className="flex justify-center items-center">
                  <Buttons type="submit" radius='10' nameButton="enviar" />
               </div>
            </form>
         </section>
      </section>
   )
}

export default ServicesInfo
