import { useState, useEffect } from "react";
//import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProfilCard from "./Profile-card";

export default function SearchResult(props) {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const [isChanged, setIsChanged] = useState(false);

    const querySearch = query.get("s");

    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (querySearch) {
            fetch(`/users?search=${querySearch}`)
                .then((res) => res.json())
                .then((results) => {
                    setUsers(results);
                });
        }
        return () => {
            setUsers([]);
        };
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
        <>
            <div className="results-page">
                <h1>Your results for &quot;{querySearch}&quot;...</h1>
                <div className="search-results-wrapper">
                    {users.length >= 1 ? (
                        mappedUsers()
                    ) : (
                        <p>no matches found</p>
                    )}
                </div>
            </div>
        </>
    );
}
