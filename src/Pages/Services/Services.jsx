import { useState } from "react";
import { Buttons } from "../../UI/Login_Register/Buttons"

const URL = 'http://localhost:10101/Diagnostic';

export const ServicesInfo = () => {

   const [description, setDescription] = useState('');

   const handleServices = async (e) => {
      e.preventDefault()
      try {
         const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion: description }),
         });

         const data = await res.json();

         localStorage.setItem('data', JSON.stringify(data))
         
         console.log('enviado');
      } catch (err) {
         
      }
   }

   return (
      <section className="h-fit flex flex-wrap justify-center items-center gap-[20px] p-20">
         <form onSubmit={handleServices}>
            <p>ingrese aqui una descripcion de su necesidad - hacemos instalaciones/reparaciones/mantenimiento/otros </p>
            <textarea ForID='Description' placeholder="mi estufa ya no enciende..." value={description} onChange={e => setDescription(e.target.value)} />
            <Buttons type="submit" nameButton="enviar" />
         </form>
      </section>
   );
};

export default ServicesInfo;
