import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, addMessage } from "./redux/messages/slice";
import { getUserId } from "./redux/sessionId/slice";
// import { getOnlineUsers } from "./redux/online-users/slice";
import { Link } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import Conversation from "./Conversation";
import { getPrivateMessages } from "./redux/private-messages/slice";

export default function RequestsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const lastMessageRef = useRef(null);
    const dispatch = useDispatch();

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.toDateString()}`;
    }

    const chatMessages = useSelector(
        (state) => state.chatMessages && state.chatMessages
    );

    useEffect(() => {
        (async () => {
            const res = await fetch("/user/id.json");
            const data = await res.json();
            dispatch(getUserId(data.userId));
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const res = await fetch("/users/conversations/all");
            const data = await res.json();

            dispatch(getMessages(data));
            if (chatMessages) {
                // console.log(chatMessages[0].userid);
                location.replace(`/conversation/${+chatMessages[0].userid}`);
            }
        })();
    }, [chatMessages]);
    //render thousands of times!
    // }, [chatMessages]);


    

    return (
        <>
            <h1>Messages</h1>
            <div className="msg-page">
                
                <ChatMessages />
                {/* <Conversation /> */}
            </div>
        </>
    );
}
