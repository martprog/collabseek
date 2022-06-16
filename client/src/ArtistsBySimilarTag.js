import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import ProfilCard from "./Profile-card";

export default function ArtistsBySimilarTag({
    tags,
    isConnected,
    otherUserId,
}) {
    const [users, setUsers] = useState([]);
    // const { tags } = useParams();
    const [isChanged, setIsChanged] = useState(false);
    const searchTags = tags && tags[0];

    useEffect(() => {
        let abort = false;

        fetch(`/tags/${searchTags}`)
            .then((res) => res.json())
            .then((results) => {
                if (!abort) {
                    setUsers(results);
                    setIsChanged(false);
                }
            });

        return () => (abort = true);
    }, [users]);

    function onRatingUpload() {
        if (!isChanged) {
            setIsChanged({ isChanged: true });
        } else {
            setIsChanged({ isChanged: false });
        }
    }

    const filteredUsers = users.filter(
        (user) => user.id !== parseInt(otherUserId)
    );

    const mappedUsers = () => {
        return filteredUsers.map((user) => {
            return (
                <div className="profile-card-main" key={user.id}>
                    <ProfilCard
                        id={user.id}
                        is_favorite={user.is_favorite}
                        instrument={user.instrument}
                        otherUserId={user.artist_id}
                        isConnected={isConnected}
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
            <h2>Other artists in: &quot;{searchTags}&quot; </h2>

            <div className="similar-tags-wrapper">
                {users.length >= 1 ? mappedUsers() : <p>no matches found</p>}
            </div>
        </div>
    );
}
