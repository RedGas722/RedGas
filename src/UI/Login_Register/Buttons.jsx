import Button from '@mui/material/Button';
import './LR.css';

export const Buttons = ({ padding, width, height, radius, borderWidth, borderColor, textColor, nameButton, Onclick, Type, ...props }) => {
    return (
        <div className="group">
            <Button
                data-cursor-hover
                onClick={Onclick}
                type={Type}
                disableElevation
                {...props}
                sx={{
                    background: 'var(--background-color)',
                    borderRadius: `${radius || 18}px`,
                    border: `${borderWidth || ''}px solid ${borderColor || ' '}`,
                    boxShadow: 'var(--shadow-sub-outset)',
                    color: textColor || 'var(--Font-Nav)',
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    padding: `${padding || '5px 70px'}`,
                    fontSize: '1rem',
                    height: `${height || ' '}`,
                    width: `${width || '100%'}`,
                    transition: 'all 0.3s ease',
                    minWidth: 'unset',
                    '&:hover': {
                        background: 'var(--background-color)',
                        color: textColor || 'var(--Font-Nav)',
                        boxShadow: 'var(--shadow-sub-outset)',
                        '& .textBtn': {
                            filter: 'brightness(1.2)',
                        }
                    },
                    '&:active': {
                        color: textColor || 'var(--Font-Nav)',
                        boxShadow: 'var(--shadow-sub-inset-br)',
                        transform: 'scale(0.98)',
                        '& .textBtn': {
                            color: textColor || 'var(--Font-Nav)',
                            filter: 'brightness(0.7)',
                        },
                    },
                }}
            >
                <p className='textBtn font-bold'>
                    {nameButton}
                </p>
            </Button>
        </div>
    );
};

export default Buttons;
