import { Component } from "react";
import Profile from "./Profile";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingBio: false,
            newTags: [],
            oldTags: [],
            newArrTags: [],
            showResults: true,
            activeIndex: [],
        };
        this.renderForm = this.renderForm.bind(this);
        this.isEditing = this.isEditing.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.notEditing = this.notEditing.bind(this);
        this.handleTags = this.handleTags.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.removeNewTag = this.removeNewTag.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const newSpot = e.target.spotify.value;
        const newTube = e.target.youtube.value;
        const newBio = e.target.bio.value;
        const changedTags = [...this.state.newTags, ...this.state.newArrTags];
        console.log("new arr tags, ", this.state.newArrTags);

        fetch("/user/profile_bio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bio: newBio,
                tags: changedTags,
                newTube: newTube,
                newSpot: newSpot,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                this.props.onBioUpload(
                    data.bio,
                    data.spotify_link,
                    data.youtube_link,
                    data.tags
                );
                this.setState({ editingBio: false });
            });
    }

    handleTags(e, i, tag) {
        let newArr = [];
        const included = this.state.activeIndex.includes(tag);
        let newAdded;
        let newFiltered;

        console.log(newAdded, newFiltered);

        this.state.newArrTags.forEach((tag) => {
            if (tag !== e.target.value) {
                newArr.push(tag);
            }
            return newArr;
        });
        if (included) {
            this.setState({
                newArrTags: newArr,
                activeIndex: newArr,
            });
        } else {
            this.setState({
                newArrTags: newArr,
                activeIndex: newArr,
            });
        }
        console.log(included, this.state.activeIndex);
    }

    handleTagChange(e) {
        this.setState(
            {
                tag: e.target.value,
            },
            () => console.log(this.state)
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tag !== this.state.tag) {
            fetch(`/users/tags?search=${this.state.tag}`)
                .then((res) => res.json())
                .then((results) => {
                    if (results.length < 1) {
                        this.setState({ resTags: this.state.tag });
                        // console.log("resTags:", this.state.resTags, results);
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
                            newTags: [
                                ...this.state.newTags,
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
                    {console.log("que est esto?", user)}
                    <div
                        onClick={() =>
                            this.setState({
                                newTags: [...this.state.newTags, user.tag],
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

    renderForm() {
        return (
            <form onSubmit={this.onSubmit}>
                <textarea name="bio" defaultValue={this.props.bio}></textarea>
                <div className="tags-onEdit">
                    <p>Eliminate tags:</p>
                    {this.props.tags
                        ? this.props.tags.map((tag, i) => {
                              return (
                                  <input
                                      key={i}
                                      name={`tag${i}`}
                                      defaultValue={tag}
                                      readOnly="readonly"
                                      onClick={(e, i) =>
                                          this.handleTags(e, i, tag)
                                      }
                                      className={
                                          !this.state.activeIndex.includes(tag)
                                              ? "tags-in-profile"
                                              : "code-red"
                                      }
                                  />
                              );
                          })
                        : ""}
                </div>
                <p>Add some tags</p>
                <div className="tags-selection">
                    {this.state.newTags &&
                        this.state.newTags.map((tag, i) => {
                            return (
                                <div
                                    onClick={() => this.removeNewTag(tag, i)}
                                    className="tags-in-profile"
                                    key={i}
                                >
                                    <p>{tag}</p>
                                </div>
                            );
                        })}
                </div>
                <input
                    onChange={this.handleTagChange}
                    onBlur={(e) => {
                        setTimeout(
                            () =>
                                this.setState({
                                    isOpen: false,
                                    resTags: "",
                                }),
                            300
                        );
                    }}
                    onFocus={(e) => {
                        this.setState({ isOpen: true });
                    }}
                    placeholder="tags"
                    type="tag"
                    name="tag"
                ></input>
                <div>{this.state.resTags && this.mappedUsers()}</div>
                {console.log("resTags:", this.state.resTags)}

                <div className="edit-links">
                    <input
                        name="spotify"
                        type="text"
                        placeholder="spotify"
                        id="spotify"
                        defaultValue={this.props.spotify_link}
                    />
                    <input
                        name="youtube"
                        type="text"
                        placeholder="youtube"
                        id="youtube"
                        defaultValue={this.props.youtube_link}
                    />
                </div>

                <div className="textareaBtns">
                    <button id="ok-edit-btn" className="btns">
                        Done!
                    </button>
                    <button
                        className="btns"
                        id="cancel-edit-btn"
                        type="button"
                        onClick={this.notEditing}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }

    removeNewTag(tag, i) {
        const newArr = this.state.newTags.filter((item) => item !== tag);

        this.setState({ newTags: newArr });
    }

    notEditing() {
        this.setState({ editingBio: false, activeIndex: [] });
    }

    isEditing() {
        this.setState({
            editingBio: !this.editingBio,
            newArrTags: this.props.tags,
        });
    }

    render() {
        const button =
            this.props.bio == "" || this.props.bio == null
                ? "Add info!"
                : "Edit";
        return (
            <div className="textContainer">
                {this.state.editingBio ? (
                    this.renderForm()
                ) : (
                    <div className="profile-minicontainer">
                        <p>{this.props.bio}</p>
                        <p>{this.props.instrument}</p>
                        <div className="tags-wrapper">
                            {this.props.tags
                                ? this.props.tags.map((tag, i) => {
                                      return (
                                          <div
                                              key={i}
                                              className="tags-profile-wrapper"
                                          >
                                              <div className="tags-in-profile">
                                                  {tag}
                                              </div>
                                          </div>
                                      );
                                  })
                                : ""}
                        </div>
                        <div className="links-container">
                            {this.props.spotify_link ? (
                                <a href={this.props.spotify_link}>
                                    {" "}
                                    <img id="spotify-log" src="/spotify.png" />
                                </a>
                            ) : (
                                ""
                            )}
                            {this.props.youtube_link ? (
                                <a href={this.props.youtube_link}>
                                    {" "}
                                    <img
                                        id="youtube-logo"
                                        src="/youtube1.png"
                                    />
                                </a>
                            ) : (
                                ""
                            )}
                        </div>
                        <button
                            className="btns"
                            id="editBtn"
                            onClick={this.isEditing}
                        >
                            {button}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
