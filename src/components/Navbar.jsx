import { Link } from "react-router-dom";
import SearchbBar from "./SearchBar";
import UserProfile from "./UserProfile";

export default function Navbar({ isAuthenticated, email }) {
    return (
        <header className="border-bottom-line white-background">
            <div className="container navbar">
                <div className="d-flex align-items-center">
                    <Link className="text-decor-none logo-display" to="/" >
                        <h1 className="logo-font m-0 p-0 text-center" style={{ fontSize: "30px" }}>reservista</h1>
                    </Link>
                </div>
                <SearchbBar />
                {isAuthenticated ? <UserProfile email={email} />
                    :
                    (<>
                        <Link to="/login" className="btn-primary-grey text-decor-none d-flex align-center ml-1" type="submit">Log in</Link>
                        <Link to="/signup" className="btn-primary text-decor-none d-flex align-center ml-1" type="submit">Creat Account</Link></>
                    )}

            </div>
        </header>
    )
}
