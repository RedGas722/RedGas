import { jwtDecode } from "jwt-decode";

export function getUserInitialsFromToken(token) {
    try {
        const decoded = jwtDecode(token);
        const names = decoded.data.name.split(' ');
        const firstLetter = names[0].toUpperCase();
        if (firstLetter.length > 6) {
            const secondLetter = names[1]?.toUpperCase().slice(0, 1) || '';
            return firstLetter.slice(0, 1) + secondLetter;
        } else {
            return firstLetter;
        }
    } catch (e) {
        return 'Iniciar';
    }
}
