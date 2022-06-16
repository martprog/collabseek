import { Component } from "react";

export default class ProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = { hovered: false };
        this.onHover = this.onHover.bind(this);
        this.offHover = this.offHover.bind(this);
    }

    onHover() {
        this.setState({ hovered: true });
    }

    offHover() {
        this.setState({ hovered: false });
    }

    render() {
        return (
            <>
                <img
                    onMouseOver={this.onHover}
                    onMouseLeave={this.offHover}
                    className="profilePic"
                    src={this.props.url || ".default/png"}
                    onClick={this.props.openModal}
                />
            </>
        );
    }
}
