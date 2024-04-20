import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <h1><Link to="/login">Login</Link></h1> <br />
            <h1><Link to="/signup">Sign-up</Link></h1>
        </>
    )
}
