import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faScrewdriverWrench, faUser } from "@fortawesome/free-solid-svg-icons"
import './Login.css'

export const Login = () => {
    const [login, setLogin] = useState(null)

    const handleLogin = () => {
        setLogin(login.target.checked)
    }

    return (
        <section className="sectionLogin text-[var(--main-color)] w-full h-dvh ">
            <div className="flex items-center justify-between w-full">
                <BtnBack To='/' />
                <label className="label relative z-[2]">
                    <FontAwesomeIcon icon={faScrewdriverWrench} className="absolute left-2 z-[3] text-[var(--main-color)]" />
                    <FontAwesomeIcon icon={faUser} className="absolute right-2 z-[3] text-[var(--main-color)]" />
                    <div className="toggle z-[2] NeoContainer_outset_BR">
                        <NavLink className='pp' to={`${login ? '/Login/LoginTechnician' : ''}`}>
                            <input className="toggle-state" type="checkbox" name="check" value="check" checked={login} onChange={handleLogin} />
                        </NavLink>
                        <div className="indicator"></div>
                    </div>
                </label>
            </div>
            <Outlet />
        </section>
    )
}

export default Login