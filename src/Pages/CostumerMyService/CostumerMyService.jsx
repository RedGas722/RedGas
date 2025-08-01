import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faLocationDot, faPhone, faUser, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import './CostumerMyService.css'

const URL_GET = 'https://redgas.onrender.com/ClienteServicesGet'
const URL_TECHNICIAN = 'https://redgas.onrender.com/TecnicoServicesGetAll'
const URL_DELETE = 'https://redgas.onrender.com/ClienteServicesDelete'

export const CostumerMyService = () => {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [user, setUser] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [info, setInfo] = useState(false)
  const [change, setChange] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      const userId = decoded.data.id
      setId(userId)
      handleInProcess(userId)

      const fetchData = async () => {
        alertSendForm('wait', 'Cargando...', 'Obteniendo datos del servicio...')
        try {
          const response = await fetch(URL_GET, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          })

          if (!response.ok) {
            alertSendForm(502, 'Error al cargar servicio', 'Intenta nuevamente más tarde.')
            return
          }

          const datainfo = await response.json()

          if (!datainfo.get) {
            alertSendForm('change', '', '')
            navigate('/Services')
          }

          const firstParse = JSON.parse(datainfo.get)
          const secondParse = JSON.parse(JSON.parse(firstParse.item))

          if (secondParse.error) {
            setChange(true)
            handleChangeService()
            return
          }
                  

          setUser(firstParse.userName)
          setPhone(firstParse.userPhone)
          setAddress(firstParse.userAddress)
          setDescription(secondParse.resultado.input)

          Swal.close()
        } catch (error) {
        }
      }

      fetchData()
    }
  }, [])

  const handleInProcess = async (id) => {
    try {
      const respon = await fetch(URL_TECHNICIAN, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await respon.json()
      data.get.map(item => {
        if (item.userid == id) {
          return setInfo(true)
        }
      })
    } catch (err) {

    }

  }

  const handleChangeService = async () => {
    if (change == false) {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto eliminará tu servicio actual para que puedas crear uno nuevo.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#19A9A4',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
      })

      if (!confirmed.isConfirmed) return
    }

    alertSendForm('wait', 'Cambiando servicio...', 'Estamos procesando tu solicitud')
    try {
      const response = await fetch(URL_DELETE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      })

      if (!response.ok) throw new Error('Error al cambiar el servicio')

      const data = await response.json()
      if (data.status === 'Service info Deleted') {
        alertSendForm('change', '', '')
        setTimeout(() => navigate('/Services'), 0)
      }
    } catch (error) {
      console.error('Error al cambiar el servicio:', error)
      alertSendForm(502, 'Error al cambiar el servicio', error.message)
    }
  }

  const handleDeleteService = async () => {
    const confirmed = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu servicio permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A9191E',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (!confirmed.isConfirmed) return

    alertSendForm('wait', 'Eliminando servicio...', 'Estamos procesando tu solicitud')
    try {
      const response = await fetch(URL_DELETE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      })

      if (!response.ok) throw new Error('Error al eliminar el servicio')

      const data = await response.json()
      if (data.status === 'Service info Deleted') {
        alertSendForm(200, 'Servicio eliminado correctamente', 'Tu servicio ha sido eliminado.')
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (error) {
      console.error('Error al eliminar el servicio:', error)
      alertSendForm(502, 'Error al eliminar el servicio', error.message)
    }
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

      case 'change':
        Swal.fire({
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          timer: 10,
        })
        break

      case 200:
        MySwal.fire({
          icon: 'success',
          title: title || 'Operación exitosa',
          text: message || 'Tu solicitud fue completada correctamente.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
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
      <div className="flex z-[2] p-[5px] items-center justify-between ">
        <div className="z-[2] flex flex-col text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
          <BtnBack To='/' />
          <div>
            <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Mi servicio</h2>
            {info === false && (
              <div className="border-[2px] border-[var(--Font-Yellow)] rounded-lg p-2">
                <h3>tu servicio esta en proceso de aceptacion...</h3>
              </div>
            )}
            {info === true && (
              <div className="border-[2px] border-[var(--Font-Nav)] rounded-lg p-2">
                <h3>tu servicio ha sido aceptado</h3>
              </div>
            )}
          </div>
        </div>
        <div>

        </div>
      </div>
      <section className="h-fit z-[2] flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
        <div className="flex flex-col z-[2] flex-wrap justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 gap-3">

          <div className="text-[var(--main-color-sub)] leading-[20px] pl-2 gap-3 flex flex-wrap justify-start items-center font-bold w-fit">
            <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-normal gap-[8px] text-[var(--main-color)]">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faUserCircle} className="relative top-1 text-2xl text-[var(--Font-Nav)]" />
                <p className="text-xl font-bold text-[var(--main-color)]">{user}</p>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faPhone} className="text-1xl w-[15px] text-[var(--Font-Nav-shadow)]" />
                <p className="text-[1rem]">{phone}</p>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} className="text-1xl w-[15px] text-[var(--Font-Nav-shadow)]" />
                <p className="text-[1rem]">{address}</p>
              </div>
            </div>
          </div>

          <div className="z-[2]">
            <h4 className="text-xl font-bold text-[var(--main-color)]">Descripción de tu servicio</h4>
            <p className="text-[var(--main-color)] short-description">{description}</p>
          </div>
          {info === false && (
            <div className="z-[2] grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 justify-center items-center gap-4">
              <Buttons
                type="submit"
                nameButton="Eliminar Servicio"
                Onclick={() => handleDeleteService()}
                className="bg-[var(--Font-Nav2)] hover:bg-[var(--Font-Nav2-shadow)] text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
              />
              <Buttons
                type="submit"
                nameButton="Cambiar Servicio"
                Onclick={() => handleChangeService()}
                className="bg-[var(--Font-Nav)] hover:bg-[var(--Font-Nav-shadow)] text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CostumerMyService
