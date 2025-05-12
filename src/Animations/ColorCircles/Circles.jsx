import './Circles.css'

export const Circles = ({ styleC1, styleC2, styleC3 }) => {
    return (
        <>
            <div id="circle-1" className={styleC1}></div>
            <div id="circle-2" className={styleC2}></div>
            <div id="circle-3" className={styleC3}></div>
        </>
    )
}
export default Circles