import { Component } from "react";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import Profile from "./Profile";
import FindPeople from "./FindPeople";
import Main from "./Main";
import OtherProfile from "./OtherProfile";
import Favorites from "./Favorites";
import ChatMessages from "./ChatMessages";
import Registration from "./registration";
import Login from "./login";
import ResetPass from "./ResetPassword";
import Request from "./Request";
import RequestsPage from "./RequestsPage";
import Conversation from "./Conversation";
import ArtistPost from "./ArtistPost";
import SearchResult from "./SearchResult";
import ArtistsByTag from "./ArtistsByTag";
import HamburgerMenu from "./HamburgerMenu";
import Footer from "./Footer";
import { socket } from "./start";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOn: false,
            loginModalOn: false,
            profile_picture_url: "/default.png",
            first: "",
            last: "",
            bio: "",
            instrument: "",
            spotify_link: "",
            youtube_link: "",
            tags: [],
            clicked: false,
            isConnected: false,
            notifications: false,
            notifications_count: null,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handlePicChange = this.handlePicChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onBioUpload = this.onBioUpload.bind(this);
        this.menuList = this.menuList.bind(this);
        this.renderOnlineList = this.renderOnlineList.bind(this);
        this.renderOfflineList = this.renderOfflineList.bind(this);
        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
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
                if(!data){
                    return
                }
                if (data.profile_picture_url) {
                    this.setState(data);
                } else {
                    this.setState({
                        ...data,
                        profile_picture_url: this.state.profile_picture_url,
                    });
                }
            });

        socket.on("notifications", ({ count }) => {
            this.setState({ notifications: true, notifications_count: count });
        });
        socket.on("no-notifications", (data) => {
            this.setState({ notifications: false, notifications_count: null });
        });
    }

    openModal() {
        this.setState({ modalOn: true });
    }

    closeModal() {
        this.setState({ modalOn: false });
    }

    openLoginModal() {
        this.setState({ modalOn: true });
    }

    closeLoginModal() {
        this.setState({ modalOn: false });
    }

    onUpload(picUrl) {
        this.setState({ modalOn: false, profile_picture_url: picUrl });
    }

    handlePicChange(e) {
        this.setState({ picFile: e.target.value });
    }

    onBioUpload(newBio, newSpot, newTube, changedTags) {
        this.setState({
            bio: newBio,
            spotify_link: newSpot,
            youtube_link: newTube,
            tags: changedTags,
        });
    }

    menuList() {
        if (!this.state.clicked) {
            this.setState({ clicked: true });
        } else {
            this.setState({ clicked: false });
        }
    }

    renderOnlineList() {
        return (
            <>
                <CSSTransition
                    in={this.state.clicked}
                    timeout={400}
                    classNames="list-transition"
                    appear
                >
                    <div className="header-list-menu" onClose={this.menuList}>
                        <div>
                            <Link
                                style={{ textDecoration: "none" }}
                                onClick={this.menuList}
                                to="/requests/all"
                                className="menu-links"
                            >
                                Your Inbox
                            </Link>
                        </div>
                        <div>
                            <Link
                                style={{ textDecoration: "none" }}
                                onClick={this.menuList}
                                to="/aboutme"
                                className="menu-links"
                            >
                                Edit your profile
                            </Link>
                        </div>
                        <div>
                            <a href="/logout" className="menu-links">
                                Logout
                            </a>
                        </div>
                    </div>
                </CSSTransition>
            </>
        );
    }

    renderOfflineList() {
        return (
            <>
                <CSSTransition
                    in={this.state.clicked}
                    timeout={400}
                    classNames="list-transition"
                    appear
                >
                    <div className="header-list-menu" onClose={this.menuList}>
                        <div>
                            <Link
                                style={{ textDecoration: "none" }}
                                onClick={this.menuList}
                                to="/register"
                            >
                                Register
                            </Link>
                        </div>
                        <div>
                            <Link
                                style={{ textDecoration: "none" }}
                                onClick={this.menuList}
                                to="/login"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </CSSTransition>
            </>
        );
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <div
                        onClick={this.state.clicked ? this.menuList : () => {}}
                        className="wrapper"
                    >
                        <div className="header">
                            <Link to={"/"} style={{ textDecoration: "none" }}>
                                <div className="logo-wrapper">
                                    <img
                                        className="logo"
                                        src="/logosincol1.png"
                                    />
                                    <h4>COLLABSEEK</h4>
                                </div>
                            </Link>

                            {!this.state.clicked
                                ? ""
                                : this.state.isConnected
                                ? this.renderOnlineList()
                                : this.renderOfflineList()}
                            <div className="find-people-search">
                                <FindPeople
                                    {...this.state}
                                    onBioUpload={this.onBioUpload}
                                    openModal={this.openModal}
                                />
                            </div>
                            <nav className="nav-wrapper">
                                <div>
                                    <div className="hovering-header">
                                        <Link
                                            to={
                                                this.state.isConnected
                                                    ? "/artists/post"
                                                    : "/login"
                                            }
                                            style={{ textDecoration: "none" }}
                                            className="menu-links"
                                        >
                                            Make an artist page
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="hovering-header">
                                        <Link
                                            to="/chatroom"
                                            style={{ textDecoration: "none" }}
                                            className="menu-links"
                                        >
                                            Your Inbox
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="hovering-header">
                                        <Link
                                            to={
                                                this.state.isConnected
                                                    ? "/friends"
                                                    : "/login"
                                            }
                                            style={{ textDecoration: "none" }}
                                            className="menu-links"
                                        >
                                            My Favorites
                                        </Link>
                                    </div>
                                </div>

                                <div
                                    className="select-list"
                                    onClick={this.menuList}
                                >
                                    <div className="select-miniwrapper">
                                        <HamburgerMenu />

                                        <ProfilePic
                                            url={this.state.profile_picture_url}
                                        />
                                        {this.state.notifications && (
                                            <div className="notifications-alert">
                                                <span className="red-dot"></span>
                                                <span className="count-notifications">
                                                    {
                                                        this.state
                                                            .notifications_count
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </nav>
                        </div>

                        {this.state.modalOn && (
                            <Uploader
                                onUpload={this.onUpload}
                                closeModal={this.closeModal}
                            />
                        )}
                        <div className="multi-wrapper">
                            <div className="wrapperRouter">
                                <Route exact path="/">
                                    <Main
                                        {...this.state}
                                        onBioUpload={this.onBioUpload}
                                        openModal={this.openModal}
                                        openLoginModal={this.openLoginModal}
                                    />
                                </Route>
                                <Route path="/artists/post">
                                    <ArtistPost
                                        {...this.state}
                                        onBioUpload={this.onBioUpload}
                                        openModal={this.openModal}
                                    />
                                </Route>

                                <Route path="/users/:otherUserId">
                                    <OtherProfile  isConnected={this.state.isConnected}/>
                                </Route>
                                <Route path="/search">
                                    <SearchResult
                                        isConnected={this.state.isConnected}
                                    />
                                </Route>
                                <Route path="/artistsbytags/:tags">
                                    <ArtistsByTag
                                        isConnected={this.state.isConnected}
                                    />
                                </Route>

                                <Route path="/aboutme">
                                    <Profile
                                        {...this.state}
                                        onBioUpload={this.onBioUpload}
                                        openModal={this.openModal}
                                    />
                                </Route>

                                {this.state.isConnected ? (
                                    <>
                                        <Route path="/friends">
                                            <Favorites {...this.state} />
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
                                            <Login
                                                closeLoginModal={
                                                    this.closeLoginModal
                                                }
                                            />
                                        </Route>
                                        <Route path="/reset">
                                            <ResetPass />
                                        </Route>
                                    </>
                                )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
