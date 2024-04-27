import RestaurantCard from './RestaurantCard'

export default function RestaurantList({ isAuthenticated }) {

    const restaurants = [
        { id: 1, name: "CrepeCafe", address: "​Улица Динмухамед Конаев, 12/1", imageUrl: "images/crepecafe.png" },
        { id: 2, name: "Melissa", address: "Улица Жекебатыр, 47", imageUrl: "images/melissa.png" },
        { id: 3, name: "ШашлыкоFF", address: "​Амангельды Иманова улица, 52", imageUrl: "images/shashlikoff.jpeg" },
        { id: 4, name: "Lugano", address: "Проспект Абая, 39", imageUrl: "images/lugano.jpg" },
        { id: 5, name: "CrepeCafe", address: "​Улица Динмухамед Конаев, 12/1", imageUrl: "images/crepecafe.png" },
    ]

    return (
        <div className="group d-flex flex-wrap">
            {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} isAuthenticated={isAuthenticated}/>
            ))}
        </div>
    )
}
