import { useEffect, useState } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { getFriends, accept, unfriend } from "./redux/friends-and-reqs/slice";
import { Link } from "react-router-dom";
import swal from "sweetalert";

export default function Favorites() {
    const [favorites, setFavorites] = useState("");

    useEffect(() => {
        (async () => {
            const res = await fetch("/favorites/all");
            const data = await res.json();
            setFavorites(data);
        })();
    }, []);

    const mappedFavorites = () => {
        return favorites.map((favorite) => {
            return (
                <div className="profile-card-main" key={favorite.id}>
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/users/${favorite.id}`}
                    >
                        <div className="finded-users">
                            <img
                                src={
                                    favorite.profile_picture_url ||
                                    "./default.png"
                                }
                            />
                            <h3>
                                {favorite.first} {favorite.last}
                            </h3>
                        </div>
                    </Link>
                </div>
            );
        });
    };

    return (
        <>
            <h1>Favorites</h1>
            <p>juanes</p>
            {console.log(favorites)}
            <div className="new-artists-wrapper">
                {favorites.length >= 1 ? (
                    mappedFavorites()
                ) : (
                    <p>You do not have any favorites </p>
                )}
            </div>
        </>
    );
}
