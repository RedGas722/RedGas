import { useEffect, useState } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Card,
   CardContent,
   Typography,
   Box,
   Chip,
   IconButton,
   useTheme,
   useMediaQuery
} from "@mui/material";
import {
   Close as CloseIcon,
   Build as BuildIcon,
   Check as CheckIcon,
   Clear as ClearIcon,
   Power as PowerIcon,
   Settings as SettingsIcon,
   Refresh as RefreshIcon
} from "@mui/icons-material";
import { ProductsModal } from "../../Admin/Factures/Get/ProductsModal";
import { ShortText } from "../../UI/ShortText/ShortText";

const ServicesModal = ({ onClose, open = true }) => {
   const [facturas, setFacturas] = useState([]);
   const [productosFactura, setProductosFactura] = useState(null);
   const [loading, setLoading] = useState(true);
   const theme = useTheme();
   const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

   const fetchFacturasCliente = async () => {
      try {
         const token = localStorage.getItem("token");
         if (!token) throw new Error("No estás autenticado");

         const res = await fetch("https://redgas.onrender.com/FacturaGetByClient", {
            headers: { Authorization: `Bearer ${token}` },
         });

         if (!res.ok) throw new Error("Error al obtener facturas");
         const data = await res.json();

         setFacturas(data.data || []);
      } catch (error) {
         console.error(error);
         alert("Hubo un problema al cargar las facturas");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchFacturasCliente();
   }, []);

   const getStatusConfig = (status) => {
      switch (status) {
         case "proceso":
            return {
               icon: <RefreshIcon />,
               label: "En proceso",
               color: "warning",
            };
         case "finalizado":
            return {
               icon: <CheckIcon />,
               label: "Finalizado",
               color: "success",
            };
         case "cancelado":
            return {
               icon: <ClearIcon />,
               label: "Cancelado",
               color: "error",
            };
         default:
            return {
               icon: <RefreshIcon />,
               label: "En proceso",
               color: "warning",
            };
      }
   };

   const getServiceConfig = (type) => {
      switch (type) {
         case "instalacion":
            return {
               icon: <PowerIcon />,
               title: "Instalación",
            };
         case "reparacion":
            return {
               icon: <SettingsIcon />,
               title: "Reparación",
            };
         case "mantenimiento":
            return {
               icon: <BuildIcon />,
               title: "Mantenimiento",
            };
         default:
            return {
               icon: <BuildIcon />,
               title: "Servicio",
            };
      }
   };

   const services = [
      {
         type: "instalacion",
         description: "mi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gasmi estufa no prende y huele a gas",
         status: "proceso",
      },
      {
         type: "reparacion",
         description: "mi estufa no prende y huele a gas",
         status: "finalizado",
      },
      {
         type: "mantenimiento",
         description: "mi estufa no prende y huele a gas",
         status: "cancelado",
      },
   ];

   return (
      <>
         <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{
               sx: {
                  borderRadius: fullScreen ? 0 : 3,
                  minHeight: fullScreen ? '100vh' : 'auto',
               }
            }}
         >
            <DialogTitle sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               pb: 1
            }}>
               <Typography variant="h4" component="h2" fontWeight="bold" sx={{
                  color: 'var(--Font-Nav)',
               }}>
                  Historial
               </Typography>
               <IconButton onClick={onClose} size="small">
                  <CloseIcon />
               </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 3, py: 2 }}>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {services.map((service, index) => {
                     const serviceConfig = getServiceConfig(service.type);
                     const statusConfig = getStatusConfig(service.status);

                     return (
                        <Card
                           key={index}
                           className="
                           NeoContainer_outset_TL"
                           sx={{
                              borderRadius: 2,
                              '&:hover': {
                                 boxShadow: 2,
                              }
                           }}
                        >
                           <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                 {serviceConfig.icon}
                                 <Typography variant="h6" fontWeight="bold">
                                    {serviceConfig.title}
                                 </Typography>
                              </Box>

                              <Box sx={{ pl: 0.5, mb: 1 }}>
                                 <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Descripción:
                                 </Typography>
                                 <ShortText text={service.description} />
                              </Box>

                              <Box sx={{ pl: 0.5 }}>
                                 <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Estado:
                                 </Typography>
                                 <Chip
                                    icon={statusConfig.icon}
                                    label={statusConfig.label}
                                    color={statusConfig.color}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                 />
                              </Box>
                           </CardContent>
                        </Card>
                     );
                  })}
               </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
               <Button
                  onClick={onClose}
                  variant="contained"
                  color="error"
                  sx={{ px: 3, py: 1 }}
               >
                  Cerrar
               </Button>
            </DialogActions>
         </Dialog>

         {productosFactura && (
            <ProductsModal
               factura={productosFactura}
               onClose={() => setProductosFactura(null)}
            />
         )}
      </>
   );
};

export default ServicesModal;