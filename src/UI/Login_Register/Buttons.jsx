import Button from '@mui/material/Button';
import Magnet from '../Magnet/Magnet';
import './LR.css';

export const Buttons = ({ shadow, shadowActive, padding, width, height, radius, borderWidth, borderColor, textColor, nameButton, subTextBTN, Onclick, Type, ...props }) => {
    return (
        <Magnet padding={20} disabled={false} magnetStrength={18} className="group flex flex-col items-center gap-[5px]">
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
                    boxShadow: `${shadow || 'var(--shadow-sub-outset)'}`,
                    color: textColor || 'var(--Font-Nav)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexDirection: 'column',
                    textTransform: 'none',
                    padding: `${padding || '5px 70px'}`,
                    fontSize: '1rem',
                    height: `${height || 'auto'}`,
                    width: `${width || '100%'}`,
                    transition: 'all 0.3s ease',
                    minWidth: 'unset',
                    '@media (max-width: 600px)': {
                        padding: '5px 30px',
                        fontSize: '0.9rem',
                        width: '100%',
                    },
                    '&:hover': {
                        background: 'var(--background-color)',
                        color: textColor || 'var(--Font-Nav)',
                        boxShadow: `${shadow || 'var(--shadow-sub-outset)'}`,
                        '& .textBtn': {
                            filter: 'brightness(1.2)',
                        },
                    },
                    '&:active': {
                        color: textColor || 'var(--Font-Nav)',
                        boxShadow: `${shadowActive || 'var(--shadow-sub-inset-br)'}`,
                        transform: 'scale(0.98)',
                        '& .textBtn': {
                            color: textColor || 'var(--Font-Nav)',
                            filter: 'brightness(0.7)',
                        },
                    },
                }}
            >
                <p className='textBtn'>
                    {nameButton}
                </p>
                <p className='subTextBTNClass text-[var(--main-color)] font-normal'>
                    {subTextBTN}
                </p>
            </Button>
        </Magnet>
    );
};

export default Buttons;
