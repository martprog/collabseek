import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";

export default function ArtistsByTag() {
    const [users, setUsers] = useState([]);
    const { tags } = useParams();

    useEffect(() => {
        let abort = false;

        fetch(`/tags/${tags}`)
            .then((res) => res.json())
            .then((results) => {
                console.log("cacccc", abort);
                if (!abort) {
                    console.log("holis", results);
                    setUsers(results);
                }
            });

        return () => (abort = true);
    }, []);

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
        <div>
            <h2>Artists by Tag: </h2>

            <div className="new-artists-wrapper">
                {users.length >= 1 ? mappedUsers() : <p>no matches found</p>}
            </div>
        </div>
    );
}
