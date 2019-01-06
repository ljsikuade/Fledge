# Fledge

## About

Fledge is a tool for finding beginner-friendly repositories.
Github is an intimidating place for newbies trying to contribute.
It often isn't clear what tasks are beyond the scope of a beginner,
or if someone starting out would actually make a useful contribution.

Fledge allows developers to flag their repositories as beginner friendly,
by posting simple tasks in a .fledge.md file in their repo.

Fledge will automatically look for repositories that have this file type and list
them.

## Do you own a repository?

To list your repository effectively, you will need to follow two simple steps:

1. Create a .fledge.md file on the master branch ( This is the default. Other branches must configured in-app).
2. Add a new topic to your repository: "fledge".

_Note: You the .fledge.md file must appear as is without prefixes. In the future this will be configurable in-app._

## Technologies Used

I experimented with a number of technologies that are new to me while building this.

- React-Router
- Github OAuth & Github GraphQL API
- Nodemailer
- Superagent
- Moment
- React-Scroll

## Playing With the Source Code

To start getting to grips with the project's source code, some set up is needed.

1. Fork and clone this repository onto your machine.

2. A local installation of all dependencies for the project.

```
npm install
```

3. Setting up the database (This is for extensibility's sake).
   I used MySQL for this project. Make sure you check which brand of SQL is appropriate for you.
   Database queries:

```
CREATE DATABASE fledge_data;

CREATE TABLE repos(repo_id VARCHAR(50) PRIMARY KEY);

CREATE TABLE xss_prevention(stringID INT AUTO_INCREMENT PRIMARY KEY, strings VARCHAR(50));

```

4. Setting up OAuth:
   i) You will need to secure a client id and a client secret from Github's developer settings.
   ii) You will need to create a .env file with the following parameters:
   CLIENT_ID= <<YOUR ID HERE>>  
   CLIENT_SECRET=<<YOUR SECRET HERE>>

DB_HOST=<<YOUR DATABASE HOST HERE>>
DB_USERNAME=<<YOUR DATABASE USERNAME>>
DB_PASSWORD=<<YOUR DATABASE PASSWORD>>

GRAPHQL_AUTHENTICATION = <<YOUR GITHUB PERSONAL ACCESS TOKEN HERE>>

iii) Finally, in the file: src\components\Login.js, enter your client id into state.

## Or See it Live

~~link pending deployment
