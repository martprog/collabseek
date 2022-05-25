import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";


export default function Request() {
    const { otherUserId } = useParams();
    // const [search, setSearch] = useState("");
    // const [users, setUsers] = useState([]);

    // const handleChange = (e) => {
    //     setSearch(e.target.value);
    // };

    // useEffect(() => {
    //     let abort = false;

    //     fetch(`/users?search=${search}`)
    //         .then((res) => res.json())
    //         .then((results) => {
    //             if (!abort) {
    //                 setUsers(results);
    //             }
    //         });

    //     return () => (abort = true);
    // }, [search]);

    function onSubmit(e) {
        const newText = e.target.text.value
        e.preventDefault();
        
        fetch(`/users/request/${otherUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: newText,
            })})
            .then((res) => res.json())
            .then((results) => {
                console.log(results);
            });
        console.log("submit request!");
    }

    return (
        <>
            <div className="find-megawrapper">
                <h1>Request</h1>
                <form onSubmit={onSubmit}>
                    <textarea name="text"></textarea>
                    <div className="textareaBtns">
                        <button className="btns">Done!</button>
                        <button className="btns" type="button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
