import { useState } from "react"

export const ShortText = ({ text }) => {
  const [verMas, setVerMas] = useState(false)

  return (
    <div>
      <p
        className={`text-[13px] pl-[5px] transition-all duration-300 ${verMas ? "line-clamp-none" : "line-clamp-3"
          }`}
      >
        {text}
      </p>
      {text.length > 100 && (
        <button
          onClick={() => setVerMas(!verMas)}
          className="text-[12px] text-[var(--Font-Nav)] underline mt-1 ml-[5px]"
        >
          {verMas ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  )
}
export default ShortText