import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    // const [clicked, setClicked] = useState(false);

    const handleChange = (e) => {
        console.log(e.target.value);
        setIsFocused(true);
        setSearch(e.target.value);
    };

   

    useEffect(() => {
        let abort = false;

        fetch(`/users?search=${search}`)
            .then((res) => res.json())
            .then((results) => {
                if (!abort) {
                    setUsers(results);
                }
            });

        return () => (abort = true);
    }, [search]);

    const mappedUsers = () => {
        return users.map((user) => {
            return (
                <div key={user.id}>
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/users/${user.id}`}
                    >
                        <div className="finded-users-search-bar">
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

    // let showResults = !isFocused ? "hidden-results" : search ? "results": "hidden-results";
    let showResults = !search ? "hidden-results" : "results";

    function onSubmit() {
        console.log("juan", users);
    }

    return (
        <>
            <div
            // className="wrapper"
            >
                <form></form>

                <div className="form-group fg--search">
                    <input
                        className="searchbar search-field"
                        onBlur={(e) => {
                            // setSearch("");
                        }}
                        onChange={handleChange}
                        placeholder="Search artist"
                    ></input>
                    <button
                        onClick={onSubmit}
                        className="search-button"
                        type="submit"
                    >
                        <img src="./search.png" className="fa fa-search" />
                    </button>
                </div>
                {/* <button>go!</button> */}
                <div className="results-wrapper">
                    <div className={showResults}>
                        {users.length >= 1 ? (
                            mappedUsers()
                        ) : (
                            <p>no matches found</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
