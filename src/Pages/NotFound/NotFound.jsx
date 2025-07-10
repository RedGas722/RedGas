import { FuzzyText } from "../../UI/FuzzyText/FuzzyText"

export const NotFound = () => {
    return (
        <div className="flex flex-col h-dvh z-[2] items-center justify-center">
            <FuzzyText
                // color="var(--main-color)"
                baseIntensity={0.2}
                hoverIntensity={0.5}
                enableHover={true}
            >
                404
            </FuzzyText>

            <FuzzyText
                fontSize="25px"
                baseIntensity={0.1}
                hoverIntensity={0.2}
                enableHover={true}
            >
                Página no encontrada
            </FuzzyText>
        </div>
    )
}
export default NotFound