import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeartFull from "./icons/HeartFull";
import HeartEmpty from "./icons/HeartEmpty";
import Rating from "./Rating";
import ProfileCard from "./Profile-card";

export default function NewArtists(props) {
    const [users, setUsers] = useState([]);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        fetch("/users/newartists")
            .then((res) => res.json())
            .then((results) => {
                setUsers(results);
                setIsChanged(false);
            });
    }, [isChanged]);

    // const changeFav = async (e, otherUserId, is_favorite) => {
    //     console.log();
    //     e.preventDefault();
    //     const artist = otherUserId;
    //     if (!props.isConnected) {
    //         location.replace("/login");
    //         return;
    //     }
    //     if (is_favorite) {
    //         const res = await fetch(`/favorites/remove/${otherUserId}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ artist: artist }),
    //         });
    //         const data = await res.json();
    //         setIsChanged(true);
    //         return;
    //     } else {
    //         const res = await fetch(`/favorites/add/${otherUserId}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ artist: artist }),
    //         });
    //         const data = await res.json();
    //     }
    //     setIsChanged(true);
    // };
    function onRatingUpload() {
        if (!isChanged) {
            setIsChanged({ isChanged: true });
        } else {
            setIsChanged({ isChanged: false });
        }
    }

    const mappedUsers = () => {
        return users.map((user) => {
            return (
                <div className="profile-card-main" key={user.id}>
                    <ProfileCard
                        id={user.id}
                        is_favorite={user.is_favorite}
                        instrument={user.instrument}
                        otherUserId={user.artist_id}
                        isConnected={props.isConnected}
                        first={user.first}
                        last={user.last}
                        sender_id={user.sender_id}
                        profile_picture_url={user.profile_picture_url}
                        onRatingUpload={onRatingUpload}
                    />
                </div>
                // <div className="profile-card-main" key={user.id}>
                //     <form>
                //         <div
                //             onClick={(e) =>
                //                 changeFav(e, user.id, user.is_favorite)
                //             }
                //             className="heart-fav"
                //         >
                //             {user.sender_id ? (
                //                 // <div className="heart"></div>
                //                 <HeartFull />
                //             ) : (
                //                 <HeartEmpty />
                //                 // <div className="heart nofav"></div>
                //             )}
                //         </div>
                //     </form>
                //     <Link
                //         style={{ textDecoration: "none" }}
                //         to={`/users/${user.id}`}
                //     >
                //         <div className="finded-users">
                //             <img
                //                 src={
                //                     user.profile_picture_url || "./default.png"
                //                 }
                //             />

                //             <h3>
                //                 {user.first} {user.last}
                //             </h3>
                //             <p>{user.instrument}</p>
                //         </div>
                //     </Link>
                //     <Rating otherUserId={user.artist_id} />
                //     {console.log('turcooo', typeof user.artist_id)}

                //     <Link
                //         style={{ textDecoration: "none", textAlign: "center" }}
                //         to={
                //             props.isConnected ? `/request/${user.id}` : "/login"
                //         }
                //         className="profile-card-main-btn"
                //     >
                //         Send request
                //     </Link>
                // </div>
            );
        });
    };

    return (
        <>
            <div className="new-artists-main-wrapper">
                <h2>Discover recent Artists</h2>
                <div>{/* <p>&laquo</p> */}</div>
                <div className="new-artists-wrapper">
                    {users.length >= 1 ? (
                        mappedUsers()
                    ) : (
                        <p>no matches found</p>
                    )}
                </div>
                <div>{/* <p>&raquo</p> */}</div>
            </div>
        </>
    );
}
