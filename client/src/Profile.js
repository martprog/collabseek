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
                    
                </div>
                <ProfilePic className="profile-pic" spotify_link={spotify_link} youtube_link={youtube_link} url={profile_picture_url} openModal={openModal} />
            </div>
        </CSSTransition>
    );
}
