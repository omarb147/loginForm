// const path = require("path");
// const fs = require("fs");
// const https = require("https");
// const http = require("http");

// var certOptions = {
//   key: fs.readFileSync(path.resolve("cert/server.key")),
//   cert: fs.readFileSync(path.resolve("cert/server.crt"))
// };

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

const FacebookStrategy = require("passport-facebook");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await db("login")
          .where("identifier", profile.id)
          .first();

        if (!existingUser) {
          await db("login")
            .insert({ identifier: profile.id, service: profile.provider })
            .returning()
            .then(user => done(null, user))
            .catch(err => console.log(err));
        }
        return done(null, existingUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

app.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/login" }));

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await db("login")
          .where("identifier", profile.emails[0].value)
          .first();

        if (!existingUser) {
          await db("login")
            .insert({ identifier: profile.emails[0].value, service: profile.provider })
            .returning()
            .then(user => {
              return done(null, user);
            })
            .catch(err => console.log(err));
        }
        done(null, existingUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function(req, res) {
  res.redirect("/");
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

app.get("/", async (req, res) => res.send("hello workld"));

app.get("/");

const PORT = process.env.PORT || 5000;
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(certOptions, app);

// httpServer.listen(1000);
// httpsServer.listen(PORT);
app.listen(PORT, (res, req) => console.log(`App listening on PORT ${PORT}`));
