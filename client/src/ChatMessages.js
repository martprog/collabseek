import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getMessages, addMessage } from "./redux/messages/slice";
// import { getUserId } from "./redux/sessionId/slice";
// import { getOnlineUsers } from "./redux/online-users/slice";
import { Link } from "react-router-dom";
import Conversation from "./Conversation";

import { socket } from "./start";

export default function ChatMessages({ privateMsgs }) {
    const lastMessageRef = useRef(null);
    // const dispatch = useDispatch();
    // const chatMessages = useSelector(
    //     (state) => state.chatMessages && state.chatMessages
    // );
    // const userId = useSelector((state) => state.userId && state.userId);

    const [chatMessages, setChatMessages] = useState([]);

    socket.on("welcome", function (data) {
        console.log("churrito", data);
        socket.emit("thanks", {
            message: "Thank you. It is great to be here.",
        });
    });

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.toDateString()}`;
    }

    useEffect(() => {
        (async () => {
            const res = await fetch("/user/id.json");
            const data = await res.json();
            // dispatch(getUserId(data.userId));
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch("/users/conversations/all");
            const data = await res.json();
            setChatMessages(data);
            // dispatch(getMessages(data));
        })();
    }, [privateMsgs]);

    // }, [chatMessages]);

    const msgs = chatMessages.map((message) => {
        return (
            <div
                className="msg-container"
                key={message.id}
                ref={lastMessageRef}
            >
                <img src={message.profile_picture_url} />

                <div className="msg-details">
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/conversation/${message.userid}`}
                    >
                        <div>
                            {message.first}
                            {message.last}
                        </div>
                        <div className="msg-row">
                            <p>{message.text}</p>

                            <p
                                className="datechat"
                                style={{
                                    marginLeft: ".8rem",
                                    // width: "12rem",
                                }}
                            >
                                <font size="1">
                                    {formatDate(message.created_at)}
                                </font>
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        );
    });

    return (
        <>
            <div className="chatroom-multiwrapper">
                <h3>Your conversations</h3>
                <div className="chatroom-wrapper">
                    <div className="chat-wrapper">
                        {chatMessages.length >= 1 ? msgs : <h2>no messages</h2>}
                    </div>
                    <div className="chat-inpBtn"></div>
                </div>
            </div>
        </>
    );
}
