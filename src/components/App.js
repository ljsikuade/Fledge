import React from "react";
import style from "../styles/style.scss";
import Moment from "react-moment";
import InstructionModal from "./InstructionModal";
import Navigation from "./Navigation";
import ScrollEvent from "react-onscroll";
import Markdown from "react-markdown";

import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from "react-scroll";

const scrollOptions = {
  duration: 300
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      repos: undefined,
      select: "",
      instructModal: false,
      width: window.innerWidth,
      height: window.innerHeight,
      scrolly: window.scrollY,
      showToTop: false,
      ownedRepos: [],
      user: "Sign in",
      loggedIn: false,
      message: "",
      name: "",
      email: "",
      formSubmitted: false
    };
    this.selected = this.selected.bind(this);
    this.sortOptions = this.sortOptions.bind(this);
    this.sortByPopular = this.sortByPopular.bind(this);
    this.sortByHot = this.sortByHot.bind(this);
    this.sortByRecent = this.sortByRecent.bind(this);
    this.openInstructionsModal = this.openInstructionsModal.bind(this);
    this.toTop = this.toTop.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.logUserIn = this.logUserIn.bind(this);
    this.contact = this.contact.bind(this);
    this.handleMessageInput = this.handleMessageInput.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    fetch("/repos")
      .then(resp => resp.json())
      .then(body => {
        this.setState({ repos: body });
        if (window.location.search.length > 0) {
          this.logUserIn(window.location.search.split("=")[1]);
        }
      });
  }

  logUserIn(token) {
    fetch(`https://api.github.com/user?access_token=${token}`)
      .then(res => res.json())
      .then(body => {
        let owned = this.state.repos.data.search.edges.map(element => {
          if (element.node.owner.id === body.node_id) {
            return element.node.id;
          }
        });
        this.setState({ ownedRepos: owned, user: body.login, loggedIn: true });
      });
  }

  handleScroll() {
    this.setState({ scrolly: window.scrollY });
    if (this.state.scrolly > 10) {
      this.setState({ showToTop: true });
    } else {
      this.setState({ showToTop: false });
    }
  }

  toTop() {
    scroll.scrollToTop(scrollOptions);
  }

  sortOptions(event) {
    if (event.value === "popularity") {
      this.sortByPopular();
    }
    if (event.value === "recent") {
      this.sortByRecent();
    }
    if (event.value === "hot") {
      this.sortByHot();
    }
  }

  openInstructionsModal() {
    this.setState({ instructModal: !this.state.instructModal });
  }

  contact() {
    this.openInstructionsModal();
    scroll.scrollToBottom(scrollOptions);
  }

  sortByPopular() {
    let editableData = this.state.repos;
    // console.log(this.state.repos);
    editableData.data.search.edges
      .sort((a, b) => {
        return a.node.stargazers.totalCount - b.node.stargazers.totalCount;
      })
      .reverse();
    this.setState({ repos: editableData });
  }
  sortByHot() {}

  sortByRecent() {
    let editableData = this.state.repos;
    editableData.data.search.edges
      .sort((a, b) => {
        return new Date(a.node.updatedAt) - new Date(b.node.updatedAt);
      })
      .reverse();
    this.setState({ repos: editableData });
  }

  selected(id) {
    if (this.state.select === id) {
      console.log("yep");
      this.setState({ select: "" });
    } else {
      this.setState({ select: id });
    }
  }

  handleMessageInput(payload) {
    let value = Object.keys(payload)[0];

    if (value === "message") {
      console.log("message", value);
      this.setState({ message: payload.message });
    }
    if (value === "name") {
      this.setState({ name: payload.name });
    }
    if (value === "email") {
      this.setState({ email: payload.email });
    }
  }

  submitMessage(event) {
    event.preventDefault();
    if (!this.state.message === "" || !this.state.email === "") {
      fetch("/email", {
        method: "POST",
        body: JSON.stringify({
          subject: "Fledge-Contact",
          from: this.state.email,
          to: "lukesikuade@gmail.com",
          text:
            this.state.message +
            " From " +
            this.state.name +
            "Email " +
            this.state.email
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(body => {
          if (body === "Success") {
            alert("Email succesfully sent!");
            this.setState({ message: "", name: "", email: "" });
          }
        });
    } else {
      alert(
        "Please ensure that you have left both a message and your email, so that I am able to respond."
      );
    }
  }
  render() {
    return (
      <main className="app">
        <ScrollEvent handleScrollCallback={this.handleScroll} />
        <section className="intro">
          <p className="about">
            Help people new to github find beginner-friendly repositories.
          </p>
        </section>
        <Navigation
          text={this.state.user}
          sortOptions={this.sortOptions}
          createNewEntry={this.createNewEntry}
          loggedIn={this.state.loggedIn}
        />

        {this.state.repos && (
          <div className="repo-list">
            {this.state.repos.data.search.edges.map(edge => {
              return (
                <section
                  style={
                    this.state.ownedRepos.includes(edge.node.id)
                      ? { backgroundColor: "#2c2c2c", color: "#ffffff" }
                      : null
                  }
                  className="repo-entry"
                  key={edge.node.id}
                >
                  <h2 className="repo-name">{edge.node.name}</h2>
                  <p className="repo-desc">{edge.node.description}</p>
                  <p className="repo-date">
                    Last Updated: <Moment fromNow>{edge.node.updatedAt}</Moment>
                  </p>

                  <p className="bookmarked">
                    Bookmarked: {edge.node.stargazers.totalCount} times
                  </p>
                  <section className="link-fledge-file">
                    <div class="link-fledge-container">
                      <a
                        style={
                          this.state.ownedRepos.includes(edge.node.id)
                            ? { color: "#ffffff" }
                            : null
                        }
                        className="ext-link"
                        href={edge.node.url}
                      >
                        <i class="fas fa-external-link-alt" />
                      </a>
                      <span className="fledge-click">
                        <label
                          style={
                            this.state.ownedRepos.includes(edge.node.id)
                              ? { color: "#ffffff" }
                              : null
                          }
                          className="fledge-label"
                          onClick={() => this.selected(edge.node.id)}
                        >
                          {" "}
                          .fledge
                          <i class="fas fa-scroll" />
                        </label>
                      </span>
                    </div>
                    {this.state.select === edge.node.id ? (
                      <div>
                        <div
                          style={
                            this.state.ownedRepos.includes(edge.node.id)
                              ? { color: "#ffffff" }
                              : null
                          }
                          className="fledge-file"
                        >
                          <Markdown>{edge.node.object.text}</Markdown>
                        </div>
                        {edge.node.object.text.length <= 1 ? (
                          <label>
                            Not seeing anything? There may be a problem with how
                            this repo is configured.
                            <label
                              className="open-modal-label"
                              onClick={this.openInstructionsModal}
                            >
                              Do you own this repo?
                            </label>
                          </label>
                        ) : null}
                      </div>
                    ) : (
                      <span />
                    )}
                  </section>
                </section>
              );
            })}
          </div>
        )}
        {this.state.instructModal && (
          <InstructionModal
            contact={this.contact}
            onCloseRequest={this.openInstructionsModal}
          />
        )}

        {this.state.showToTop && (
          <button onClick={this.toTop} className="go-top">
            ^
          </button>
        )}

        <section>
          <h2 className="contact-header">Contact Me</h2>
          <form className="contact" onSubmit={this.submitMessage}>
            <textarea
              placeholder="Your message here..."
              value={this.state.message}
              onChange={e =>
                this.handleMessageInput({ message: e.target.value })
              }
              className="messagebox"
            />
            <span className="name-email">
              <input
                value={this.state.name}
                onChange={e =>
                  this.handleMessageInput({ name: e.target.value })
                }
                className="name"
                placeholder="Name"
              />
              <input
                onChange={e =>
                  this.handleMessageInput({ email: e.target.value })
                }
                value={this.state.email}
                className="email"
                placeholder="Email"
              />
            </span>
            <button type="submit" className="messagebutton">
              Send Me a Message
            </button>
          </form>
        </section>
      </main>
    );
  }
}

export default App;
