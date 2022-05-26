import { useState, useEffect } from "react";

import { useParams, useHistory } from "react-router";

import { CSSTransition } from "react-transition-group";
import FriendButton from "./FriendButton";
// import { getUserId } from "./redux/sessionId/slice";
import { useDispatch, useSelector } from "react-redux";
// import FriendsOtherProfile from "./FriendsOtherProfile";

export default function OtherProfile() {
    const dispatch = useDispatch();
    const [otherProfile, setOtherProfile] = useState({});
    const [transition, setTransition] = useState(true);

    const { otherUserId } = useParams();
    // const userId = useSelector((state) => state.userId && state.userId);

    // useEffect(() => {
    //     (async () => {
    //         const res = await fetch("/user/id.json");
    //         const data = await res.json();
    //         dispatch(getUserId(data.userId));
    //     })();
    // }, []);

    const history = useHistory();

    useEffect(() => {
        fetch(`/api/users/${+otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    history.push("/");
                    return;
                }
                setOtherProfile(data);
            });
    }, [otherProfile]);

    return (
        <>
            <CSSTransition
                in={transition}
                timeout={700}
                classNames="list-transition"
                appear
                exit
            >
                <div>
                    <div className="profileContainer">
                        <div className="profileRectangle"></div>
                        <div className="about">
                            <div>
                                <img
                                    src={
                                        otherProfile.profile_picture_url ||
                                        "../default.png"
                                    }
                                />
                            </div>
                            <h2>
                                {otherProfile.first} {otherProfile.last}
                            </h2>
                            <p>ABOUT ME</p>
                            <p>{otherProfile.bio}</p>
                            <FriendButton otherUserId={otherUserId} />
                        </div>
                    </div>

                    {/* <FriendsOtherProfile
                        otherUserId={otherUserId}
                    ></FriendsOtherProfile> */}
                </div>
            </CSSTransition>
        </>
    );
}
