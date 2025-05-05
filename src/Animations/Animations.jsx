import React from "react";
import AnimatedDots from "./AnimatedDots/AnimatedDots";
import Circles from "./ColorCircles/Circles";

export const Animations = () => {
	return (
		<>
			<AnimatedDots />
			<Circles styleC1="left-[30%] bottom-0" styleC2="top-[100px]" styleC3="top-[400px] right-[80px]" />
		</>
	);
};
export default Animations;
