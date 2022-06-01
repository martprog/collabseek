import { useEffect, useState } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { getFriends, accept, unfriend } from "./redux/friends-and-reqs/slice";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import ProfilCard from "./Profile-card";

export default function Favorites(props) {
    const [favorites, setFavorites] = useState("");
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch("/favorites/all");
            const data = await res.json();
            setFavorites(data);
        })();
    }, [isChanged]);

    function onRatingUpload() {
        if (!isChanged) {
            setIsChanged({ isChanged: true });
        } else {
            setIsChanged({ isChanged: false });
        }
    }

    const mappedFavorites = () => {
        return favorites.map((favorite) => {
            return (
                <div className="profile-card-main" key={favorite.id}>
                    {console.log(favorite)}
                    <ProfilCard
                        id={favorite.id}
                        is_favorite={favorite.is_favorite}
                        instrument={favorite.instrument}
                        otherUserId={favorite.id}
                        isConnected={props.isConnected}
                        first={favorite.first}
                        last={favorite.last}
                        sender_id={favorite.sender_id}
                        profile_picture_url={favorite.profile_picture_url}
                        onRatingUpload={onRatingUpload}
                    />
                    {/* <Link
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
                    </Link> */}
                </div>
            );
        });
    };

    return (
        <>
            <h1>Favorites</h1>

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
