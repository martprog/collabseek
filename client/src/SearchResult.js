import React from "react";

import { useState, useEffect } from "react";

import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";

export default function SearchResult() {
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const querySearch = query.get("s");

    const [users, setUsers] = useState([]);
    console.log("usuarios", users);
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
            <div className="results-page">
                <h1>Your results for &quot;{querySearch}&quot;...</h1>
                <div className="results-page-wrapper">
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
