import Navbar from "./components/Navbar";
import RestaurantList from "./components/RestaurantList";
import useAuth from "./hooks/useAuth";

export default function HomePage() {
    const { auth } = useAuth();
    // console.log(auth.isAuth);
    return (
        <>
            <Navbar isAuthenticated={auth.isAuth} email={auth.email}/>
            <div className="container mt-3">
                <RestaurantList isAuthenticated={auth.isAuth} />
            </div>
        </>
    )
}
 