import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, addMessage } from "./redux/messages/slice";
import { getUserId } from "./redux/sessionId/slice";
// import { getOnlineUsers } from "./redux/online-users/slice";
import { Link } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import Conversation from "./Conversation"
import { getPrivateMessages } from "./redux/private-messages/slice";




export default function RequestsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const lastMessageRef = useRef(null);
    const dispatch = useDispatch();
    
   
    // const userId = useSelector((state) => state.userId && state.userId);
    // const onlineUsers = useSelector(
    //     (state) => state.onlineUsers && state.onlineUsers
    // );
   

    

    useEffect(() => {
        (async () => {
            const res = await fetch("/user/id.json");
            const data = await res.json();
            dispatch(getUserId(data.userId));
        })();
    }, []);

    // useEffect(() => {
    //     if (lastMessageRef.current) {
    //         lastMessageRef.current.scrollIntoView();
    //     }
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
