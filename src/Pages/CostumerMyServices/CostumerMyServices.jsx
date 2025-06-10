import { useState, useEffect, use } from "react"
import { jwtDecode } from "jwt-decode"
import { faUser, faTools, faPlug, faGears } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Buttons } from "../../UI/Login_Register/Buttons"
import './CostumerMyServices.css'

const URL_GET = 'https://redgas.onrender.com/ClienteServicesGet'
const URL_DELETE = 'http://localhost:10101/ClienteServicesDelete'

export const CostumerMyServices = () => {
  
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [user, setUser] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const decoded = jwtDecode(token)
      const userId = decoded.data.id

      setId(userId)

      const fetchData = async () => {
        try {
          const response = await fetch(`${URL_GET}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId }),
          })

          if (!response.ok) {
            throw new Error('Error fetching data')
          }

          const datainfo = await response.json()
          
          if (!datainfo.get) {
            navigate('/Services')
          }

          const firstParse = JSON.parse(datainfo.get)
          const secondParse = JSON.parse(JSON.parse(firstParse.item))

          setUser(firstParse.userName)
          setPhone(firstParse.userPhone)
          setAddress(firstParse.userAddress)
          setDescription(secondParse.resultado.input)

        } catch (error) {
          console.error('Error:', error)
        }
      }
      fetchData()
    }

  }, [])
  
  const handleChangeService = async () => {
    try {
      const responseChange = await fetch(`${URL_DELETE}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id }),
      })

      if (!responseChange.ok) {
        throw new Error('Error al eliminar el servicio')
      }
      const dataChange = await responseChange.json()
      
      if(dataChange.status = 'Service info Deleted') {
        navigate('/Services')
      }

    } catch (error) {
      console.error('Error al eliminar el servicio:', error)
    }
  }

  const handleDeleteService = async () => {
    try {
      const responseDelete = await fetch(`${URL_DELETE}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id }),
      })

      if (!responseDelete.ok) {
        throw new Error('Error al eliminar el servicio')
      }
      const dataDelete = await responseDelete.json()
      
      if(dataDelete.status = 'Service info Deleted') {
        setTimeout(() => {
          alert('Servicio eliminado correctamente')
          navigate('/')
        }, 1000)
      }

    } catch (error) {
      console.error('Error al eliminar el servicio:', error)
    }
  }

  return (
    <div>
      <div>
        <h2 className=" font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5 text-shadow">MI SERVICIO</h2>
        <div className="btnDown">
          <BtnBack To='/' />
        </div>
      </div>
      <section className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
        <div className="flex flex-col flex-wrap justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 gap-3">

          <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
            <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
              <p className="text-xl font-bold text-[var(--main-color)]">{user}</p>
              <p className="text-[1rem]">{phone}</p>
              <p className="text-[1rem]">{address}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-[var(--main-color)]">Descripción de tu servicio</h4>
            <p className="whitespace-pre-line text-[var(--main-color)]">{description}</p>
          </div>

          <div className="flex justify-center items-center gap-4">
            <Buttons type="submit" nameButton="Eliminar Servicio" Onclick={handleDeleteService} />
            <Buttons type="submit" nameButton="Cambiar Servicio" Onclick={handleChangeService} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default CostumerMyServices
