import { useState, useEffect, use } from "react";
import { jwtDecode } from "jwt-decode";

const URL = 'http://localhost:10101/ClienteServicesGet'

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

  return (
    <section className="h-fit flex flex-wrap justify-center items-center gap-[20px] p-20">
      <div className=" flex flex-col flex-wrap justify-center w-70 NeoContainer_outset_TL p-5">
        <p className="text-[var(--Font-Nav)] text-3xl font-bold">{label}</p>
        <p className="pl-[15px] text-[var(--main-color-sub)] font-bold text-[1.2rem]">{user}</p>
        <p>{address}</p>
        <p>{phone}</p>
        <p className="whitespace-pre-line">{solutions}</p>
      </div>
    </section>
  )
}

export default CostumerServices
