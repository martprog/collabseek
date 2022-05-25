// export function chatMessagesReducer(allChatMessages = [], action) {
//     if (action.type === "chatMessages: uploaded") {
//         console.log('all chat', allChatMessages);
//         allChatMessages = action.payload.allChatMessages;
//     } else if (action.type === "newMessage: uploaded") {
//         allChatMessages = [...allChatMessages, action.payload.msg];
//     }
//     return allChatMessages;
// }

export function privateMsgsReducer(privateMsgs = [], action) {
    if (action.type === "privateMsgs: uploaded") {
        privateMsgs = action.payload.privateMsgs;
    }
    // } else if (action.type === "newMessage: uploaded") {
    //     allChatMessages = [...allChatMessages, action.payload.msg];
    // }
    return privateMsgs;
}

export function getPrivateMessages(privateMsgs) {
    return {
        type: "privateMsgs: uploaded",
        payload: { privateMsgs },
    };
}

export function addMessage(msg) {
    return {
        type: "newMessage: uploaded",
        payload: {
            msg,
        },
    };
}
