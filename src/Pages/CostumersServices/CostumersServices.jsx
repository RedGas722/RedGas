import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { faUser, faTools, faPlug, faGears, faChevronDown, faChevronUp, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import { Buttons } from "../../UI/Login_Register/Buttons";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './CostumersServices.css';

const URL = 'https://redgas.onrender.com/ClienteServicesGet';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	boxShadow: 24,
	p: 2,
};

export const CostumerServices = () => {
	const [user, setUser] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [label, setLabel] = useState('');
	const [solutions, setSolutions] = useState([]);
	const [isScrollable, setIsScrollable] = useState(false);
	const accordionRef = useRef(null);

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
					const solutionsArray = Object.values(secondParse.resultado.posibles_soluciones);

					setUser(firstParse.userName);
					setPhone(firstParse.userPhone);
					setAddress(firstParse.userAddress);
					setLabel(secondParse.resultado.etiqueta);
					setSolutions(solutionsArray);
				} catch (error) {
					console.error('Error:', error);
				}
			};

			fetchData();
		}
	}, []);

	useEffect(() => {
		const checkHeight = () => {
			if (accordionRef.current) {
				setIsScrollable(accordionRef.current.offsetHeight > 240);
			}
		};
		checkHeight();
		window.addEventListener('resize', checkHeight);
		return () => window.removeEventListener('resize', checkHeight);
	}, [solutions]);

	const getIconByLabel = (label) => {
		if (label === 'Reparación') return faTools
		if (label === 'Instalación') return faPlug
		if (label === 'Mantenimiento') return faGears
		return faQuestion
	};

	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	return (
		<div>
			<div className="flex justify-between items-center p-[0_5px] w-full">
				<div className="btnDown">
					<BtnBack To='/' />
				</div>
				<h2 className="font-bold text-4xl text-[var(--Font-Nav)]">
					MI SERVICIO
				</h2>
			</div>

			<section className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
				<div className="flex flex-col items-start justify-center max-w-[400px] min-w-0 NeoContainer_outset_TL p-5 gap-3">
					<div className="text-[var(--Font-Nav)] flex items-center gap-4 cursor-pointer" onClick={handleOpen}>
						<FontAwesomeIcon icon={getIconByLabel(label)} className="text-4xl" />
						<p className="text-3xl font-bold">{label}</p>
					</div>

					<div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit cursor-pointer" onClick={handleOpen}>
						<FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
						<div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
							<p className="text-xl font-bold text-[var(--main-color)]">{user}</p>
							<p className="text-[1rem]">{phone}</p>
							<p className="text-[1rem]">{address}</p>
						</div>
					</div>
					<div className="flex justify-center w-full items-center">
						<Buttons type="submit" nameButton="Aceptar Servicio" />
					</div>
					{/* Modal */}
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style} className="flex flex-col items-start justify-center gap-4 outline-none NeoContainer_outset_TL relative">
							<IconButton
								aria-label="close"
								onClick={handleClose}
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
									color: 'var(--main-color-sub)',
									zIndex: 10
								}}
							>
								<CloseIcon />
							</IconButton>
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
								{/* Accordion */}
								<div
									ref={accordionRef}
									className={`accordionContain flex NeoContainer_outset_TL max-h-[256px] flex-col gap-0 ${isScrollable ? 'overflow-y-scroll' : 'overflow-y-auto'}`}
								>
									{solutions.map((item, index) => (
										<Accordion key={index} expandIcon={<ExpandMoreIcon />}
											aria-controls="panel2-content"
											id="panel2-header">
											<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls="panel2-content"
												id="panel2-header"
											>
												<p component="span" className="font-bold">
													{item.titulo}
												</p>
											</AccordionSummary>
											<AccordionDetails>
												<p>
													{item.descripcion}
												</p>
											</AccordionDetails>
										</Accordion>
									))}
								</div>
							</div>
							<div className="w-full flex justify-center items-center">
								<Buttons type="submit" nameButton="Aceptar Servicio" />
							</div>
						</Box>
					</Modal>
				</div>
			</section>
		</div>
	);
};

export default CostumerServices;
