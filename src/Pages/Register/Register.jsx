import { Inputs } from "../../UI/Login_Register/Inputs"
import { Buttons } from "../../UI/Login_Register/Buttons"
import './Register.css'
import { Text } from "../../UI/Login_Register/Text"

export const Register = () => {
    return (
        <div className="w-full">
            <div className='divForm shadow_box bg-glass-total rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[40px]'>
                <h1 className='text-center text-white text-4xl'>¡Bienvenido!</h1>
                <form className='flex flex-col gap-[15px] justify-center items-center text-start w-fit mx-auto mt-10'>
                    <div className='flex gap-[15px]'>
                        <div className='flex flex-col'>
                            <Inputs For='Name' NameIn='Nombre' Place='' />
                        </div>
                        <div className='flex flex-col'>
                            <Inputs For='lastName' NameIn='Apellido' Place='' />
                        </div>
                    </div>
                    <Inputs For='Number' NameIn='Teléfono' Place='3*********' />
                    <Inputs For='Email' NameIn='Correo electrónico' Place='example@gmail.com' />
                    <Inputs For='Password' NameIn='Contraseña' Place='***********' />
                    <Inputs For='Confirm' NameIn='Confirmar contraseña' Place='***********' />
                </form>
                <div className="flex flex-col items-center ">
                    <Buttons nameButton='Register' />
                    <Text Have='Tienes cuenta?' GoTo='Inicia sesión aquí' />
                </div>
            </div>
        </div>
    )
}
export default Register