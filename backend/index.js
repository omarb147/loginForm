const passport = require("passport");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const db = require("./Database/db");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  let user = await db("login")
    .where("id", id)
    .first();
  done(null, user);
});

//AUTH STRATEGIES
const { Local } = require("./Passport/Local");
passport.use(Local);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/loggedin",
    failureRedirect: "/"
  }),
  (req, res) => {
    res.status(400).send({ message: "logged in using passport" });
  }
);

app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

app.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/login" }));

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function(req, res) {
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db("login")
      .where("identifier", email)
      .first();

    if (existingUser) return res.status(400).send({ message: "User with that username already exists" });

    const hash = await bcrypt.hash(password, 10);

    user = {
      identifier: email,
      hash
    };

    let newUser = await db("login")
      .returning(["id", "identifier"])
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
