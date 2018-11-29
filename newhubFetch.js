const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fetch = require("node-fetch");
app.use(bodyParser.json());
app.use("/static", express.static("static"));
app.set("view engine", "hbs");

const rel = {
  tag_name: "v1.0.0",
  target_commitish: "master",
  name: "v1.0.0",
  body: "Description of the release",
  draft: false,
  prerelease: false
};

fetch("https://github.com/ljsikuade/Guess-the-Movie/releases", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: rel
})
  .then(response => response.json())
  .then(body => console.log(body));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, function() {
  console.log("Listening on port 8080");
});
