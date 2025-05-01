import "./Cards.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export const Cards = () => {
	const cards = Array.from({ length: 8 });
	return (
		<section id="CardSect" className="h-fit w-[100%] ">
			<Swiper
				spaceBetween={20}
				slidesPerView={4}
				loop={true}
				autoplay={{ delay: 2500, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				navigation
			>
				{cards.map((_, index) => (
					<SwiperSlide
						key={index}
						style={{ width: "300px", height: "380px" }}
                        className="w-fit h-fit "
					>
						<div className="cards_shadow clip-path-triangle h-[380px] bg-glass-total rounded-[20px] w-[300px]"></div>
						<div className="clip-path-triangle-inverse rounded-t-[20px] rounded-br-[20px] w-[150px]  h-[160px] bg-glass-1 bg-[#ffffff06] absolute left-[150px] bottom-0"></div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export default Cards;
