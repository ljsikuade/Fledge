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
      </nav>
    );
  }
}
export default Navigation;
