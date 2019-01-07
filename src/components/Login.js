import React from "react";
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      disableLink: true,
      stringState: ""
    };
  }

  componentDidMount() {
    const validChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let array = new Uint8Array(40);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));

    const randomState = String.fromCharCode.apply(null, array);
    fetch("/login/state", {
      method: "POST",
      body: JSON.stringify({ state: randomState }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          this.setState({ disableLink: false, stringState: body.stringState });
        }
      });
  }
  render() {
    return (
      <span className="login-link-github">
        {!this.props.loggedIn && (
          <a
            disabled={this.state.disableLink}
            href={`https://github.com/login/oauth/authorize?client_id=e939c3ba043e952c1677&state=${
              this.state.stringState
            }`}
          >
            Login with Github
          </a>
        )}
        {this.props.loggedIn && <a href="/">Logout of Github</a>}
      </span>
    );
  }
}
export default Login;
