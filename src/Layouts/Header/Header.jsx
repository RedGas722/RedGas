import SearchBarr from "../../UI/Header/SearchBarr/SearchBarr";
import Navs from "../../UI/Header/Nav/Nav";
import ProfilePhoto from "../../UI/Header/ProfilePhoto/ProfilePhoto";
export const Header = () => {
    return (
        <div className="grid grid-cols-3 items-center  w-screen">
            <SearchBarr />
            <Navs />
            <ProfilePhoto />
        </div>
    )
}

export default Header;