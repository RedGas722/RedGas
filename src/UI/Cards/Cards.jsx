import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faArrowLeft,
    faCartShopping,
}
    from '@fortawesome/free-solid-svg-icons';

export const Cards = ({ uniqueId, imgContent, titleCatt, Price, brandCatt }) => {


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
                navigation={{
                    prevEl: `.swiper-button-prev-${uniqueId}`,
                    nextEl: `.swiper-button-next-${uniqueId}`,
                }}
                breakpoints={{
                    1390: { slidesPerView: 5, spaceBetween: 0 },
                    1080: { slidesPerView: 4, spaceBetween: 5 },
                    852: { slidesPerView: 3, spaceBetween: 5 },
                    500: { slidesPerView: 2, spaceBetween: 5 },
                    320: { slidesPerView: 1, spaceBetween: 5 },
                }}
                id={`cardContainer-${uniqueId}`}
                className="w-[100%] flex justify-center items-center"
            >
                {cards.map((_, index) => (
                    <SwiperSlide key={index} id={`CardSect-${uniqueId}`}>
                        <div className="flex justify-center justify-self-center h-fit p-[25px_0_25px_0] items-center w-fit">
                            <div className="card NeoSubContainer_outset_TL">
                                <div className="card-img">
                                    <div className="img"> <img
                                        src={imgContent}
                                        alt="producto"
                                        className="rounded-[20px]"
                                    /></div>
                                </div>
                                <div className="flex gap-1 items-end justify-center">
                                    <div className="card-title">{titleCatt}</div>
                                    <div className="font-black text-[18px]">{brandCatt}</div>
                                </div>
                                <div className="card-subtitle">Product description. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                                <hr className="card-divider" />
                                <div className="card-footer">
                                    <div className="card-price">
                                        <span>$</span> {dividirConComaCada3Caracteres((Price || 0).toString())}
                                    </div>
                                    <button className="card-btn hover:text-[#ffff]">
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="flex flex-col justify-center items-center self-center w-fit p-[10px] NeoSubContainer_outset_TL text-[var(--main-color)]">
                <div className="flex justify-center items-center gap-[20px]">
                    <button className={`arrow NeoSubContainer_outset_TL p-[7px] swiper-button-prev-${uniqueId} cursor-pointer`}>
                        <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
                    </button>
                    <button className={`arrow NeoSubContainer_outset_TL p-[7px] swiper-button-next-${uniqueId} cursor-pointer`}>
                        <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Cards;
