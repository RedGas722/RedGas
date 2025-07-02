// src/components/UI/Paginator.jsx
import { Pagination, Box } from '@mui/material';

export const Paginator = ({ currentPage, totalPages, onPageChange, disabled }) => {
  if (totalPages <= 1) return null;

  const handleChange = (event, page) => {
    if (page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <Box className="flex justify-center z-[3] fixed bottom-0 left-1/2 transform -translate-1/2 bg-[var(--main-color)] rounded-[100px] p-[5px]">
      <Pagination
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white', // color de texto por defecto
            backgroundColor: 'transparent',
          },
          '& .Mui-selected': {
            backgroundColor: '#19A9A4', // azul por ejemplo
            color: 'white',          // texto blanco cuando está seleccionado
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#106A67', // azul por ejemplo
            },
          },
        }}
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        shape="rounded"
        size="small"
        disabled={disabled} // 🔒 Bloquea clics mientras está cargando
      />
    </Box>
  );
};

export default Paginator;
