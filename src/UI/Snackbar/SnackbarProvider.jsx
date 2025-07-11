import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
    const [snack, setSnack] = useState({ open: false, message: '', duration: 4000, bgColor: '#323232', color: '#fff' });

    const showSnackbar = (message, duration = 4000, bgColor = '#323232', color = '#fff') => {
        setSnack({ open: true, message, duration, bgColor, color });
    };

    const handleClose = () => {
        setSnack({ ...snack, open: false });
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snack.open}
                autoHideDuration={snack.duration}
                onClose={handleClose}
                message={snack.message}
                ContentProps={{ style: { background: snack.bgColor, color: snack.color } }}
                style={{ zIndex: 99999 }}
            />
        </SnackbarContext.Provider>
    );
};
