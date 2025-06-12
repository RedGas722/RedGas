import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  faUser,
  faTools,
  faPlug,
  faGears,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import { Buttons } from "../../UI/Login_Register/Buttons";
import './CostumersServices.css';

const URL = 'https://redgas.onrender.com/ClienteServicesGet';

export const CostumersServices = () => {
  const [user, setUser] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [openIndexes, setOpenIndexes] = useState([]);

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

  const getIconByLabel = (label) => {
    if (label === 'Reparación') return faTools;
    if (label === 'Instalación') return faPlug;
    return faGears;
  };

  const toggleAccordion = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      <div>
        <h2 className="font-bold text-4xl text-[var(--Font-Nav)] fixed top-5 left-5 text-shadow">
          MI SERVICIO
        </h2>
        <div className="btnDown">
          <BtnBack To='/' />
        </div>
      </div>

      <section className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
        <div className="flex flex-col flex-wrap justify-center max-w-[400px] min-w-0 NeoContainer_outset_TL p-5 gap-3">
          
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

          <div className="space-y-2">
            {solutions.map((item, index) => (
              <div key={index} className="border rounded-xl p-3 shadow">
                <button
                  className="w-full text-left font-semibold flex justify-between items-center"
                  onClick={() => toggleAccordion(index)}
                >
                  {item.titulo}
                  <FontAwesomeIcon
                    icon={openIndexes.includes(index) ? faChevronUp : faChevronDown}
                    className="text-sm ml-2"
                  />
                </button>
                {openIndexes.includes(index) && (
                  <div className="mt-2 text-gray-700 transition-all">
                    {item.descripcion}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4">
            <Buttons type="submit" nameButton="Aceptar Servicio" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CostumersServices;
