import { useState } from "react"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { useNavigate } from "react-router-dom"
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

            const data = await res.json()
            const datainfo = JSON.stringify(data)
            const token = localStorage.getItem('token')

            if (token || datainfo) {
               sendServicesInfo(token, datainfo)
            } else {
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
               title: 'Procesando...',
               text: message || 'Estamos procesando tu solicitud.',
               allowOutsideClick: false,
               allowEscapeKey: false,
               showConfirmButton: false,
               timer: 6000,
               timerProgressBar: true,
               didOpen: () => {
                  Swal.showLoading();
               },
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
                     navigate('/CostumerMyServices')
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
            descriptionInput.style.border = '2px solid #FF0000';
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
               timer: 9000
            })
               .then((result) => {
                  if (result.isConfirmed) {
                     navigate('/')
                     passwordInput.value = ''
                     confirmPasswordInput.value = ''
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
                     navigate('/')
                     descriptionInput.value = '';
                  }
               })
            break;
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
