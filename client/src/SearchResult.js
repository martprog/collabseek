import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FindPeople from "./FindPeople";


export default function SearchResult() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`/users?search=${search}`)
            .then((res) => res.json())
            .then((results) => {
                setUsers(results);
            });
    }, [search]);

    const mappedUsers = () => {
        return users.map((user) => {
            return (
                <div key={user.id}>
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
                </div>
            );
        });
    };

    return (
        <>
            <div className="results-wrapper">
                {/* <FindPeople></FindPeople> */}

                <div>
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
