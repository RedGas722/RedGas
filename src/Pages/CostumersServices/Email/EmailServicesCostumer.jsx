import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import withReactContent from 'sweetalert2-react-content';
import emailjs from '@emailjs/browser'
import Swal from 'sweetalert2';

const URL_GET = 'https://redgas.onrender.com/ClienteServicesGet'

export const EmailServicesCostumer = (id) => {
   const [user, setUser] = useState('')
   const [phone, setPhone] = useState('')
   const [email, setEmail] = useState('')
   const [address, setAddress] = useState('')
   const [label, setLabel] = useState('')
   const navigate = useNavigate()

   useEffect(() => {

      const fetchData = async () => {
         try {
            const response = await fetch(`${URL_GET}`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ userId: id }),
            })

            if (!response.ok) {
               throw new Error('Error fetching data')
            }

            const datainfo = await response.json()

            const firstParse = JSON.parse(datainfo.get)
            const secondParse = JSON.parse(JSON.parse(firstParse.item))

            setUser(firstParse.userName)
            setPhone(firstParse.userPhone)
            setEmail(firstParse.userEmail)
            setAddress(firstParse.userAddress)
            setLabel(secondParse.resultado.etiqueta)

            handleForgotPassword()
         } catch (error) {
            console.error('Error:', error)
         }
      }
      fetchData()

   }, [])

   const handleForgotPassword = async () => {

      const serviceId = 'service_82gyxy6'
      const templateId = 'template_fwkby0l'
      const publicKey = 'SHHYhi-xHJeCovrBP'

      try {
         const templateParams = {
            to_email: email,
            company: 'RED-GAS',
            user: user || 'Usuario',
            message: `Hola ${user},

               Te informamos que tu solicitud de servicio ha sido aceptada por uno de nuestros técnicos.

               🛠️ Tipo de servicio: ${label}
               📍 Dirección registrada: ${address}
               📞 Teléfono de contacto: ${phone}

               Un técnico especializado se comunicará contigo muy pronto para iniciar el proceso. Te recomendamos estar atento(a) a tu teléfono o correo electrónico.

               Gracias por confiar en RedGas, trabajamos para brindarte un servicio rápido, seguro y profesional.

               —
               RedGas Soporte Técnico
               www.redgas.com
               servicioalcliente@redgas.com
               📞 Línea de atención: 01-8000-000-000`,
            link: ``,
         }

         alertSendForm('wait', 'Enviando correo de recuperación...')
         emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then(() => {
               alertSendForm(
                  200,
                  '¡Correo de recuperación enviado!',
                  'Hemos enviado un enlace a tu correo electrónico para que puedas restablecer tu contraseña.'
               );
               setTimeout(() => {
                  navigate('/Login');
               }, 4000);
            })
            .catch(() => {
               alertSendForm(
                  402,
                  'No se pudo enviar el correo',
                  'Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.'
               );
            });

      } catch {
         alertSendForm(
            401,
            'Correo no encontrado',
            ''
         );
      }

};

const alertSendForm = (status, title, message) => {

   const MySwal = withReactContent(Swal);
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
            title: title || 'Correo enviado',
            text: message || 'Hemos enviado el enlace de recuperación a tu correo electrónico.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
         });
         emailinput.value = ''
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
                                ${title || 'Correo no encontrado'}
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

         emailinput.style.border = '2px solid #FF0000'
         emailinput.value = ''
         break;

      case 402:
         MySwal.fire({
            icon: 'warning',
            title: title || 'Error al enviar el correo',
            text: message || 'Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.',
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
            timerProgressBar: true,
            timer: 4000
         });
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
                  emailinput.value = ''
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
            confirmButtonText: 'Cerrar'
         })
            .then((result) => {
               if (result.isConfirmed) {
                  navigate('/')
                  emailinput.value = ''
               }
            })
         break;

   }
}

}
export default EmailServicesCostumer

