import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";


export default function Request() {
    const { otherUserId } = useParams();
    // const [search, setSearch] = useState("");
    // const [users, setUsers] = useState([]);
    const history = useHistory()

    function onSubmit(e) {
        const newText = e.target.text.value;
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
                location.replace(`/conversation/${otherUserId}`);
            });
        console.log("submit request!");
    }

    return (
        <>
            <div className="request-megawrapper">
                <div className="request-wrapper">
                    <h1>Request</h1>
                    <p>
                        Tell the artist about yourself and what project do you
                        have in mind
                    </p>
                    <form onSubmit={onSubmit}>
                        <textarea name="text"></textarea>
                        <div className="textareaBtns">
                            <button id="done-request-btn" className="btns">Done!</button>
                            <button id="cancel-request-btn" className="btns" type="button" onClick={()=> history.goBack("/")}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
