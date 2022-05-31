import { useState, useEffect } from "react";
// import { getUserId } from "./redux/sessionId/slice";
// import { useDispatch, useSelector } from "react-redux";

export default function FavoriteBtn({ otherUserId }) {
    const [btnText, setBtnText] = useState("");
    const [isConnected, setIsConnected] = useState("");

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
        fetch(`/favorites/add/${otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                if (data.message === "friends") {
                    setBtnText("Remove from favorites");
                } else {
                    setBtnText("Add to favorites");
                }
            })
            .catch((e) => console.log(e));
    }, [btnText]);

    const onRequest = () => {
        if (!isConnected) {
            location.replace("/login");
        } else {
            if (btnText === "Add to favorites") {
                fetch(`/favorites/add/${otherUserId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setBtnText("Remove from favorites");
                        return;
                    });
            } else  if (btnText === "Remove from favorites") {
                fetch(`/favorites/remove/${otherUserId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setBtnText("Add to favorites");
                        return;
                    });
            }
        }
    };

    return (
        <button className="btnFavorite" onClick={onRequest}>
            {btnText}
        </button>
    );
}
