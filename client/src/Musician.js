import { useState, useEffect } from "react";
import Login from "./login";
import Registration from "./registration";
import { Link } from "react-router-dom";


export default function Musician() {
    return (
        <div className="musician-pic-wrapper">
            <img src="./musician.png" />
            <div className="mus-pic-text">
                das leben ohne musik ist einfach ein irrtum
            </div>
        </div>
    );
}
