import { useState, useEffect } from "react";
import {  useHistory } from "react-router-dom";

// import { getUserId } from "./redux/sessionId/slice";
// import { useDispatch, useSelector } from "react-redux";

export default function FriendButton({ otherUserId }) {
    const [btnText, setBtnText] = useState("");
    const [isConnected, setIsConnected] = useState("");
    const history = useHistory();

    useEffect(() => {
        fetch("/user/id.json")
            .then((res) => res.json())
            .then((data) => {
                if (!data.userId) {
                    setIsConnected(false);
                } else {
                    setIsConnected(true);
                }
            })
            .catch((e) => console.log(e));
    }, [btnText]);

    useEffect(() => {
        fetch(`/hassentrequest/${otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "ok") {
                    setBtnText("Go to messages");
                } else {
                    console.log("user  logged in!");
                    setBtnText("Send Request");
                }
            })
            .catch((e) => console.log(e));
    }, [btnText]);

    const onRequest = () => {
        if (!isConnected) {
            location.replace("/login");
        } else {
            if (btnText === "Send Request") {
                history.push(`/request/${otherUserId}`);
            } else {
                history.push(`/conversation/${otherUserId}`);
            }
        }
    };

    return (
        <button className="btnFriendship" onClick={onRequest}>
            {btnText}
        </button>
    );
}
