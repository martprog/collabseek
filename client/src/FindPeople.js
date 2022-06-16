import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [isHidden, setIsHidden] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    // const [clicked, setClicked] = useState(false);
    const history = useHistory();
    const handleChange = (e) => {
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
                <div key={user.id} onClick={() => console.log("clicked")}>
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/users/${user.id}`}
                    >
                        <div className="finded-users-search-bar">
                            <img
                                src={user.profile_picture_url || "/default.png"}
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
    let showResults = !search ? "hidden-results" : "results-wrapper";

    return (
        <>
            <div className="search-container">
                <div className="form-group fg--search">
                    <input
                        className="searchbar search-field"
                        onFocus={(e) => {
                            setIsHidden(false);
                        }}
                        onBlur={(e) => {
                            // setTimeout(()=>setIsHidden(true), 100);
                            setTimeout(() => setSearch(""), 100);
                        }}
                        onChange={handleChange}
                        placeholder="Search artist"
                    ></input>
                    <button
                        onClick={() => history.push(`/search?s=${search}`)}
                        className="search-button"
                        type="submit"
                    >
                        <img src="/search.png" className="fa fa-search" />
                    </button>
                </div>

                <div className={showResults}>
                    <div className="results">
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
