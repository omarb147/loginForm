const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
dotenv.config();

const app = express();
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

let db = require("knex")({
  client: "pg",
  version: "7.2",
  connection: {
    host: "127.0.0.1",
    user: "me",
    password: "",
    database: "loginapp"
  }
});

const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  let user = await db("login")
    .where("id", id)
    .first();
  done(null, user);
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const user = await db("login")
        .where("email", username)
        .first();

      if (!user) return done(null, false, { message: "Incorrect Email" });
      const passwordAuth = await bcrypt.compare(password, user.hash);

      if (!passwordAuth) return done(null, false, { message: "Incorrect Password" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(400).send({ message: "logged in using passport" });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db("login")
      .where("email", email)
      .first();

    if (existingUser) return res.status(400).send({ message: "User with that username already exists" });

    const hash = await bcrypt.hash(password, 10);

    user = {
      email,
      hash
    };

    let newUser = await db("login")
      .returning(["id", "email"])
      .insert(user);

    return res.status(200).send({ message: "sucessfully added user", newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "something went wrong" });
  }
});

//SET UP DATABASE

app.get("/", async (req, res) => "hello workld");

app.get("/");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
