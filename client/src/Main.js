import { useState, useEffect } from "react";
import Login from "./login";
import Registration from "./registration";
import { Link } from "react-router-dom";
import NewArtists from "./NewArtists";
import ArtistsByTag from "./ArtistsByTag";
import TagsMain from "./TagsMain";

export default function Main({
    first,
    last,
    bio,
    onBioUpload,
    profile_picture_url,
    openModal,
    isConnected,
    openLoginModal,
}) {
    return (
        <div className="mainWrapper">
            <div className="profileWrapper">
                {/* <Login
                    // openModal={openModal}
                    bio={bio}
                    onClick={openLoginModal}
                    // onBioUpload={this.onBioUpload}>
                />
                <Link to="/login" onClick={openLoginModal}>Login</Link> */}
            </div>
            <div>
                <NewArtists isConnected={isConnected}></NewArtists>
                <TagsMain isConnected={isConnected}></TagsMain>
            </div>
        </div>
    );
}
