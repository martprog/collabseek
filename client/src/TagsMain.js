import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";

export default function TagsMain() {
    const [tags, setTags] = useState([]);
    // const { tags } = useParams();

    useEffect(() => {
        fetch(`/tags/all`)
            .then((res) => res.json())
            .then((results) => {
                if (results) {
                    setTags(results);
                }
            });
    }, []);

    const mappedUsers = () => {
        return tags.map((elem) => {
            return (
                <div className="profile-card-main" key={elem.tag}>
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/artistsbytags/${elem.tag}`}
                    >
                        <div className="finded-users">
                            <h3>{elem.tag}</h3>
                            <h3>({elem.amount_tags})</h3>
                        </div>
                    </Link>
                </div>
            );
        });
    };

    return (
        <>
            <div>
                <h2>Artists by Tag</h2>
                <div className="new-artists-wrapper">
                    {tags.length >= 1 ? mappedUsers() : <p>no matches found</p>}
                </div>
            </div>
        </>
    );
}
