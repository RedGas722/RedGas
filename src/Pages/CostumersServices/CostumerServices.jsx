import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { faUser, faTools, faPlug, faGears, faQuestion } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Buttons } from "../../UI/Login_Register/Buttons"
import './CostumersServices.css'

const URL = 'https://redgas.onrender.com/ClienteServicesGet'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 2,
};


export const CostumerServices = () => {
    const [user, setUser] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [label, setLabel] = useState('')
    const [solutions, setSolutions] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.data.id;

            const fetchData = async () => {
                try {
                    const response = await fetch(`${URL}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: userId }),
                    });

                    if (!response.ok) {
                        throw new Error('Error fetching data');
                    }

                    const datainfo = await response.json();
                    const firstParse = JSON.parse(datainfo.get);
                    const secondParse = JSON.parse(JSON.parse(firstParse.item));
                    const solutionsWithHyphens = secondParse.resultado.posibles_soluciones.map(sol => `- ${sol}`);

                    setUser(firstParse.userName);
                    setPhone(firstParse.userPhone);
                    setAddress(firstParse.userAddress);
                    setLabel(secondParse.resultado.etiqueta);
                    setSolutions(solutionsWithHyphens.join('\n'));

                } catch (error) {
                    console.error('Error:', error);
                }
            };
            fetchData();
        }

    }, [])
    const getIconByLabel = (label) => {
        if (label === 'Reparación') return faTools
        if (label === 'Instalación') return faPlug
        if (label === 'Mantenimiento') return faGears
        return faQuestion
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <div>
                <h2 className=" font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5 text-shadow">MI SERVICIO</h2>
                <div className="btnDown">
                    <BtnBack To='/' />
                </div>
            </div>
            <div className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20 ">
                <div onClick={handleOpen} className="flex flex-col flex-wrap justify-center w-fit min-w-0 NeoContainer_outset_TL p-5 gap-3 cursor-pointer">
                    <div className="text-[var(--Font-Nav)] flex items-center gap-4">
                        <FontAwesomeIcon icon={getIconByLabel(label)} className="text-4xl" />
                        <p className="text-3xl font-bold">{label}</p>
                    </div>

                    <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
                        <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
                        <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
                            <p className="text-xl font-bold text-[var(--main-color)]">{user}</p>
                            <p className="text-[1rem]">{phone}</p>
                            <p className="text-[1rem]">{address}</p>
                        </div>
                        
                        {/* Modal */}
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style} className="flex flex-col items-center justify-center gap-4 NeoContainer_outset_TL">
                                <div className="text-[var(--Font-Nav)] flex items-center gap-4">
                                    <FontAwesomeIcon icon={getIconByLabel(label)} className="text-4xl" />
                                    <p className="text-3xl font-bold">{label}</p>
                                </div>
                                <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
                                    <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
                                    <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
                                        <p className="text-xl font-bold text-[var(--main-color)]">{user}</p>
                                        <p className="text-[1rem]">{phone}</p>
                                        <p className="text-[1rem]">{address}</p>
                                    </div>

                                </div>
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <h4 className="text-3xl font-bold text-[var(--main-color)]">pasos a seguir</h4>
                                    <p className="whitespace-pre-line text-[var(--main-color)]">{solutions}</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Buttons type="submit" nameButton="Aceptar Servicio" />
                                </div>
                            </Box>
                        </Modal>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CostumerServices
