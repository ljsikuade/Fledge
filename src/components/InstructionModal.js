import React from "react";
import ReactDOM from "react-dom";
class InstructionModal extends React.Component {
  constructor() {
    super();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentWillMount() {
    // add event listener for clicks
    document.addEventListener("click", this.handleOutsideClick, false);
  }
  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener("click", this.handleOutsideClick, false);
  }
  handleOutsideClick(e) {
    console.log(this.modal);
    if (!ReactDOM.findDOMNode(this.modal).contains(e.target)) {
      this.props.onCloseRequest();
    }
  }

  render() {
    return (
      <div className="modal-over">
        <div ref={r => (this.modal = r)} className="modal">
          <h1>Correctly Listing Your Repository</h1>
          <p>
            Fledge looks within the Github API for specific traits. If you
            aren't seeing your .fledge file displayed here, then you will have
            to check on the following:{" "}
          </p>
          <ol className="modal-list">
            <li>
              Your .fledge.md is correctly named as such without typos or
              prefix.
            </li>
            <li>
              Your .fledge.md file is on the <b>master</b> branch. Unless
              otherwise <label className="open-modal-label">configured</label>.
            </li>
            <li>Your .fledge.md file is not empty.</li>
          </ol>
          <label onClick={this.props.contact} className="help-label">
            Still having issues?
          </label>
        </div>
      </div>
    );
  }
}
export default InstructionModal;
