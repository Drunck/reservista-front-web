import { Link } from "react-router-dom"

export default function RestaurantCard({ restaurant, isAuthenticated }) {
    return (
        <div className="card all-linear">
            <div style={{ backgroundImage: `url(${restaurant.imageUrl})` }} className="card-bg-image" alt={restaurant.name}>
            </div>
            <Link to={`/restaurants/${restaurant.id}`} className="text-decor-none">
                <div className="card-body">
                    <p className="card-title m-0 p-0">{restaurant.name}</p>
                    <div className="d-flex align-center mt-1">
                        {/* <img className="card-icon" src="icons/pin-svgrepo-com.svg" /> */}
                        {/* <img className="card-icon" src="icons/geolocalize-01-svgrepo-com.svg" /> */}
                        {/* <img className="card-icon" src="icons/location-svgrepo-com.svg" /> */}
                        <img className="card-icon" src="icons/location-svgrepo-com-line.svg" alt="location-icon" />
                        {/* <p className="card-subtitle m-0 p-0 ml-1">{ restaurant.address }</p> */}
                        <span className="card-subtitle m-0 p-0 ml-1" title={`${restaurant.address}`}>{restaurant.address}</span>
                    </div>
                </div>
            </Link>
            {isAuthenticated ?
                (
                    <div className="card-footer">
                        <Link to={`/restaurants/${restaurant.id}/book-table`} className="btn-link text-decor-none d-flex align-center text-center content-center mt-1 mb-1 all-linear" type="submit">Book A Table</Link>
                    </div>
                ) : ""}

        </div>
    )
}
