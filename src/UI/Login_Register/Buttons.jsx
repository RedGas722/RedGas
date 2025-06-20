import Button from '@mui/material/Button';
import './LR.css';

export const Buttons = ({ radius, nameButton, Onclick, Type, ...props }) => {
    return (
        <div className="group">
            <Button
                onClick={Onclick}
                type={Type}
                disableElevation
                {...props}
                sx={{
                    background: 'var(--background-color)',
                    borderRadius: `${radius || 18}px`,
                    boxShadow: 'var(--shadow-sub-outset)',
                    color: 'var(--main-color)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    padding: '5px 70px',
                    fontSize: '1rem',
                    minWidth: 'clamp(150px, 20vw, 200px)',
                    maxWidth: '100%',
                    transition: 'all 0.3s ease',
                    minWidth: 'unset',
                    '&:hover': {
                        color: 'var(--Font-Nav)',
                        background: 'var(--background-color)',
                        boxShadow: 'var(--shadow-sub-outset)',
                    },
                    '&:active': {
                        color: 'var(--Font-Nav)',
                        boxShadow: 'var(--shadow-sub-inset-br)',
                        transform: 'scale(0.98)',
                    },
                }}
            >
                {nameButton}
            </Button>
        </div>
    );
};

export default Buttons;
