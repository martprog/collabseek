import { Component } from "react";
import Profile from "./Profile";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingBio: false,
            newTags: [],
            oldTags: [],
            showResults: true,
        };
        this.renderForm = this.renderForm.bind(this);
        this.isEditing = this.isEditing.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.notEditing = this.notEditing.bind(this);
        this.handleTags = this.handleTags.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
       
    }

   

    onSubmit(e) {
        e.preventDefault();
        const newSpot = e.target.spotify.value;
        const newTube = e.target.youtube.value;
        const newBio = e.target.bio.value;
        const changedTags = [...this.state.newTags];

        // const changedTags =
        //     this.state.oldTags.length < 1
        //         ? [...this.state.newTags, ...this.props.tags]
        //         : this.checkOld;
        // console.log('new array,', this.checkOld());
        const newTagsSend = changedTags;
        // this.state.newTags.length >= 1
        //     ? changedTags
        //     : this.props.tags;
        fetch("/user/profile_bio", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bio: newBio,
                tags: newTagsSend,
                newTube: newTube,
                newSpot: newSpot,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                this.props.onBioUpload(
                    data.bio,
                    data.tags,
                    data.newSpot,
                    data.newTube
                );
                this.setState({ editingBio: false });
            });
    }

    handleTags(e) {
        // e.target.defaultValue = "";
        this.props.tags.filter((tag) => {
            if (tag === e.target.value) {
                this.setState({ oldTags: [...this.state.oldTags, tag] });

            }
        });
        
        this.setState({ showResults: false });
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
        console.log(this.props.tags);
        return (
            <form onSubmit={this.onSubmit}>
                {this.props.tags
                    ? this.props.tags.map((tag, i) => {
                          //   return (
                          //       <div
                          //           onClick={this.handleTags}
                          //           key={i}
                          //           className="tags-profile-wrapper"
                          //       >
                          //           <div className="tags-in-profile">{tag}</div>
                          //       </div>
                          //   );
                          return (
                              <input
                                  key={i}
                                  name={`tag${i}`}
                                  defaultValue={tag}
                                  readOnly="readonly"
                                  onClick={this.handleTags}
                              />
                          );
                      })
                    : ""}

                <textarea name="bio" defaultValue={this.props.bio}></textarea>
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
                <div>{this.state.resTags && this.mappedUsers()}</div>

                <div className="tags-selection">
                    {this.state.newTags &&
                        this.state.newTags.map((tag, i) => {
                            return (
                                <div className="tags-single" key={i}>
                                    <p>{tag}</p>
                                </div>
                            );
                        })}
                </div>
                <div className="textareaBtns">
                    <button className="btns">Done!</button>
                    <button
                        className="btns"
                        type="button"
                        onClick={this.notEditing}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }

    notEditing() {
        this.setState({ editingBio: false });
    }

    isEditing() {
        this.setState({ editingBio: !this.editingBio });
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
                    <div>
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
                        <p>{this.props.bio}</p>
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
