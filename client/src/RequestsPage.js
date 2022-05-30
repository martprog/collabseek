import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, addMessage } from "./redux/messages/slice";
import { getUserId } from "./redux/sessionId/slice";
// import { getOnlineUsers } from "./redux/online-users/slice";
import { Link } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import Conversation from "./Conversation";
import { useParams, useHistory } from "react-router";
import { getPrivateMessages } from "./redux/private-messages/slice";

export default function RequestsPage() {
    // const [isOpen, setIsOpen] = useState(false);
    const history = useHistory()
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await fetch("/users/conversations/all");
            const data = await res.json();
            if (data.length >= 1) {
                setChatMessages(data[0].userid);
                console.log(data);
                // const chatId = chatMessages && parseInt(chatMessages[0].id);
            }
        })();
    }, []);
    //render thousands of times!
    // }, [chatMessages]);

    return (
        <>
            {console.log(chatMessages, typeof chatMessages)}
            {typeof chatMessages === "number"
                ? history.push(`/conversation/${chatMessages}`)
                : ""}
            <h1>Messages</h1>
            <div className="msg-page">
                {chatMessages && <ChatMessages />}
                {/* <Conversation /> */}
            </div>
        </>
    );
}
