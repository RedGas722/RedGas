import { useState, useEffect, use } from "react"
import { jwtDecode } from "jwt-decode"
import { faUser, faTools, faPlug, faGears } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const URL = 'http://localhost:10101/ClienteServicesGet'

export const CostumerServices = () => {
  const [user, setUser] = useState('')
  const [phone, setPhone] = useState('')
  // const [address, setAddress] = useState('')
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
  return faGears
}

  return (
    <section className="h-fit flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
      <div className="flex flex-col flex-wrap justify-center w-fit NeoContainer_outset_TL p-5">
        <div>
          <FontAwesomeIcon icon={getIconByLabel(label)} className="text-[var(--Font-Nav-shadow)] text-5xl" />
          <p className="text-[var(--Font-Nav)] text-3xl font-bold">{label}</p>
        </div>

        <div className="text-[var(--main-color-sub)] gap-2 flex items-center font-bold w-fit">
          <FontAwesomeIcon icon={faUser} className="text-[var(--Font-Nav-shadow)] text-5xl" />
          <div className="flex flex-col justify-center font-light leading-[20px]">
            <p className="text-2xl font-bold text-[var(--main-color)]">{user}</p>
            <p className="text-[1rem]">{phone}</p>
            <p className="text-[1rem]">mztytft</p>
          </div>
        </div>

        <p className="max-w-70 whitespace-pre-line">{solutions}</p>
      </div>
    </section>
  )
}

export default CostumerServices
