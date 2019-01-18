require("dotenv").config();
const request = require("superagent");
const express = require("express");
const bodyParser = require("body-parser");
const exp = express();
const fetch = require("isomorphic-fetch");
const mysql = require("mysql");
const querystring = require("querystring");
const nodeMailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({ extended: true }));
exp.use("/static", express.static("static"));
exp.set("view engine", "hbs");

process.on("uncaughtException", function(err) {
  console.log(err);
});

exp.get("/", (req, res) => {
  res.render("index");
});

exp.post("/email", (req, res) => {
  const mailgunOptions = {
    auth: {
      api_key: process.env.MAILGUN_ACTIVE_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  };
  const transport = mailgunTransport(mailgunOptions);
  let transporter = nodeMailer.createTransport(transport);
  transporter.sendMail(
    {
      from: req.body.from,
      to: req.body.to, // An array if you have multiple recipients.
      subject: "Fledge Feedback",
      text: req.body.text
    },
    (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log(`Response: ${info}`);
      }
    }
  );
});

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.log("err:" + err);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

exp.get("/authentication", (req, res) => {
  const { query } = req;
  const { code } = query;
  const { state } = query;

  if (!code) {
    return res.send({
      success: false,
      message: `Authentication failed due to invalid API callback. Code: ${code}`
    });
  }
  console.log("query: ", query, "code: ", code, "state: ", state);
  connection.query(
    `SELECT strings FROM ${
      process.env.DB_NAME
    }.xss_prevention WHERE strings = ?`,
    [state],
    (error, results, fields) => {
      if (error || results[0].error) {
        res.send(
          "Security strings did not match any found within our database."
        );
        return;
      }
      request
        .post("https://github.com/login/oauth/access_token")
        .send({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code
        })
        .set("Accept", "application/json")
        .then(result => {
          const query = querystring.stringify({
            token: result.body.access_token
          });

          res.redirect("/?" + query);
        });
    }
  );
});

exp.post("/login/state", (req, res) => {
  connection.query(
    `INSERT INTO ${process.env.DB_NAME}.xss_prevention (strings) VALUE (?);`,
    [req.body.state],
    () => {
      res.json({ success: true, stringState: req.body.state });
    }
  );
});

exp.get("/repos", (req, res) => {
  fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GRAPHQL_AUTHENTICATION}`
    },
    body: JSON.stringify({
      query: `{
        search(query: "topic:fledge", type: REPOSITORY, first: 10) {
          repositoryCount
          edges {
            node {
              ... on Repository {
                owner{
                  id
                }
                updatedAt
                createdAt
                description
                url
                name
                id
                isArchived
                isLocked
                stargazers{
                 totalCount
                }
              isPrivate
                 object(expression: "master:.fledge.md") {
                 ... on Blob {
                     text
                    }
                  }
                }
              }	
                cursor
           }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
     }    
      `
    })
  })
    .then(reply => reply.json())
    .then(body => {
      let refinedData = parseData(body);
      connection.query(
        `SELECT * FROM ${process.env.DB_NAME}.repos`,
        (error, results, fields) => {
          refinedData.data.search.edges.map(element => {
            if (!results.find(el => el.repo_id === element.node.id)) {
              connection.query(
                `INSERT INTO ${process.env.DB_NAME}.repos (repo_id) VALUE(?)`,
                [element.node.id]
              );
            }
          });
        }
      );
      res.json(refinedData);
    });
});

function parseData(dataWhole) {
  dataWhole.data.search.edges = dataWhole.data.search.edges.filter(element => {
    if (element.node.object !== null) {
      return element;
    }
  });
  return dataWhole;
}
const port = process.env.PORT || 8080;
exp.listen(port, () => {
  console.log(`listening on ${port}`);
});
