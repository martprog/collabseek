import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NewArtists() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/users/newartists")
            .then((res) => res.json())
            .then((results) => {
                setUsers(results);
            });

        // fetch("/favorites/all")
        //     .then((res) => res.json())
        //     .then((results) => {
        //         setUsers([...users, results]);
        //     });
    }, []);

    useEffect(() => {}, []);

    console.log("new artists", users);

    const mappedUsers = () => {
        return users.map((user) => {
            return (
                <div className="profile-card-main" key={user.id}>
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/users/${user.id}`}
                    >
                        <div className="finded-users">
                            <img
                                src={
                                    user.profile_picture_url || "./default.png"
                                }
                            />
                            <h3>
                                {user.first} {user.last}
                            </h3>
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: "none", textAlign: "center" }}
                        to={`/request/${user.id}`}
                        className="profile-card-main-btn"
                    >
                        Send request
                    </Link>
                </div>
            );
        });
    };

    return (
        <>
            <div>
                <h2>Discover recent Artists</h2>
                <div>
                    <p>&laquo</p>
                </div>
                <div className="new-artists-wrapper">
                    {users.length >= 1 ? (
                        mappedUsers()
                    ) : (
                        <p>no matches found</p>
                    )}
                </div>
                <div>
                    <p>&raquo</p>
                </div>
            </div>
        </>
    );
}
