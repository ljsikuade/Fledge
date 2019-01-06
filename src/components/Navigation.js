import React from "react";
import Dropdown from "react-dropdown";
import Login from "./Login";
const options = [
  { value: "popularity", label: "Popularity" },
  { value: "recent", label: "Most Recent" },
  { value: "hot", label: "Hot" }
];

const defaultOption = { value: "sort", label: "Sort By" };

class Navigation extends React.Component {
  constructor() {
    super();
    this.state = { loadLoginComponent: false };
    this.loadLogin = this.loadLogin.bind(this);
  }
  loadLogin() {
    this.setState({ loadLoginComponent: !this.state.loadLoginComponent });
  }
  render() {
    return (
      <nav className="navigation">
        <Dropdown
          style={{ cursor: "pointer" }}
          className="drop"
          options={options}
          onChange={this.props.sortOptions}
          value={defaultOption}
        />

        {!this.state.loadLoginComponent && (
          <button className="login-button" onClick={this.loadLogin}>
            {this.props.text}
          </button>
        )}
        {this.state.loadLoginComponent && (
          <Login loggedIn={this.props.loggedIn} />
        )}
      </nav>
    );
  }
}
export default Navigation;
