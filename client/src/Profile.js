import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";
import { useState } from "react";
import {
    Transition,
    CSSTransition,
    SwitchTransition,
    TransitionGroup,
} from "react-transition-group";

export default function Profile({
    first,
    last,
    bio,
    onBioUpload,
    profile_picture_url,
    openModal,
    spotify_link,
    youtube_link,
    tags,
}) {
    const [inProp, setProp] = useState(true);

    return (
        <CSSTransition
            in={inProp}
            timeout={700}
            classNames="profile-transition"
            appear
        >
            <div className="profileContainer">
                <div className="profileRectangle"></div>
                <ProfilePic url={profile_picture_url} openModal={openModal} />
                <div className="about">
                    <h2>
                        {first} {last}
                    </h2>
                    <p>ABOUT ME</p>

                    <BioEditor
                        spotify_link={spotify_link}
                        youtube_link={youtube_link}
                        tags={tags}
                        last={last}
                        bio={bio}
                        first={first}
                        onBioUpload={onBioUpload}
                    />
                    <div className="links-container">
                        {spotify_link ? (
                            <a href={spotify_link}>
                                {" "}
                                <img id="spotify-log" src="./spotify.png" />
                            </a>
                        ) : (
                            ""
                        )}
                        {youtube_link ? (
                            <a href={youtube_link}>
                                {" "}
                                <img id="youtube-logo" src="./youtube.png" />
                            </a>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
