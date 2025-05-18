interface Usuario {
    foto: string;
    nombre: string;
    calificacion: number;
}

// Función para generar un número aleatorio entre 1 y 5
const generarCalificacion = (): number => Math.floor(Math.random() * 5) + 1;

const usuarios: Usuario[] = [
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Johan David Villanueva Gallego", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "María González", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Carlos López", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Ana Rodríguez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Luis Martínez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Sofía Ramírez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "David Herrera", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Gabriela Torres", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Fernando Ruiz", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Isabel Castro", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Ricardo Mendoza", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Patricia Vargas", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Alejandro Mora", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Cristina López", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Manuel Jiménez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Elena Ramírez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Andrés Romero", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Paola Rodríguez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Jorge Castro", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Valeria García", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Esteban Herrera", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Daniela Torres", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Raúl Sánchez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Natalia Paredes", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Adrián Muñoz", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Laura Castillo", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Hugo Fernández", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Camila Ríos", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Mateo Salazar", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Lucía Ortiz", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Sebastián Pérez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Marta Delgado", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Felipe González", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Andrea Vargas", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Tomás Rojas", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Carla Mendoza", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Samuel Ramírez", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Beatriz Acosta", calificacion: generarCalificacion() },
    { foto: "https://i.pinimg.com/736x/dc/8c/61/dc8c61ed46f55b3245c2c8dacc863029.jpg", nombre: "Emilio Vargas", calificacion: generarCalificacion() }
];

export default usuarios;
