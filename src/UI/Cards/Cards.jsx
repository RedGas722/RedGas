import React, { useState } from "react";
import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faArrowLeft,
    faHandPointUp,
    faCartShopping,
    faScissors
} from '@fortawesome/free-solid-svg-icons';

export const Cards = ({ uniqueId, imgContent, titleCatt, brandCatt, Price }) => {
    const [processedImg, setProcessedImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null); // Para imagen local
    const [localPreview, setLocalPreview] = useState(null); // Vista previa

    const API_KEY = "n9dFEVqC5NAYYcGQMRbqz9V8"; // ⚠️ Solo para pruebas

    function dividirConComaCada3Caracteres(cadena) {
        let resultado = "";
        for (let i = 0; i < cadena.length; i += 3) {
            resultado += cadena.substr(i, 3);
            if (i + 3 < cadena.length) {
                resultado += ",";
            }
        }
        return resultado;
    }

    const handleRemoveBg = async () => {
        setLoading(true);
        setProcessedImg(null);

        const formData = new FormData();

        if (file) {
            formData.append("image_file", file);
        } else {
            formData.append("image_url", imgContent);
        }

        formData.append("size", "auto");

        try {
            const res = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": API_KEY,
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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setProcessedImg(null);
        if (selectedFile) {
            setLocalPreview(URL.createObjectURL(selectedFile));
        }
    };

    const cards = Array.from({ length: 8 });

    return (
        <section id={`CardSect-${uniqueId}`} className="flex flex-col gap-[10px] h-fit w-[100%]">
            {/* Carga local */}
            <div className="flex flex-col gap-2 items-start px-4">
                <label className="text-white font-bold">Subir imagen local:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <Swiper
                modules={[Navigation]}
                loop={true}
                navigation={{
                    prevEl: `.swiper-button-prev-${uniqueId}`,
                    nextEl: `.swiper-button-next-${uniqueId}`,
                }}
                breakpoints={{
                    1390: { slidesPerView: 4, spaceBetween: 0 },
                    1080: { slidesPerView: 3, spaceBetween: 5 },
                    640: { slidesPerView: 2, spaceBetween: 5 },
                    320: { slidesPerView: 1, spaceBetween: 5 },
                }}
                id={`cardContainer-${uniqueId}`}
                className="w-[100%] flex justify-center items-center"
            >
                {cards.map((_, index) => (
                    <SwiperSlide key={index} id={`CardSect-${uniqueId}`}>
                        <div className="flex justify-center items-center w-fit">
                            <div className="shadow_box rounded-[20px] w-fit relative">
                                <div className="cards_shadow clip-path-triangle h-[480px] text-white bg-glass-total rounded-[20px] w-[300px]">
                                    <div className="flex justify-center items-center gap-[8px]">
                                        <h4 className="text-3xl">{titleCatt}</h4>
                                        <h3 className="font-black text-4xl">{brandCatt}</h3>
                                    </div>

                                    <img
                                        src={processedImg || localPreview || imgContent}
                                        alt="producto"
                                        className="rounded-[20px]"
                                    />

                                    <div className="absolute flex flex-col justify-center items-center bottom-[5px] left-[10px]">
                                        <p className="text-white text-[28px]">
                                            ${dividirConComaCada3Caracteres((Price || 0).toString())}
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
                ))}
            </Swiper>

            <div className="relative flex flex-col justify-center items-center w-[100%] text-white">
                <div className="flex justify-center items-center gap-[20px]">
                    <button className={`swiper-button-prev-${uniqueId} cursor-pointer`}>
                        <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
                    </button>
                    <button className={`swiper-button-next-${uniqueId} cursor-pointer`}>
                        <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
                    </button>
                </div>
                <FontAwesomeIcon icon={faHandPointUp} className="faHandPointUp text-[20px]" />
            </div>
        </section>
    );
};

export default Cards;
