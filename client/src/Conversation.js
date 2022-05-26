import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {   } from "./redux/messages/slice";
import { getPrivateMessages, addMessage } from "./redux/private-messages/slice";
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

    async function handleSubmit(e) {
        const newMsg = e.target.text.value;
        e.preventDefault();
        
        const res = await fetch(`/users/newMsg/${otherUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({msg: newMsg}),
        });
        const data = await res.json();
        
        dispatch(addMessage(data));
        
    }

    console.log('private msgs:', privateMsgs);

    const msgs = privateMsgs.map((message) => {
        return (
            <div
                className="private-msg-container"
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
                            <p>{message.text}</p>

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
                </div>
            </div>
        );
    });

    let chatUser;
    const chatUsermethod =  privateMsgs.filter((msg)=>{
        if (msg.userid !== userId){
            return  chatUser = msg.first
        }});
                                                                 

  

    return (
        <>
            <h1>Chat Room</h1>
            <div className="inbox-wrapper">
                <ChatMessages></ChatMessages>
                <div>
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
