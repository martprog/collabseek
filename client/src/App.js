import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import Profile from "./Profile";
import FindPeople from "./FindPeople";
import Main from "./Main";
import OtherProfile from "./OtherProfile";
import Friends from "./Friends";
import ChatMessages from "./ChatMessages";
import Registration from "./registration";
import Login from "./login";
import ResetPass from "./ResetPassword";
import Request  from "./Request";
import RequestsPage from "./RequestsPage";
import Conversation from "./Conversation";
import ArtistPost from "./ArtistPost";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOn: false,
            profile_picture_url: "./default.png",
            first: "",
            last: "",
            bio: "",
            clicked: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handlePicChange = this.handlePicChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onBioUpload = this.onBioUpload.bind(this);
        this.menuList = this.menuList.bind(this);
        this.renderList = this.renderList.bind(this);
    }

    componentDidMount() {
        fetch("/user/id.json")
            .then((res) => res.json())
            .then((data) => {
                if (!data.userId) {
                    this.setState({ isConnected: false });
                } else {
                    console.log("user  logged in!");
                    this.setState({ isConnected: true });
                }
            })
            .catch((e) => console.log(e));

        fetch("/user/me.json")
            .then((res) => res.json())
            .then((data) => {
                if (data.profile_picture_url) {
                    this.setState(data);
                } else {
                    this.setState({ first: data.first });
                }
            });
    }

    openModal() {
        this.setState({ modalOn: true });
    }

    closeModal() {
        this.setState({ modalOn: false });
    }

    onUpload(picUrl) {
        this.setState({ modalOn: false, profile_picture_url: picUrl });
    }

    handlePicChange(e) {
        this.setState({ picFile: e.target.value });
    }

    onBioUpload(newBio) {
        this.setState({ bio: newBio });
    }

    menuList() {
        if (!this.state.clicked) {
            this.setState({ clicked: true });
        } else {
            this.setState({ clicked: false });
        }
    }

    renderList() {
        return (
            <>
                <CSSTransition
                    in={this.state.clicked}
                    timeout={400}
                    classNames="list-transition"
                    appear
                ></CSSTransition>
            </>
        );
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    {/* <div
                        onClick={this.state.clicked ? this.menuList : () => {}}
                        className="wrapper"
                    >
                        <ProfilePic
                            url={this.state.profile_picture_url}
                            openModal={this.openModal}
                        />
                    </div>
                    {this.state.modalOn && (
                        <Uploader
                            onUpload={this.onUpload}
                            closeModal={this.closeModal}
                        />
                    )} */}
                    <div className="multi-wrapper">
                        <div className="wrapperRouter">
                            <Route exact path="/">
                                <Main
                                    {...this.state}
                                    onBioUpload={this.onBioUpload}
                                    openModal={this.openModal}
                                />
                            </Route>
                            <Route  path="/artists/post">
                                <ArtistPost
                                    {...this.state}
                                    onBioUpload={this.onBioUpload}
                                    openModal={this.openModal}
                                />
                            </Route>
                            <a href="/logout">logout</a>
                            <Route path="/findusers">
                                <FindPeople
                                    {...this.state}
                                    onBioUpload={this.onBioUpload}
                                    openModal={this.openModal}
                                />
                            </Route>
                            <Route path="/users/:otherUserId">
                                <OtherProfile />
                            </Route>
                            
                            <Route path="/aboutme">
                                <Profile
                                    {...this.state}
                                    onBioUpload={this.onBioUpload}
                                    openModal={this.openModal}
                                />
                            </Route>
                            <div>

                                <Link to={"/artists/post"}>Get your artist Page!</Link>
                            </div>
                            {this.state.isConnected ? (
                                <>
                                    <Route path="/friends">
                                        <Friends />
                                    </Route>
                                    <Route path="/chatroom">
                                        <ChatMessages />
                                    </Route>
                                    <Route path="/requests/all">
                                        <RequestsPage />
                                    </Route>
                                    <Route path="/request/:otherUserId">
                                        <Request />
                                    </Route>
                                    <Route path="/conversation/:otherUserId">
                                        <Conversation />
                                    </Route>
                                </>
                            ) : (
                                <>
                                    <Route exact path="/register">
                                        <Registration />
                                    </Route>
                                    <Route path="/login">
                                        <Login />
                                    </Route>
                                    <Route path="/reset">
                                        <ResetPass />
                                    </Route>
                                </>
                            )}
                        </div>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
