import { useState, useEffect } from "react";

import { useParams, useHistory } from "react-router";

import { CSSTransition } from "react-transition-group";
import FriendButton from "./FriendButton";
// import { getUserId } from "./redux/sessionId/slice";

import FavoriteBtn from "./FavoriteBtn";
import Rating from "./Rating";
import ArtistsBySimilarTag from "./ArtistsBySimilarTag";

export default function OtherProfile() {
    // const dispatch = useDispatch();
    const [otherProfile, setOtherProfile] = useState({});
    const [transition, setTransition] = useState(true);

    const { otherUserId } = useParams();
    console.log(otherProfile);
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
    }, []);

    // }, [otherProfile]);
    console.log(otherProfile.tags);
    const tags =
        otherProfile.tags &&
        otherProfile.tags.map((tag, i) => {
            return (
                <div className="tags-in-profile" key={i}>
                    {tag}
                </div>
            );
        });

    return (
        <>
            <CSSTransition
                in={transition}
                timeout={700}
                classNames="list-transition"
                appear
                exit
            >
                <div className="profile-megawrapper-components">
                    <div className="profile-multiwrapper">
                        <h2>
                            {otherProfile.first} {otherProfile.last}
                        </h2>
                        <div className="profileContainer">
                            <div className="about">
                                <div className="pic-btns-profile-wrapper">
                                    <div className="other-profile-img-div">
                                        <img
                                            src={
                                                otherProfile.profile_picture_url ||
                                                "/default.png"
                                            }
                                        />
                                    </div>
                                    <div className="other-profile-btns-wrapper">
                                        <FriendButton
                                            otherUserId={otherUserId}
                                        />
                                        <FavoriteBtn
                                            otherUserId={otherUserId}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p>ABOUT ME</p>
                                    <p className="bio-text">{otherProfile.bio}</p>
                                    <div className="tags-profile-wrapper">
                                        {otherProfile.tags ? tags : ""}
                                    </div>

                                    <Rating otherUserId={otherUserId} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ArtistsBySimilarTag tags={otherProfile.tags} otherUserId={otherUserId}/>
                </div>
            </CSSTransition>
        </>
    );
}
