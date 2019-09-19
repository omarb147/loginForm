const express = require("express");
const auth = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db, TABLES } = require("../db");

auth.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// REFACTOR THE Login PROCESSS - JWT section
auth.get("/facebook/callback", passport.authenticate("facebook", { scope: ["email"] }), (req, res) => {
  res.redirect("/");
});

auth.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

auth.get("/google/callback", passport.authenticate("google"), (req, res) => {
  return res.redirect("/");
});

auth.post("/local", passport.authenticate("local"), (req, res) => {
  return res.redirect("/");
});

auth.post("/register", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const existingUser = await db(TABLES.USERS)
      .where("identifier", identifier)
      .first();

    if (existingUser) return res.status(400).send({ message: "User with that username already exists" });

    const hash = await bcrypt.hash(password, 10);

    user = {
      identifier,
      password_hash: hash,
      provider: "local"
    };

    let newUser = await db(TABLES.USERS)
      .returning(["id", "identifier"])
      .insert(user);

    return res.status(200).send({ message: "sucessfully added user", newUser });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "something went wrong" });
  }
});

auth.get("/current_user", (req, res) => {
  res.send(req.user);
});

auth.get("/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

module.exports = auth;
