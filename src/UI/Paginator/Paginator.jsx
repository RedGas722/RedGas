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
    <Box className="flex justify-center fixed bottom-0 left-1/2 transform -translate-1/2 bg-[var(--main-color)] rounded-[100px] p-[5px]">
      <Pagination
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white', 
            backgroundColor: 'transparent',
          },
          '& .Mui-selected': {
            backgroundColor: 'var(--Font-Nav)', 
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'var(--Font-Nav-shadow)',
            },
          },
        }}
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        shape="rounded"
        size="small"
        disabled={disabled}
      />
    </Box>
  );
};

export default Paginator;
