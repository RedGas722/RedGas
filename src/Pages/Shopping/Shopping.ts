type Products = {
    Image: string;
    Title1: string;
    Description: string;
    Price: number;
};

export const products: Products[] = [
    { Image: "https://armogas.com/wp-content/uploads/2024/06/calentador-8l-tn-mecanico-rheem-img-01.jpg", Title1: "Calentador de agua", Description: "Gas natural", Price: 2_850_000 },
    { Image: "https://armogas.com/wp-content/uploads/2024/06/calentador-8l-tn-mecanico-rheem-img-01.jpg", Title1: "Calentador instantáneo", Description: "Alta eficiencia", Price: 3_600_000 },
    { Image: "https://pcmeng.com/wp-content/uploads/2022/08/B_V2069-041.jpg", Title1: "Quemador para estufa", Description: "Latón reforzado", Price: 650_000 },
    { Image: "https://pcmeng.com/wp-content/uploads/2022/08/B_V2069-041.jpg", Title1: "Válvula de seguridad", Description: "Para estufa de gas", Price: 450_000 },
    { Image: "https://depositosmiranda.com/fotos/tienda/productos/675_1_REGULADOR%20DE%20GAS%20AZUL.png", Title1: "Regulador de gas", Description: "Alta presión", Price: 900_000 },
    { Image: "https://depositosmiranda.com/fotos/tienda/productos/675_1_REGULADOR%20DE%20GAS%20AZUL.png", Title1: "Regulador automático", Description: "Protección extra", Price: 1_150_000 },
    { Image: "https://saucyintruder.org/wp-content/uploads/9/9/b/99be6cd58a0a0922af629d39950554d9.jpeg", Title1: "Manguera de gas", Description: "Flexible y segura", Price: 300_000 },
    { Image: "https://saucyintruder.org/wp-content/uploads/9/9/b/99be6cd58a0a0922af629d39950554d9.jpeg", Title1: "Manguera reforzada", Description: "Para alta presión", Price: 390_000 },
    { Image: "https://greenforest.com.co/wp-content/uploads/2018/03/hombre-solo-e1735308449637.jpg", Title1: "Llave de gas", Description: "Ajuste rápido", Price: 550_000 },
    { Image: "https://greenforest.com.co/wp-content/uploads/2018/03/hombre-solo-e1735308449637.jpg", Title1: "Detector de fugas", Description: "Alta precisión", Price: 1_050_000 },
];
export default products;
console.log(products)
