import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeartFull from "./icons/HeartFull";
import HeartEmpty from "./icons/HeartEmpty";
import Rating from "./Rating";
import ProfileCard from "./Profile-card";

export default function FeaturedArtists(props) {
    const [users, setUsers] = useState([]);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        fetch("/users/featuredartists")
            .then((res) => res.json())
            .then((results) => {
                setUsers(results);
                setIsChanged(false);
            });
    }, [isChanged]);

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
            );
        });
    };

    return (
        <>
            <div className="new-artists-main-wrapper">
                <h2>Featured Artists</h2>
                <div>{/* <p>&laquo</p> */}</div>
                <div className="prue">
                    <div className="new-artists-wrapper featured">
                        {users.length >= 1 ? (
                            mappedUsers()
                        ) : (
                            <p>no matches found</p>
                        )}
                    </div>
                    <div>{/* <p>&raquo</p> */}</div>
                </div>
            </div>
        </>
    );
}
