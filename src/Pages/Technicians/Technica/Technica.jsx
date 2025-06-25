import { faUser, faTools, faPlug, faGears, faQuestion } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Buttons } from "../../../UI/Login_Register/Buttons"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BtnBack from "../../../UI/Login_Register/BtnBack"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const URL_GET_TECHNICIAN = 'http://localhost:10101/TecnicoServicesGet'
const URL_DELETE_TECHNICIAN = 'http://localhost:10101/TecnicoServicesDelete'
const URL_GET_COSTUMER = 'https://redgas.onrender.com/ClienteServicesGet'
const URL_DELETE_COSTUMER = 'http://localhost:10101/ClienteServicesDelete'
const URL_REGISTER_SERVICES = 'http://localhost:10101/PedidoServicioRegister'

const style = {
  position: 'relative',
  boxShadow: 24,
  padding: '16px',
  borderRadius: '24px',
}

export const Technica = () => {
  const [costumerId, setCostumerId] = useState('')
  const [technicianId, setTechnicianId] = useState('')
  const [user, setUser] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [services, setServices] = useState({})
  const [isScrollable, setIsScrollable] = useState(false)
  const accordionRef = useRef(null)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/CostumerServices')
      return
    }

    const decode = jwtDecode(token)
    const id = decode.data.id
    setTechnicianId(id)

    const fetchData = async () => {
      try {
        const res = await fetch(`${URL_GET_TECHNICIAN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ technicianId: id }),
        })

        if (!res.ok) throw new Error('Error al obtener el servicio del técnico')

        const dataInfo = await res.json()

        if (!dataInfo.get) {
          navigate('/CostumerServices')
          return
        }

        const firstParse = JSON.parse(dataInfo.get)
        await costumerGet(firstParse.userid)
      } catch (err) {
        alertSendForm(502, 'Error al obtener datos del técnico', err.message)
      }
    }

    fetchData()
  }, [navigate, token])

  const costumerGet = async (costumerId) => {
    try {
      const respon = await fetch(`${URL_GET_COSTUMER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: costumerId }),
      })

      if (!respon.ok) throw new Error('Error al obtener datos del cliente')

      const data = await respon.json()
      const firstParse = JSON.parse(data.get)
      const secondParse = JSON.parse(JSON.parse(firstParse.item))

      setCostumerId(costumerId)
      setUser(firstParse.userName)
      setPhone(firstParse.userPhone)
      setAddress(firstParse.userAddress)
      setEmail(firstParse.userEmail)
      setDescription(secondParse.resultado.etiqueta)
      setServices(secondParse.resultado)
    } catch (err) {
      alertSendForm(502, 'Error al obtener datos del cliente', err.message)
    }
  }

  const handleDoneServices = async () => {
    const confirmed = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto marcará el servicio como finalizado.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#19A9A4',
      confirmButtonText: 'Sí, terminar',
      cancelButtonText: 'Cancelar',
    })
    if (!confirmed.isConfirmed) return

    alertSendForm('wait', 'Finalizando servicio...', 'Estamos procesando tu solicitud')
    try {
      const response = await fetch(`${URL_REGISTER_SERVICES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: costumerId,
          id_tecnico: technicianId,
          estado_pedido: 'finalizado'
        }),
      })

      if (!response.ok) throw new Error('Error registrando el servicio')

      const data = await response.json()
      if (!data.get) {
        alertSendForm(200, 'Servicio finalizado', 'El servicio fue marcado como finalizado.')
        handleDeleteServices()
      }
    } catch (err) {
      alertSendForm(502, 'Error al finalizar servicio', err.message)
    }
  }

  const handleDeleteServices = async () => {
    alertSendForm('wait', 'Limpiando servicios...', 'Eliminando información del cliente y técnico...')
    try {
      const resDeleteCostumer = await fetch(`${URL_DELETE_COSTUMER}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: costumerId }),
      })

      const resDeleteTechnician = await fetch(`${URL_DELETE_TECHNICIAN}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: technicianId }),
      })

      if (!resDeleteCostumer.ok || !resDeleteTechnician.ok)
        throw new Error('Error eliminando servicios')

      alertSendForm(200, 'Servicio finalizado', 'Los datos fueron eliminados correctamente.')
      navigate('/')
    } catch (err) {
      alertSendForm(502, 'Error al limpiar servicios', err.message)
    }
  }

  const handleCancelServices = async () => {
    const confirmed = await Swal.fire({
      title: '¿Cancelar servicio?',
      text: 'Esta acción cancelará tu servicio actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A9191E',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    })
    if (!confirmed.isConfirmed) return

    alertSendForm('wait', 'Cancelando servicio...', 'Estamos procesando tu solicitud')
    try {
      const resDeleteTechnician = await fetch(`${URL_DELETE_TECHNICIAN}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: technicianId }),
      })

      if (!resDeleteTechnician.ok)
        throw new Error('Error cancelando servicio')

      alertSendForm(200, 'Servicio cancelado', 'El servicio fue cancelado correctamente.')
      navigate('/CostumerServices')
    } catch (err) {
      alertSendForm(502, 'Error al cancelar servicio', err.message)
    }
  }

  useEffect(() => {
    const checkHeight = () => {
      if (accordionRef.current) {
        setIsScrollable(accordionRef.current.offsetHeight > 240)
      }
    }

    checkHeight()
    window.addEventListener('resize', checkHeight)
    return () => window.removeEventListener('resize', checkHeight)
  }, [services])

  const getIconByLabel = (label) => {
    if (label === 'Reparación') return faTools
    if (label === 'Instalación') return faPlug
    if (label === 'Mantenimiento') return faGears
    return faQuestion
  }

  const alertSendForm = (status, title, message) => {
    const MySwal = withReactContent(Swal)

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
        })
        break

      case 200:
        MySwal.fire({
          icon: 'success',
          title: title || 'Operación exitosa',
          text: message || 'Tu solicitud fue completada correctamente.',
          showConfirmButton: false,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
        })
        break

      case 502:
        MySwal.fire({
          icon: 'error',
          title: title || 'Ocurrió un error',
          text: message || 'No pudimos completar tu solicitud. Intenta de nuevo más tarde.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
        })
        break

      default:
        MySwal.fire({
          icon: 'error',
          title: title || 'Error inesperado',
          text: message || 'No se pudo procesar tu solicitud. Intenta nuevamente más tarde.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar'
        })
        break
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center p-[0_5px] w-full">
        <div className="btnDown">
          <BtnBack To='/' />
        </div>
        <h2 className="font-bold text-4xl text-[var(--Font-Nav)]">MI SERVICIO</h2>
      </div>

      <section className="h-fit flex flex-wrap justify-start text-[var(--main-color)] items-start gap-[0px] !p-[0px_0px] bg-[var(--background-color)] MainPageContainer">
        <Box sx={style} className="flex flex-col min-w-[530px] items-start justify-start gap-4 NeoContainer_outset_TL">
          <div className="text-[var(--Font-Nav)] flex items-center gap-4">
            <FontAwesomeIcon icon={getIconByLabel(description)} className="text-4xl" />
            <p className="text-3xl font-bold">{description}</p>
          </div>

          <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
            <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-light leading-[20px] gap-[8px]">
              <p className="text-xl font-bold text-[var(--main-color)]">{user}</p>
              <p className="text-[1rem]">{phone}</p>
              <p className="text-[1rem]">{email}</p>
              <p className="text-[1rem]">{address}</p>
              <p className="text-[1rem] flex gap-2"><span className="font-black">Problema:</span> {services.input}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <h4 className="text-3xl font-bold text-[var(--main-color)]">Pasos a seguir</h4>
            <div ref={accordionRef} className="accordionContain flex NeoContainer_outset_TL max-w-[525px] flex-col gap-0">
              {services.posibles_soluciones?.map((itemParsed, i) => (
                <Accordion key={i}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <p className="font-bold">{itemParsed.titulo}</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>{itemParsed.descripcion}</p>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </Box>

        <div className="flex justify-center items-center gap-4">
          <Buttons type="submit" nameButton="Terminar el servicio" Onclick={handleDoneServices} />
          <Buttons type="submit" nameButton="Cancelar el servicio" Onclick={handleCancelServices} />
        </div>
      </section>
    </div>
  )
}

export default Technica
