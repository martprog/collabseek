import { Component } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useParams, useHistory } from "react-router";


export default class ArtistPost extends Component {
    constructor() {
        super();
        this.state = { isOn: true, search: "", isOpen: false, tagsList: [] };
        this.handleChange = this.handleChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.mappedUsers = this.mappedUsers.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleTagChange(e) {
        this.setState(
            {
                tag: e.target.value,
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
                if (result.message == "error") {
                    this.setState({ error: true });
                }
                if (result.message == "ok") {
                    location.replace("/");
                    this.setState({ error: false });
                }
            })
            .catch((e) => console.log("oops,", e));
    }

    componentDidMount() {
        fetch("/user/me.json")
            .then((res) => res.json())
            .then((data) => {
                if (!data.artist_id) {
                    console.log(data);
                } else {
                    location.replace("/aboutme");
                }
            })
            .catch((e) => console.log(e));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tag !== this.state.tag) {
            fetch(`/users/tags?search=${this.state.tag}`)
                .then((res) => res.json())
                .then((results) => {
                    if (results.length < 1) {
                        this.setState({ resTags: this.state.tag });
                    } else {
                        this.setState({ resTags: results });
                        this.setState({ isOpen: true });
                    }
                });
        }
    }

    mappedUsers() {
        if (typeof this.state.resTags === "string") {
            return (
                <div
                    className="hoverNselect-tag"
                    onClick={() =>
                        this.setState({
                            tagsList: [
                                ...this.state.tagsList,
                                this.state.resTags,
                            ],
                        })
                    }
                >
                    {this.state.resTags}
                </div>
            );
        }
        return this.state.resTags.map((user) => {
            return (
                <div className="hoverNselect-tag" key={user.id}>
                    <div
                        onClick={() =>
                            this.setState({
                                tagsList: [...this.state.tagsList, user.tag],
                            })
                        }
                        className="finded-users-search-bar"
                    >
                        <h3>{user.tag}</h3>
                    </div>
                </div>
            );
        });
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
                            <div className="artist-post-wrapper">
                                <h1>Create artist page</h1>
                                {this.state.error && (
                                    <p className="p_log">
                                        Oops, something went wrong!
                                    </p>
                                )}
                                <div className="">
                                    <form
                                        className="form-artist-wrapper"
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
                                        <input
                                            onChange={this.handleTagChange}
                                            onBlur={(e) => {
                                                this.setState({
                                                    isOpen: false,
                                                });
                                            }}
                                            onFocus={(e) => {
                                                this.setState({ isOpen: true });
                                            }}
                                            placeholder="tags"
                                            type="tag"
                                            name="tag"
                                        ></input>
                                        <div>
                                            {this.state.resTags &&
                                                this.mappedUsers()}
                                        </div>

                                        <div className="tags-selection">
                                            {this.state.tagsList &&
                                                this.state.tagsList.map(
                                                    (tag, i) => {
                                                        return (
                                                            <div
                                                                className="tags-single"
                                                                key={i}
                                                            >
                                                                <p>{tag}</p>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
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
