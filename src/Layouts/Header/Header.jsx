import SearchBarr from "../../UI/Header/SearchBarr/SearchBarr";
import Navs from "../../UI/Header/Nav/Nav";
import ProfilePhoto from "../../UI/Header/ProfilePhoto/ProfilePhoto";
import './Header.css'
export const Header = () => {
    return (
        <div id="Header" className="items-center w-[100%]">
            <SearchBarr />
            <Navs />
            <ProfilePhoto />
        </div>
    )
}

export default Header;