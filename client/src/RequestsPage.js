import { useEffect, useRef, useState } from "react";

// import { getOnlineUsers } from "./redux/online-users/slice";
import { Link } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import Conversation from "./Conversation";
import {  useHistory } from "react-router";


export default function RequestsPage() {
    // const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await fetch("/users/conversations/all");
            const data = await res.json();
            if (data.length >= 1) {
                setChatMessages(data[0].userid);

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
