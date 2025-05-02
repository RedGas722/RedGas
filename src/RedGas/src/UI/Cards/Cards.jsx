import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Card from "./Card/Card";

export const Cards = () => {
    const cards = Array.from({ length: 8 });

    return (
        <section id="CardSect" className="flex flex-col h-fit w-[100%]">
            <Swiper
                modules={[Navigation]}
                autoplay={{ delay: 2000 }}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
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
                id="cardContainer"
            >
                {cards.map((_, index) => (
                    <SwiperSlide key={index} id="CardSect">
                        <Card />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="relative flex flex-col justify-center items-center w-fit text-white">
                <div className="flex justify-center items-center gap-[20px]">
                    <div className="swiper-button-prev cursor-pointer">
                        <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft text-[30px]" />
                    </div>
                    <div className="swiper-button-next cursor-pointer">
                        <FontAwesomeIcon icon={faArrowRight} className="faArrowRight text-[30px]" />
                    </div>
                </div>
                <FontAwesomeIcon icon={faHandPointUp} className="faHandPointUp text-[20px]" />
            </div>
        </section>
    );
};

export default Cards;