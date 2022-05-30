import { useState, useEffect } from "react";
import Profile from "./Profile";
import Login from "./login";
import { Link } from "react-router-dom";
import Register from "./registration";
import ArtistsByTag from "./ArtistsByTag";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";


export default function LogNReg({
    first,
    last,
    bio,
    onBioUpload,
    profile_picture_url,
    openModal,
    
}) {
    return (
        <div className="mainWrapper">
            <div className="profileWrapper">
                <BrowserRouter>
                    <Login></Login>
                </BrowserRouter>
                <Profile
                    first={first}
                    last={last}
                    onBioUpload={onBioUpload}
                    profile_picture_url={profile_picture_url}
                    openModal={openModal}
                    bio={bio}
                    // onBioUpload={this.onBioUpload}>
                />
            </div>
            <div>
                <>
            </div>
        </div>
    );
}
