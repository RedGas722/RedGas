import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const URL_GET = 'http://localhost:10101/TecnicoServicesGet'

export const Technica = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }

        const decode = jwtDecode(token)
        const id = decode.data.id

        const fetchData = async () => {

            try {
                const res = await fetch(`${URL_GET}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ technicianId: id }),
                })

                const dataInfo = await res.json()
                console.log(dataInfo.get);
            } catch (err) {

            }
        }

        fetchData()
    }, [])







    return (
        <div>Technica</div>
    )
}
export default Technica