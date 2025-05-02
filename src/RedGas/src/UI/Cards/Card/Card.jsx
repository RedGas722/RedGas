import React from "react";
import "./Card.css";

export const Card = ({ children, className }) => {
    return (
        <div className={`shadow_box rounded-[20px] w-fit relative ${className}`}>
            {children}
        </div>
    );
};

export default Card;