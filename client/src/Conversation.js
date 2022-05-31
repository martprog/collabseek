import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import ChatMessages from "./ChatMessages";
import { socket } from "./start";

export default function Conversation() {
    const lastMessageRef = useRef(null);
    // const dispatch = useDispatch();
    const { otherUserId } = useParams();
    const [otherProfile, setOtherProfile] = useState({});
    const [user, setUser] = useState({});
    const [userId, setUserId] = useState(null);
    const [privateMsgs, setPrivateMsgs] = useState([]);

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.toDateString()}`;
    }

    useEffect(() => {
        (async () => {
            const res = await fetch("/user/id.json");
            const data = await res.json();
            // setUser(data);
            setUserId(data.userId);
        })();

        (async () => {
            const res = await fetch("/user/me.json");
            const data = await res.json();
            setUser(data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/users/conversation/${otherUserId}`);
            const data = await res.json();
            setPrivateMsgs(data);
            socket.emit("readMsgs", data[0]);
        })();

        fetch(`/api/users/${+otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                setOtherProfile(data);
            });
    }, [otherUserId]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView();
        }

        // socket.emit("message", privateMsgs)
    }, [privateMsgs]);

    async function handleSubmit(e) {
        const newMsg = e.target.text.value;
        e.preventDefault();

        const res = await fetch(`/users/newMsg/${otherUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ msg: newMsg }),
        });
        const data = await res.json();

        setPrivateMsgs([...privateMsgs, data]);
        // socket.emit("message", data)
        e.target.text.value = "";
    }

    const msgs = privateMsgs.map((message) => {
        return (
            <div
                className="private-msg-container"
                key={message.id}
                ref={lastMessageRef}
            >
                <Link
                    style={{ textDecoration: "none" }}
                    to={
                        userId == message.sender_id
                            ? "/"
                            : `/users/${message.sender_id}`
                    }
                >
                    <div className="date-chat">
                        <font size="1">{formatDate(message.created_at)}</font>
                    </div>
                    <div className="imga">
                        <img
                            src={
                                userId == message.sender_id
                                    ? user.profile_picture_url
                                    : otherProfile.profile_picture_url
                            }
                        />
                    </div>
                </Link>

                <div className="msg-details">
                    <div className="msg-row">
                        <p>
                            {userId == message.sender_id ? (
                                <strong>You</strong>
                            ) : (
                                <strong>
                                    {otherProfile.first} {otherProfile.last}
                                </strong>
                            )}
                        </p>
                        <p className="chat-text">{message.text}</p>

                        <p
                            className="datechat"
                            style={{
                                marginLeft: ".8rem",
                            }}
                        ></p>
                    </div>
                </div>
            </div>
        );
    });

    let chatUser;
    const chatUsermethod = privateMsgs.filter((msg) => {
        if (msg.userid !== userId) {
            return (chatUser = msg.first);
        }
    });

    return (
        <>
            <h1>Chat Room</h1>
            <div className="inbox-wrapper">
                <ChatMessages privateMsgs={privateMsgs}></ChatMessages>
                <div className="private-msgs-multiwrapper">
                    <h3>{chatUser}</h3>
                    <div className="private-msgs-wrapper">
                        <div className="chatroom-wrapper">
                            <div className="chat-wrapper">
                                {privateMsgs.length >= 1 ? (
                                    msgs
                                ) : (
                                    <h2>no messages</h2>
                                )}
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="chat-inpBtn">
                            <input
                                type="text"
                                name="text"
                                required
                                autoComplete="off"
                                placeholder="write something"
                            />
                            <div className="textareaBtns">
                                <button className="btns">Done!</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div>Other module</div>
            </div>
        </>
    );
}
