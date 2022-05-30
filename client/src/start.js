import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducer from "./redux/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import * as immutableState from "redux-immutable-state-invariant";
// import { init } from "./socketInit";
import io from "socket.io-client";
export const socket = io.connect();

// const store = createStore(
//     reducer,
//     composeWithDevTools(applyMiddleware(immutableState.default()))
// );

// init(store);

ReactDOM.render(
    // <Provider store={store}>

    <App />,
    // </Provider>,
    document.querySelector("main")
);
