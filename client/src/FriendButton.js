import { useState, useEffect } from "react";
// import { getUserId } from "./redux/sessionId/slice";
// import { useDispatch, useSelector } from "react-redux";

export default function FriendButton({ otherUserId }) {
    const [btnText, setBtnText] = useState("");
    const [isConnected, setIsConnected] = useState("");

    useEffect(() => {
        fetch("/user/id.json")
            .then((res) => res.json())
            .then((data) => {
                if (!data.userId) {
                    setIsConnected(false);
                } else {
                    console.log("user  logged in!");
                    setIsConnected(true);
                }
            })
            .catch((e) => console.log(e));
    }, [btnText]);

    const onRequest = () => {
        if (!isConnected) {
            location.replace("/login");
        } else {
            console.log("conectado!");
            location.replace(`/request/${otherUserId}`);
        }
    };

    return (
        <button className="btnFriendship" onClick={onRequest}>
            Send Request
        </button>
    );
}
