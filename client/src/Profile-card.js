import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeartFull from "./icons/HeartFull";
import HeartEmpty from "./icons/HeartEmpty";
import Rating from "./Rating";

export default function ProfilCard(props) {
    const [users, setUsers] = useState([]);
    const [isChanged, setIsChanged] = useState(false);

    // useEffect(() => {
    //     fetch("/users/newartists")
    //         .then((res) => res.json())
    //         .then((results) => {
    //             setUsers(results);
    //             setIsChanged(false);
    //         });
    // }, [isChanged]);

    const changeFav = async (e, id, is_favorite) => {
        e.preventDefault();
        const artist = id;
        if (!props.isConnected) {
            location.replace("/login");
            return;
        }
        if (is_favorite) {
            const res = await fetch(`/favorites/remove/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ artist: artist }),
            });
            const data = await res.json();
            props.onRatingUpload();

            // setIsChanged(true);
            return;
        } else {
            const res = await fetch(`/favorites/add/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ artist: artist }),
            });
            const data = await res.json();
        }
        // setIsChanged(true);
        props.onRatingUpload();
    };

    return (
        // <div className="profile-card-main" key={props.key}>
        <>
            <form>
                <div
                    onClick={(e) => changeFav(e, props.id, props.is_favorite)}
                    className="heart-fav"
                >
                    {props.sender_id ? (
                        // <div className="heart"></div>
                        <HeartFull />
                    ) : (
                        <HeartEmpty />
                        // <div className="heart nofav"></div>
                    )}
                </div>
            </form>
            <Link style={{ textDecoration: "none" }} to={`/users/${props.id}`}>
                <div className="finded-users">
                    <img src={props.profile_picture_url || "./default.png"} />

                    <h3>
                        {props.first} {props.last}
                    </h3>
                    <p>{props.instrument}</p>
                </div>
            </Link>
            <Rating otherUserId={props.otherUserId} />
            <Link
                style={{ textDecoration: "none", textAlign: "center" }}
                to={props.isConnected ? `/request/${props.id}` : "/login"}
                className="profile-card-main-btn"
            >
                Send request
            </Link>
        </>
    );
}
