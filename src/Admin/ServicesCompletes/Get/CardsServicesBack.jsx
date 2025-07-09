import { useState } from 'react'
import { Buttons } from '../../../UI/Login_Register/Buttons'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const CardServicesBack = ({ servicio, clientes }) => {
  const cliente = clientes.find(c => c.id_cliente === servicio.id_cliente)
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const descripcion = servicio.descripcion || 'Sin descripción'
  const isTruncated = descripcion.length > 22
  
  return (
    <div className="z-[2] NeoContainer_outset_TL p-4 w-[300px] min-h-[150px] flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-[var(--main-color)] truncate">
          Servicio #{servicio.id_pedidoServicio}
        </h2>
        <div className="text-[var(--main-color-sub)] flex flex-col text-sm">
          <p className="font-medium flex flex-wrap gap-2">
            <span className="font-bold text-[15px]">Cliente:</span>
            <span className="break-words">{cliente?.correo_cliente || 'Desconocido'}</span>
          </p>
          <p className="font-medium flex items-center gap-1">
            <span className="font-bold text-[15px]">Técnico:</span>
            <span className="break-words">{servicio.id_tecnico}</span>
          </p>
          <p className="font-medium flex items-center gap-1">
            <span className="font-bold text-[15px]">Total:</span>
            <span className="break-words">{servicio.total}</span>
          </p>
          <p className="font-medium flex items-start gap-1">
            <span className="font-bold text-[15px]">Descripción:</span>
            <span className="truncate max-w-[200px] line-clamp-2">
              {descripcion.slice(0, 100)}{isTruncated ? '...' : ''}
            </span>
          </p>


          <p className="font-medium flex flex-wrap gap-2">
            <span className="font-bold text-[15px]">Estado:</span>
            <span className="break-words">{servicio.estado_pedido}</span>
          </p>
        </div>
        {isTruncated && (
          <div className="mt-1 ml-[6px]">
            <Buttons
              textColor="var(--Font-Yellow)"
              onClick={handleOpen}
              nameButton="Ver más"
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          className="bg-white w-[90%] md:w-[500px] max-h-[80vh] overflow-y-auto p-6 rounded-xl relative shadow-lg"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" className="font-bold text-[var(--main-color)] mb-4">
            Descripción completa del servicio #{servicio.id_pedidoServicio}
          </Typography>

          <Typography variant="body1" className="text-gray-700 whitespace-pre-wrap">
            {descripcion}
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

export default CardServicesBack
