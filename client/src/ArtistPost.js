import { Component } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export default class ArtistPost extends Component {
    constructor() {
        super();
        this.state = { isOn: true };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log(this.state)
        );
    }

    handleSubmit(e) {
        this.setState({ error: false });

        e.preventDefault();
        fetch("/users/artist/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.message == 'error') {
                    this.setState({ error: true });
                }
                if (result.message == 'ok') {
                    location.replace("/");
                    this.setState({ error: false });
                }
            })
            .catch((e) => console.log("oops,", e));
    }

    render() {
        
        return (
            <>
                {this.state.isOn && (
                    <CSSTransition
                        in={this.state.isOn}
                        timeout={500}
                        classNames="registration-transition"
                        appear
                    >
                        <div className={this.state.error ? "wronglog" : ""}>
                            <div className="registration">
                                <h1>Create artist page</h1>
                                {this.state.error && (
                                    <p className="p_log">
                                        Oops, something went wrong!
                                    </p>
                                )}
                                <div className="form-artist-wrapper">
                                    <form
                                        className="form"
                                        onSubmit={this.handleSubmit}
                                    >
                                        <input
                                            onChange={this.handleChange}
                                            placeholder="tell us about yourself"
                                            type="text"
                                            name="bio"
                                        ></input>
                                        <input
                                            onChange={this.handleChange}
                                            placeholder="spotify"
                                            type="text"
                                            name="spotify"
                                        ></input>
                                        <input
                                            onChange={this.handleChange}
                                            placeholder="youtube"
                                            type="email"
                                            name="youtube"
                                        ></input>

                                        <button id="submitReg">SUBMIT</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                )}
            </>
        );
    }
}
