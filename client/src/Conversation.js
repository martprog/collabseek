import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  addMessage } from "./redux/messages/slice";
import { getPrivateMessages } from "./redux/private-messages/slice";
import { getUserId } from "./redux/sessionId/slice";
// import { getOnlineUsers } from "./redux/online-users/slice";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import ChatMessages from "./ChatMessages";




export default function Conversation() {
    const [isOpen, setIsOpen] = useState(false);
    const lastMessageRef = useRef(null);
    const dispatch = useDispatch();
    const { otherUserId } = useParams();
    

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.toDateString()}`;
    }

    const privateMsgs = useSelector(
        (state) => state.privateMsgs && state.privateMsgs
    );

    const userId = useSelector((state) => state.userId && state.userId);
    
    console.log(privateMsgs);

    useEffect(() => {
        (async () => {
            const res = await fetch("/user/id.json");
            const data = await res.json();
            dispatch(getUserId(data.userId));
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/users/conversation/${otherUserId}`);
            const data = await res.json();
            
            dispatch(getPrivateMessages(data));
        })();
    }, [otherUserId]);

    

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView();
        }
    }, [privateMsgs]);

    function handleSubmit(e) {
        e.preventDefault();
        
    }

    const msgs = privateMsgs.map((message) => {
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
                        to={
                            userId == message.sender_id
                                ? "/"
                                : `/users/${message.sender_id}`
                        }
                    >
                        <div className="msg-row">
                            <p>
                                {userId == message.sender_id ? (
                                    <strong>You</strong>
                                ) : (
                                    <strong>
                                        {message.first} {message.last}
                                    </strong>
                                )}
                            </p>
                            <p
                                className="datechat"
                                style={{
                                    marginLeft: ".8rem",
                                   
                                }}
                            >
                                <font size="1">
                                    {formatDate(message.created_at)}
                                </font>
                            </p>
                        </div>
                    </Link>
                    <p>{message.text}</p>
                </div>
            </div>
        );
    });


   

    return (
        <>
            <h1>Chat Room</h1>
            <div className="chatroom-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="chat-wrapper">
                        {privateMsgs.length >= 1 ? msgs : <h2>no messages</h2>}
                    </div>
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
                        <ChatMessages></ChatMessages>
                    </div>
                </form>
                
                
            </div>
        </>
    );
}
