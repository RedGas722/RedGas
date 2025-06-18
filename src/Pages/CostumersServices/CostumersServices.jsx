import { useState, useEffect, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import { faUser, faTools, faPlug, faGears, faQuestion } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Buttons } from "../../UI/Login_Register/Buttons"
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import './CostumersServices.css'

const URL = 'http://localhost:10101/ClienteServicesGetAll'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  p: 2,
}

export const CostumerServices = () => {
  const [dataInfo, setDataInfo] = useState([])
  const [result, setResult] = useState([])
  const [isScrollable, setIsScrollable] = useState(false)
  const accordionRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await fetch(URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) throw new Error('Error fetching data')

        const dataJson = await response.json()
        setDataInfo(dataJson.get)

        const parsedResults = dataJson.get.map((item) => {
          try {
            const parsedItem = JSON.parse(item.item)
            const secondParse = JSON.parse(parsedItem)
            return secondParse.resultado
          } catch (e) {
            console.error('Error al parsear item:', item)
            return null
          }
        })

        setResult(parsedResults)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {

    const checkHeight = () => {
      if (accordionRef.current) {
        setIsScrollable(accordionRef.current.offsetHeight > 240)
      }
    }

    checkHeight()
    window.addEventListener('resize', checkHeight)
    return () => window.removeEventListener('resize', checkHeight)

  }, [result])

  const getIconByLabel = (label) => {
    if (label === 'Reparación') return faTools
    if (label === 'Instalación') return faPlug
    if (label === 'Mantenimiento') return faGears
    return faQuestion
  }

  const handleOpen = (index) => setOpenIndex(index)
  const handleClose = () => setOpenIndex(null)

  const handleAceptServices = async (id) => {
    console.log(id);

  }


  return (
    <div>
      <div className="flex justify-between items-center p-[0_5px] w-full">
        <div className="btnDown">
          <BtnBack To='/' />
        </div>
        <h2 className="font-bold text-4xl text-[var(--Font-Nav)]">
          MI SERVICIO
        </h2>
      </div>

      <section className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[40px] !p-[80px_0] bg-[var(--background-color)] MainPageContainer">
        {dataInfo.map((item, idx) => {
          const service = result[idx]
          if (!service) return null

          return (
            <div key={idx} className="userServiceTec flex flex-col items-start justify-center !rounded-[40px] max-w-[400px] min-w-0 NeoContainer_outset_TL p-5 gap-3">
              <div className="text-[var(--Font-Nav)] flex items-center gap-4 cursor-pointer" onClick={() => handleOpen(idx)}>
                <FontAwesomeIcon icon={getIconByLabel(service.etiqueta)} className="text-4xl" />
                <p className="text-3xl font-bold">{service.etiqueta}</p>
              </div>

              <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit cursor-pointer" onClick={() => handleOpen(idx)}>
                <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
                <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
                  {item.userName.length > 10 && (
                    <p className="text-xl font-bold text-[var(--main-color)]">{item.userName.slice(0, 12) + '...'}</p>
                  )}
                  {item.userName.length <= 10 && (
                    <p className="text-xl font-bold text-[var(--main-color)]">{item.userName}</p>
                  )}
                  <p className="text-[1rem]">{item.userPhone}</p>
                  <p className="text-[1rem]">{item.userAddress}</p>
                </div>
              </div>

              <div className="flex justify-center w-full items-center">
                <Buttons type="submit" nameButton="Aceptar Servicio" />
              </div>

              {/* Modal por tarjeta */}
              <Modal
                open={openIndex === idx}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="flex flex-col min-w-[330px] items-start justify-center gap-4 outline-none NeoContainer_outset_TL relative">
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'var(--main-color-sub)',
                      zIndex: 10
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <div className="text-[var(--Font-Nav)] flex items-center gap-4">
                    <FontAwesomeIcon icon={getIconByLabel(service.etiqueta)} className="text-4xl" />
                    <p className="text-3xl font-bold">{service.etiqueta}</p>
                  </div>

                  <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
                    <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
                    <div className="flex flex-col justify-center font-light leading-[20px] gap-[8px]">
                      <div>
                        <p className="text-xl font-bold text-[var(--main-color)]">{item.userName}</p>
                        <p className="text-[1rem]">{item.userPhone}</p>
                        <p className="text-[1rem]">{item.userAddress}</p>
                      </div>
                      <p className="text-[1rem] flex  gap-2 justify-self-start self-start"> <span className="font-black "> Problema:</span> {service.input}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-4">
                    <h4 className="text-3xl font-bold text-[var(--main-color)]">Pasos a seguir</h4>
                    <div
                      ref={accordionRef}
                      className={`accordionContain flex NeoContainer_outset_TL max-h-[256px] flex-col gap-0 ${isScrollable ? 'overflow-y-scroll' : 'overflow-y-auto'}`}
                    >
                      {service.posibles_soluciones?.map((itemParsed, i) => (
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

                    <div className="w-full flex justify-center items-center">
                      <Buttons type="submit" nameButton="Aceptar Servicio" Onclick={console.log('treu')} />
                    </div>
                  </div>

                </Box>
              </Modal>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default CostumerServices
