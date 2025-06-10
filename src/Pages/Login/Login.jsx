import { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faScrewdriverWrench, faUser } from "@fortawesome/free-solid-svg-icons"
import './Login.css'

export const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [login, setLogin] = useState(false)

    // Sync checkbox with current route
    useEffect(() => {
        if (location.pathname === "/Login/LoginTechnician") {
            setLogin(true)
        } else {
            setLogin(false)
        }
    }, [location.pathname])

    const handleLogin = (e) => {
        const isChecked = e.target.checked
        setLogin(isChecked)
        if (isChecked) {
            navigate("/Login/LoginTechnician")
        } else {
            navigate("/Login")
        }
    }

    return (
        <section className="sectionLoginRegister text-[var(--main-color)] w-full h-dvh ">
            <div className="flex items-center justify-between w-full">
                <BtnBack To='/' />
                <label className="label relative z-[2]">
                    <FontAwesomeIcon icon={faScrewdriverWrench} className="absolute left-2 z-[3] text-[var(--Font-Nav-shadow)]" />
                    <FontAwesomeIcon icon={faUser} className="absolute right-2 z-[3] text-[var(--Font-Nav-shadow)]" />
                    <div className="toggle z-[2] NeoContainer_outset_BR">
                        <input
                            className="toggle-state"
                            type="checkbox"
                            name="check"
                            value="check"
                            checked={login}
                            onChange={handleLogin}
                        />
                        <div className="indicator"></div>
                    </div>
                </label>
            </div>
            <Outlet />
        </section>
    )
}

export default Login
