import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import ProfilCard from "./Profile-card";

export default function ArtistsByTag(props) {
    const [users, setUsers] = useState([]);
    const { tags } = useParams();
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        // let abort = false;

        fetch(`/tags/${tags}`)
            .then((res) => res.json())
            .then((results) => {
                // if (!abort) {
                // }
                setUsers(results);
                setIsChanged(false);
            });

        // return () => (abort = true);
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
                    <ProfilCard
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
        <div>
            <h2>Artists by Tag: </h2>

            <div className="new-artists-wrapper">
                {users.length >= 1 ? mappedUsers() : <p>no matches found</p>}
            </div>
        </div>
    );
}
