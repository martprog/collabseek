import { combineReducers } from "redux";
import { friendsAndReqsReducer } from "./friends-and-reqs/slice";
import { chatMessagesReducer } from "./messages/slice";
import { userIdReducer } from "./sessionId/slice";
import { otherFriendsReducer } from "./other-friends/slice";
import { onlineUsersReducer } from "./online-users/slice";
import { privateMsgsReducer } from "./private-messages/slice";

const rootReducer = combineReducers({
    friendsAndReqs: friendsAndReqsReducer,
    chatMessages: chatMessagesReducer,
    userId: userIdReducer,
    otherFriends: otherFriendsReducer,
    onlineUsers: onlineUsersReducer,
    privateMsgs: privateMsgsReducer
});

export default rootReducer;
