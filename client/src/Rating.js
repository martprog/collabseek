import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Rating({ otherUserId }) {
    // const [rating, setRating] = useState([]);
    const [clicked, setClicked] = useState([false, false, false, false, false]);

    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        fetch(`/users/rating/${otherUserId}`)
            .then((res) => res.json())
            .then(({ round }) => {
                console.log("ratings, ", typeof round);
                if (!round) {
                    return;
                } else if (round == "1") {
                    setClicked([true, false, false, false, false]);
                } else if (round == "2") {
                    setClicked([true, true, false, false, false]);
                } else if (round == "3") {
                    setClicked([true, true, true, false, false]);
                } else if (round == "4") {
                    setClicked([true, true, true, true, false]);
                } else if (round == "5") {
                    setClicked([true, true, true, true, true]);
                }
            });
    }, [isChanged]);

    const handleStarClick = async (e, index) => {
        e.preventDefault();
        let count = 0;
        let clickStates = [...clicked];
        for (let i = 0; i < 5; i++) {
            if (i <= index) count++;
            // if (i <= index) clickStates[i] = true;
            // else clickStates[i] = false;
        }
        const res = await fetch(`/users/rating/post/${otherUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating: count }),
        });
        const data = await res.json();
        console.log("ratinggggg: ", data);
        setIsChanged(true);
        setClicked(clickStates);
    };

    return (
        <div className="rating">
            {/* {console.log(object)} */}
            <p>Rating</p>
            <div>
                <span
                    onClick={(e) => handleStarClick(e, 0)}
                    className={clicked[0] ? "clickedstar" : null}
                >
                    &#9733;
                </span>
                <span
                    onClick={(e) => handleStarClick(e, 1)}
                    className={clicked[1] ? "clickedstar" : null}
                >
                    &#9733;
                </span>
                <span
                    onClick={(e) => handleStarClick(e, 2)}
                    className={clicked[2] ? "clickedstar" : null}
                >
                    &#9733;
                </span>
                <span
                    onClick={(e) => handleStarClick(e, 3)}
                    className={clicked[3] ? "clickedstar" : null}
                >
                    &#9733;
                </span>
                <span
                    onClick={(e) => handleStarClick(e, 4)}
                    className={clicked[4] ? "clickedstar" : null}
                >
                    &#9733;
                </span>
            </div>
        </div>
    );
}
