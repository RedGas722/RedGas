import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';

export const PrpoductCatergories = ({ imgCategory, nameCategory, className, onClick }) => {
    return (
        <Button
            tabIndex={0}
            onClick={onClick}
            disableElevation
            sx={{
                flex: '1 1 calc(20% - 20px)',
                minWidth: 'clamp(250px, 20vw, 300px)',
                height: 'clamp(140px, 5vw, 180px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                background: 'var(--background-color)',
                boxShadow: 'var(--shadow-sub-outset)',
                borderRadius: '10px',
                color: 'var(--main-color)',
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 'none',
                padding: '12px 20px',
                textTransform: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                '&:hover': {
                    color: 'var(--Font-Nav)',
                    borderRadius: '18px',
                    background: 'var(--background-color)',
                    boxShadow: 'var(--shadow-sub-outset)',
                    transform: 'scale(1.025)',
                    '& .icon': {
                        color: 'var(--Font-Nav-shadow)',
                    },
                },
                '&:active': {
                    color: 'var(--Font-Nav)',
                    boxShadow: 'var(--shadow-sub-inset-br)',
                    transform: 'scale(0.98)',
                    '& .txtCategories': {
                        color: 'var(--main-color-sub)', 
                    },
                    '& .icon': {
                        color: 'var(--main-color)',
                    },
                },
            }}
        >
            <FontAwesomeIcon
                icon={imgCategory}
                alt={nameCategory}
                className={`icon text-2xl ${className}`}
                style={className}
            />
            <h3 className="txtCategories text-2xl font-semibold">{nameCategory}</h3>
        </Button>
    );
};

export default PrpoductCatergories;
