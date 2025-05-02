import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faHandPointUp, faCartShopping } from '@fortawesome/free-solid-svg-icons';

export const Cards = ({ uniqueId, imgContent, titleCatt, brandCatt, Price }) => {
    
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

    const cards = Array.from({ length: 8 });

    return (
        <section id={`CardSect-${uniqueId}`} className="flex flex-col gap-[10px] h-fit w-[100%]">
            <Swiper
                modules={[Navigation]}
                loop={true}
                autoplay={{ delay: 2000 }}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: `.swiper-button-prev-${uniqueId}`,
                    nextEl: `.swiper-button-next-${uniqueId}`,
                }}
                breakpoints={{
                    1390: {
                        slidesPerView: 4,
                        spaceBetween: 0,
                    },
                    1080: {
                        slidesPerView: 3,
                        spaceBetween: 5,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 5,
                    },
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 5,
                    },
                }}
                id={`cardContainer-${uniqueId}`}
                className="w-[100%] flex justify-center items-center"
            >
                {cards.map((_, index) => (
                    <SwiperSlide key={index} id={`CardSect-${uniqueId}`}>
                        <div className="flex justify-center items-center w-fit">
                            <div id="cc" className="shadow_box rounded-[20px] w-fit relative">
                                <div className="cards_shadow clip-path-triangle h-[480px] text-white bg-glass-total rounded-[20px] w-[300px]">
                                    <div className="flex justify-center items-center gap-[8px]">
                                        <h4 className="text-3xl">{titleCatt}</h4>
                                        <h3 className="font-black text-4xl">{brandCatt}</h3>
                                    </div>
                                    <img src={imgContent} alt="" className="rounded-[20px]" />
                                    <div className="absolute flex flex-col justify-center items-center bottom-[5px] left-[10px] ">
                                        <p className="text-white text-[28px]">
                                            ${dividirConComaCada3Caracteres((Price || 0).toString())}
                                        </p>
                                    </div>
                                </div>
                                <button tabIndex='-1' className="clip-path-triangle-inverse cursor-pointer flex justify-center text-[34px] items-end text-white rounded-t-[20px] rounded-br-[20px] w-[150px] h-[190px] bg-glass-1 bg-[#ffffff0f] absolute right-0 bottom-0">
                                    <FontAwesomeIcon className="absolute bottom-[12px]" icon={faCartShopping }/>
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
