import { Component } from "react";
import Profile from "./Profile";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingBio: false,
            newTags: [],
            showResults: true,
        };
        this.renderForm = this.renderForm.bind(this);
        this.isEditing = this.isEditing.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.notEditing = this.notEditing.bind(this);
        this.handleTags = this.handleTags.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        const newBio = e.target.bio.value;
        const newTagsSend = this.state.newTags.length >= 1 ? this.state.newTags : this.props.tags;
        fetch("/user/profile_bio", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bio: newBio,
                newTags: newTagsSend,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                this.props.onBioUpload(data.bio);
                this.setState({ editingBio: false });
            });
    }

    handleTags(e) {
        this.props.tags.filter((tag) => {
            if (tag !== e.target.value) {
                this.setState({ newTags: [...this.state.newTags, tag] });
            }
        });
        this.setState({ showResults: false });
    }

    renderForm() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.props.tags
                    ? this.props.tags.map((tag, i) => {
                          return (
                              <div
                                  onClick={this.handleTags}
                                  key={i}
                                  className="tags-profile-wrapper"
                              >
                                  <div className="tags-in-profile">{tag}</div>
                              </div>
                          );
                      })
                    : ""}

                <textarea name="bio" defaultValue={this.props.bio}></textarea>

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
                {console.log(this.state.newTags)}
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
