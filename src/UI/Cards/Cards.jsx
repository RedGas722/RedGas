import { useState } from "react";
import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faScissors
} from '@fortawesome/free-solid-svg-icons';

export const Cards = ({ uniqueId, productos = [] }) => {
  const [processedImg, setProcessedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  // Convertir buffer de imagen a URL
  const convertirBufferAUrl = (imagen) => {
    if (!imagen || !imagen.data) return null;
    try {
      const bytes = new Uint8Array(imagen.data);
      const blob = new Blob([bytes], { type: "image/png" });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Error al convertir buffer:", err);
      return null;
    }
  };

  const handleRemoveBg = async () => {
    setLoading(true);
    setProcessedImg(null);

    const formData = new FormData();

    if (file) {
      formData.append("image_file", file);
    }

    formData.append("size", "auto");

    try {
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "TU_API_KEY_AQUI",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al quitar el fondo");

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImg(imageUrl);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Swiper
      modules={[Navigation]}
      loop={true}
      navigation={{
        prevEl: `.swiper-button-prev-${uniqueId}`,
        nextEl: `.swiper-button-next-${uniqueId}`,
      }}
      breakpoints={{
        1390: { slidesPerView: 4 },
        1080: { slidesPerView: 3 },
        640: { slidesPerView: 2 },
        320: { slidesPerView: 1 },
      }}
      id={`cardContainer-${uniqueId}`}
      className="w-[100%] flex justify-center items-center"
    >
      {productos.map((producto) => {
        const imgUrl = convertirBufferAUrl(producto.imagen);
        return (
          <SwiperSlide key={producto.id_producto}>
            <div className="flex justify-center items-center w-fit">
              <div className="shadow_box rounded-[20px] w-fit relative">
                <div className="cards_shadow clip-path-triangle h-[480px] text-white bg-glass-total rounded-[20px] w-[300px]">
                  <div className="flex justify-center items-center gap-[8px] mt-4">
                    <h4 className="text-3xl">{producto.nombre_producto}</h4>
                  </div>

                  <img
                    src={processedImg || localPreview || (producto.imagen ? `data:image/png;base64,${producto.imagen}` : "")}
                    alt="producto"
                    className="rounded-[20px] max-h-[300px] mx-auto mt-4"
                  />

                  <div className="absolute flex flex-col justify-center items-center bottom-[5px] left-[10px]">
                    <p className="text-white text-[28px]">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      }).format(producto.precio_producto || 0)}
                    </p>
                  </div>
                </div>

                <button
                  tabIndex="-1"
                  className="clip-path-triangle-inverse cursor-pointer flex justify-center text-[34px] items-end text-white rounded-t-[20px] rounded-br-[20px] w-[150px] h-[190px] bg-glass-1 bg-[#ffffff0f] absolute right-0 bottom-0"
                >
                  <FontAwesomeIcon icon={faCartShopping} className="absolute bottom-[12px]" />
                </button>

                <button
                  onClick={handleRemoveBg}
                  disabled={loading}
                  className="absolute top-[10px] left-[10px] bg-[#00000066] p-2 rounded-lg text-white hover:bg-[#00000088] transition"
                  title="Quitar fondo"
                >
                  {loading ? "..." : <FontAwesomeIcon icon={faScissors} />}
                </button>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Cards;